import { OrderCard } from './order-card';

import { BasketEntity, OrderEntity } from '@paket/shared';
import { Typography } from 'antd';
import { Basket } from './basket';

export type ColumnType = 'preparing' | 'on_shelf' | 'on_the_way';

interface ColumnProps {
  type: ColumnType;
  orders: OrderEntity[];
  baskets: BasketEntity[];
}

const ColumnHeader: React.FC<{
  type: ColumnType;
  orderCount: number;
  basketCount?: number;
}> = ({ type, orderCount, basketCount }) => {
  const title =
    type === 'preparing'
      ? 'Preparing'
      : type === 'on_shelf'
        ? 'On The Shelf'
        : 'On The Way';

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
        <Basket key={basket.id} basketProp={basket} />
      ))}
    </div>
  );
};

const OrderRenderer: React.FC<{
  columnType: ColumnType;
  orders: OrderEntity[];
}> = ({ columnType, orders }) => {
  const filteredOrders = orders.filter((order) => {
    if (columnType === 'preparing') {
      return order.status === 'preparing';
    } else if (columnType === 'on_shelf') {
      return order.status === 'prepared' && !order.basket_id;
    }
    return false;
  });

  return (
    <div className="mt-4">
      {filteredOrders.map((order) => (
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
      />
      <BasketRenderer columnType={type} baskets={baskets} />
      <OrderRenderer columnType={type} orders={orders} />
    </div>
  );
};
