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

  const updateBasketMutation = useMutation({
    mutationFn: (variables: Partial<Basket>) => 
      API.updateBasket(basket.id, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baskets'] });
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

    if (basket.status === 'on_the_way') {
      return (
        <Button
          type="primary"
          onClick={() => updateBasketMutation.mutate({ status: 'delivered' })}
        >
          Mark as Delivered
        </Button>
      );
    }

    return null;
  };

  return (
    <Card className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3>Basket #{basket.id}</h3>
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
