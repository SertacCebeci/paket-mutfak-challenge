import { API } from '@paket/shared';
import { ColumnType, KanbanColumn } from './kanban-column';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

export const KanbanBoard: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isSuccess: isOrdersSuccess } = useQuery({
    queryKey: ['orders'],
    queryFn: API.getOrders,
  });

  React.useEffect(() => {
    if (isOrdersSuccess) {
      orders.map((order) => {
        queryClient.invalidateQueries({ queryKey: ['orders', order.id] });
        queryClient.setQueryData(['orders', order.id], order);
      });
    }
  }, [isOrdersSuccess]);

  const { data: baskets = [], isSuccess: isBasketSuccess } = useQuery({
    queryKey: ['baskets'],
    queryFn: API.getBaskets,
  });

  React.useEffect(() => {
    if (isBasketSuccess) {
      baskets.map((basket) => {
        queryClient.invalidateQueries({ queryKey: ['baskets', basket.id] });
        queryClient.setQueryData(['baskets', basket.id], basket);
      });
    }
  }, [isOrdersSuccess]);

  const columns: { type: ColumnType }[] = [
    {
      type: 'preparing',
    },
    {
      type: 'on_shelf',
    },
    {
      type: 'on_the_way',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.type}
          {...column}
          orders={orders}
          baskets={baskets}
        />
      ))}
    </div>
  );
};
