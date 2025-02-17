import { Typography } from 'antd';
import { API, BasketEntity } from '@paket/shared';
import { OrderCard } from '../order-card';
import React from 'react';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { BasketHeader } from './basket-header';
import { useInvalidateAll } from '../../shared/hooks';

interface BasketProps {
  basketProp: BasketEntity;
}

export const Basket: React.FC<BasketProps> = ({ basketProp }) => {
  const {
    data: basket,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ['baskets', basketProp.id],
    queryFn: () => API.getBasket(basketProp.id),
  });

  const invalidateAll = useInvalidateAll();

  const basketOrders = basket?.orders || [];

  const orders = useQueries({
    queries: basketOrders.map((order_id) => ({
      queryKey: ['orders', order_id],
      queryFn: () => API.getOrder(order_id),
    })),
  });

  const markDeliveredMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await API.markBasketAsDelivered(id);
    },

    onSuccess: async () => {
      await invalidateAll();
      await refetch();
    },
  });

  const allOrdersDelivered =
    orders.length > 0
      ? orders.reduce((acc, order) => {
          if (!order.isSuccess) return false;
          return acc && order.data.status === 'delivered';
        }, true)
      : false;

  React.useLayoutEffect(() => {
    if (basket?.status === 'on_the_way' && allOrdersDelivered) {
      markDeliveredMutation.mutate({ id: basket.id });
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
          <span className="text-slate-200 font-semibold text-center w-full flex items-center justify-center">
            No orders in this Basket
          </span>
        )}
      </div>
    </div>
  );
};
