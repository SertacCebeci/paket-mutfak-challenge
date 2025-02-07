import { useAtomValue } from 'jotai';
import { Basket, orderAtom } from './kanban-atoms';
import { OrderCard } from './order-card';

interface BasketContainerProps {
  basket: Basket;
}

export const BasketContainer = ({ basket }: BasketContainerProps) => {
  const orders = useAtomValue(orderAtom);
  const ordersInBasket = orders.filter((order) => basket.orders.includes(order.id));

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="bg-gray-700 px-4 py-2 flex items-center justify-between">
        <h3 className="text-white font-medium">#{basket.id}</h3>
        <div className="bg-purple-600 text-white text-sm px-2 py-1 rounded">Courier #{basket.courier_id}</div>
      </div>
      <div className="p-3 min-h-[100px] bg-opacity-50 bg-gray-700">
        {ordersInBasket.length > 0 ? (
          ordersInBasket.map((order) => <OrderCard key={order.id} {...order} />)
        ) : (
          <div className="h-full min-h-[100px] flex items-center justify-center">
            <p className="text-gray-400 text-sm">Empty basket</p>
          </div>
        )}
      </div>
    </div>
  );
};
