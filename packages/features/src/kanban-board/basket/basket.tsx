import { Typography } from 'antd';
import { API } from '@paket/shared';
import { OrderCard } from '../order-card';
import React from 'react';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { BasketHeader } from './basket-header';

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

  const queryClient = useQueryClient();

  const basketOrders = basket?.orders || [];

  const orders = useQueries({
    queries: basketOrders.map((order_id) => ({
      queryKey: ['orders', order_id],
      queryFn: () => API.getOrder(order_id),
    })),
  });

  // if all orders are delivered, mark basket as delivered
  React.useEffect(() => {
    if (!orders) return;
    if (orders.length === 0) return;
    if (orders.some((order) => !order.isSuccess)) return;

    const allOrdersDelivered = orders.reduce((acc, order) => {
      if (!order.isSuccess) return false;
      return acc && order.data.status === 'delivered';
    }, true);

    if (allOrdersDelivered) {
      console.log('Marking basket as delivered');
      API.markBasketAsDelivered(basketId);
      // remove when pollishing other components
      queryClient.invalidateQueries({ queryKey: ['baskets'] });
      refetch();
    }
  }, [orders]);

  if (!isSuccess) return null;

  if (orders.some((order) => !order.isSuccess)) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden hover:shadow-md transition-all">
      <div className="p-4 border-b border-gray-200">
        <BasketHeader basket={basket} />
      </div>
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
