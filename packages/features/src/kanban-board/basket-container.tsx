import { Card, Select, Button } from 'antd';
import { useMutation, useQuery, useQueryClient,  API, Basket } from '@paket/api';
import { OrderCard } from './order-card';

interface BasketContainerProps {
  basket: Basket;
}

export const BasketContainer = ({ basket }: BasketContainerProps) => {
  const queryClient = useQueryClient();
  const { data: orders = [] } = useQuery({ queryKey: ['orders'], queryFn: API.getOrders });
  const { data: couriers = [] } = useQuery({ queryKey: ['couriers'], queryFn: API.getCouriers });

  const ordersInBasket = orders.filter((order) => basket.orders.includes(order.id));
  const allOrdersDelivered = ordersInBasket.every(order => order.status === 'delivered');

  const updateBasketMutation = useMutation({
    mutationFn: async (variables: Partial<Basket>) => {
      // If we're moving to on_the_way, update all orders in the basket
      if (variables.status === 'on_the_way') {
        await Promise.all(
          ordersInBasket.map(order => 
            API.updateOrderStatus(order.id, 'on_the_way')
          )
        );
      }

      // If all orders are delivered, automatically mark basket as delivered
      if (allOrdersDelivered) {
        variables.status = 'delivered';
      }

      return API.updateBasket(basket.id, variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baskets'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const deleteBasketMutation = useMutation({
    mutationFn: async () => {
      // First update all orders in the basket to remove basket_id
      await Promise.all(
        ordersInBasket.map(order => 
          API.updateOrderBasket(order.id, null)
        )
      );
      await API.deleteBasket(basket.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baskets'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const renderActions = () => {
    if (basket.status === 'prepared') {
      return (
        <div className="flex gap-2">
          <Select
            style={{ width: 200 }}
            placeholder="Assign courier"
            value={basket.courier_id || undefined}
            options={couriers.map(c => ({ 
              label: c.name, 
              value: c.id 
            }))}
            onChange={(value) => {
              updateBasketMutation.mutate({ courier_id: value });
            }}
          />
          {basket.courier_id && ordersInBasket.length > 0 && (
            <Button
              type="primary"
              onClick={() => updateBasketMutation.mutate({ status: 'on_the_way' })}
            >
              Move to On The Way
            </Button>
          )}
          <Button 
            danger
            onClick={() => deleteBasketMutation.mutate()}
          >
            Delete Basket
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3>Basket #{basket.id}</h3>
          {basket.status === 'on_the_way' && (
            <span className="text-sm text-gray-500">
              ({ordersInBasket.filter(o => o.status === 'delivered').length}/{ordersInBasket.length} delivered)
            </span>
          )}
        </div>
        {renderActions()}
      </div>
      <div>
        {ordersInBasket.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </Card>
  );
};
