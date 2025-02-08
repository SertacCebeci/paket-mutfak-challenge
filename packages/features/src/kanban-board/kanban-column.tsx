import { OrderCard } from './order-card';

import { BasketEntity, OrderEntity } from '@paket/shared';
import { Select, Typography } from 'antd';
import { useState } from 'react';
import { Basket } from './basket';

export type ColumnType = 'preparing' | 'on_shelf' | 'on_the_way';
type SortOption = 'time' | 'address' | 'restaurant';
type SortDirection = 'asc' | 'desc';

interface ColumnProps {
  type: ColumnType;
  orders: OrderEntity[];
  baskets: BasketEntity[];
}

const ColumnHeader: React.FC<{
  type: ColumnType;
  orderCount: number;
  basketCount?: number;
  onSortChange: (option: SortOption, direction: SortDirection) => void;
}> = ({ type, orderCount, basketCount, onSortChange }) => {
  const title =
    type === 'preparing'
      ? 'Preparing'
      : type === 'on_shelf'
        ? 'On The Shelf'
        : 'On The Way';

  const sortOptions = {
    preparing: [
      { label: 'Preparation Time ↑', value: 'time_asc' },
      { label: 'Preparation Time ↓', value: 'time_desc' },
      { label: 'Restaurant Name ↑', value: 'restaurant_asc' },
      { label: 'Restaurant Name ↓', value: 'restaurant_desc' },
    ],
    on_shelf: [
      { label: 'Time Since Prepared ↑', value: 'time_asc' },
      { label: 'Time Since Prepared ↓', value: 'time_desc' },
      { label: 'Delivery Address ↑', value: 'address_asc' },
      { label: 'Delivery Address ↓', value: 'address_desc' },
    ],
    on_the_way: [
      { label: 'Courier Name ↑', value: 'courier_asc' },
      { label: 'Courier Name ↓', value: 'courier_desc' },
      { label: 'Order Count ↑', value: 'count_asc' },
      { label: 'Order Count ↓', value: 'count_desc' },
    ],
  }[type];

  return (
    <div className="flex items-center justify-between mb-4 text-white">
      <div>
        <Typography.Title level={4} className="mb-0 text-white">
          {title}
        </Typography.Title>
        <Typography.Text type="secondary">
          {orderCount} Orders {basketCount ? `in ${basketCount} Baskets` : ''}
        </Typography.Text>
      </div>
      <Select
        style={{ width: 200 }}
        placeholder="Sort by..."
        options={sortOptions}
        onChange={(value) => {
          const [option, direction] = value.split('_');
          onSortChange(option as SortOption, direction as SortDirection);
        }}
      />
    </div>
  );
};

const BasketRenderer: React.FC<{
  columnType: ColumnType;
  baskets: BasketEntity[];
}> = ({ columnType, baskets }) => {
  const filteredBaskets = baskets.filter((basket) => {
    if (columnType === 'on_shelf') {
      return basket.status === 'prepared';
    } else if (columnType === 'on_the_way') {
      return basket.status === 'on_the_way';
    }
    return false;
  });

  return (
    <div>
      {filteredBaskets.map((basket) => (
        <Basket key={basket.id} basketId={basket.id} />
      ))}
    </div>
  );
};

const OrderRenderer: React.FC<{
  columnType: ColumnType;
  orders: OrderEntity[];
  sortOption: SortOption;
  sortDirection: SortDirection;
}> = ({ columnType, orders, sortOption, sortDirection }) => {
  const filteredOrders = orders.filter((order) => {
    if (columnType === 'preparing') {
      return order.status === 'preparing';
    } else if (columnType === 'on_shelf') {
      return order.status === 'prepared' && !order.basket_id;
    }
    return false;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    switch (sortOption) {
      case 'time':
        return (
          (new Date(a.delivery_time).getTime() -
            new Date(b.delivery_time).getTime()) *
          multiplier
        );
      case 'address':
        return a.address.localeCompare(b.address) * multiplier;
      default:
        return 0;
    }
  });

  return (
    <div className="mt-4">
      {sortedOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export const KanbanColumn: React.FC<ColumnProps> = ({
  type,
  orders,
  baskets,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSortChange = (option: SortOption, direction: SortDirection) => {
    setSortOption(option);
    setSortDirection(direction);
  };

  const filteredOrders = orders.filter((order) => {
    if (type === 'preparing') return order.status === 'preparing';
    if (type === 'on_shelf')
      return order.status === 'prepared' && !order.basket_id;
    return false;
  });

  const filteredBaskets = baskets.filter((basket) => {
    if (type === 'on_shelf') return basket.status === 'prepared';
    if (type === 'on_the_way') return basket.status === 'on_the_way';
    return false;
  });

  return (
    <div className="bg-slate-100 p-4 rounded-lg">
      <ColumnHeader
        type={type}
        orderCount={filteredOrders.length}
        basketCount={filteredBaskets.length || undefined}
        onSortChange={handleSortChange}
      />
      <BasketRenderer columnType={type} baskets={baskets} />
      <OrderRenderer
        columnType={type}
        orders={orders}
        sortOption={sortOption}
        sortDirection={sortDirection}
      />
    </div>
  );
};
