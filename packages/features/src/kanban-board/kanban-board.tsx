import { useAtomValue } from 'jotai';
import { orderAtom, basketAtom } from './kanban-atoms';
import { ColumnType, KanbanColumn } from './kanban-column';
import React from 'react';

// when anything changes in the atoms, this component will re-render
// therefore everthing will rerender
// needs optimization

export const KanbanBoard = () => {
  const orders = useAtomValue(orderAtom);
  const baskets = useAtomValue(basketAtom);

  const columns: { type: ColumnType }[] = [
    {
      type: 'preparing',
    },
    {
      type: 'pending',
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
