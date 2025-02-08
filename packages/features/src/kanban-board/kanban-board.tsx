import { useQuery, API } from '@paket/shared';
import { ColumnType, KanbanColumn } from './kanban-column';
import React from 'react';

export const KanbanBoard = () => {
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: API.getOrders
  });

  const { data: baskets = [] } = useQuery({
    queryKey: ["baskets"],
    queryFn: API.getBaskets
  })

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
        <KanbanColumn key={column.type} {...column} orders={orders} baskets={baskets} />
      ))}
    </div>
  );
};
