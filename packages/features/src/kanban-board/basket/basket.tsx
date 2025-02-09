import { Typography } from 'antd';
import { API } from '@paket/shared';
import { OrderCard } from '../order-card';
import React from 'react';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { BasketHeader } from './basket-header';
import { useInvalidateAll } from '../../shared/hooks';

interface BasketProps {
  basketId: string;
}

export const Basket: React.FC<BasketProps> = ({ basketId }) => {
  const {
    data: basket,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ['baskets', basketId],
    queryFn: () => API.getBasket(basketId),
  });

  const invalidateAll = useInvalidateAll();

  const basketOrders = basket?.orders || [];

  const orders = useQueries({
    queries: basketOrders.map((order_id) => ({
      queryKey: ['orders', order_id],
      queryFn: () => API.getOrder(order_id),
    })),
  });

  const allOrdersDelivered =
    orders.length > 0
      ? orders.reduce((acc, order) => {
          if (!order.isSuccess) return false;
          return acc && order.data.status === 'delivered';
        }, true)
      : false;

  React.useEffect(() => {
    if (allOrdersDelivered) {
      Promise.all(
        basketOrders.map((order_id) =>
          API.updateOrderStatus(order_id, 'delivered'),
        ),
      );
      console.log('all orders delivered');
      API.updateBasket(basketId, {
        ...basket,
        delivered_by: basket?.courier_id,
        courier_id: null,
        status: 'delivered',
      });

      if (basket?.courier_id)
        API.removeCourierFromBasket(basketId, basket?.courier_id);
      invalidateAll();
      refetch();
    }
  }, [allOrdersDelivered]);

  if (!isSuccess) return null;

  if (orders.some((order) => !order.isSuccess)) return null;

  return (
    <div className="bg-slate-500 border border-slate-800 rounded-lg mb-4 overflow-hidden hover:shadow-md transition-all opacity-75">
      <BasketHeader basket={basket} />
      <div className="p-4 space-y-2">
        {orders.map((order) => {
          return order.isSuccess ? (
            <OrderCard key={order.data.id} order={order.data} />
          ) : null;
        })}
        {orders.length === 0 && (
          <Typography.Text type="secondary" className="block text-center py-4">
            No orders in this BasketEntity
          </Typography.Text>
        )}
      </div>
    </div>
  );
};
