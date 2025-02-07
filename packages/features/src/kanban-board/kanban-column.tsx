import { OrderCard } from './order-card';
import { BasketContainer } from './basket-container';
import { Basket, Order } from './kanban-atoms';

export type ColumnType = 'preparing' | 'pending' | 'on_the_way';

interface ColumnProps {
  type: ColumnType;
  orders?: Order[];
  baskets?: Basket[];
}

const BasketRenderer: React.FC<{ columnType: ColumnType; baskets: Basket[] }> = ({ columnType, baskets }) => {
  const filteredBaskets = baskets.filter((basket) => {
    if (columnType === 'pending') {
      return basket.status === 'waiting_order' || basket.status === 'prepared';
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
  // filter orders based on the column id
  const filteredOrders = orders.filter((order) => {
    if (columnType === 'preparing') {
      return order.status === 'preparing';
    } else if (columnType === 'pending') {
      // orders that are basketed will be rendered by BasketContainer therefore we don't need to render them here
      return order.status === 'not_basket_prepared';
    }
    // we expect all orders that are on the way to be in basket
    else if (columnType === 'on_the_way') {
      return false;
    }
    return false;
  });

  return (
    <div className="mt-4 pt-4 border-t border-gray-600">
      {filteredOrders.map((order) => (
        <OrderCard key={order.id} {...order} />
      ))}
    </div>
  );
};

export const KanbanColumn: React.FC<ColumnProps> = ({ type, orders = [], baskets = [] }) => {
  const title = type === 'preparing' ? 'Preparing' : type === 'pending' ? 'Pending' : 'On The Way';

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md w-full min-h-[300px]">
      <h2 className="text-lg font-semibold mb-4 text-white">{title}</h2>
      <div className="space-y-4">
        <BasketRenderer columnType={type} baskets={baskets} />
        <OrderRenderer columnType={type} orders={orders} />
      </div>
    </div>
  );
};
