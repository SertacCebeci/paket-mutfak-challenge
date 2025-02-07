import { OrderCard } from './order-card';
import { BasketContainer } from './basket-container';
import { Basket, Order } from '@paket/api';

export type ColumnType = 'preparing' | 'on_shelf' | 'on_the_way';

interface ColumnProps {
  type: ColumnType;
  orders: Order[];
  baskets: Basket[];
}

const BasketRenderer: React.FC<{ columnType: ColumnType; baskets: Basket[] }> = ({ columnType, baskets }) => {
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
        <BasketContainer key={basket.id} basket={basket} />
      ))}
    </div>
  );
};

const OrderRenderer: React.FC<{ columnType: ColumnType; orders: Order[] }> = ({ columnType, orders }) => {
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

export const KanbanColumn: React.FC<ColumnProps> = ({ type, orders, baskets }) => {
  const title = type === 'preparing' ? 'Preparing' : type === 'on_shelf' ? 'On The Shelf' : 'On The Way';

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <BasketRenderer columnType={type} baskets={baskets} />
      <OrderRenderer columnType={type} orders={orders} />
    </div>
  );
};
