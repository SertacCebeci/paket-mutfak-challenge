import { Card, Typography, Tag, Select, Button } from 'antd';
import { useMutation, useQuery, useQueryClient, API, Order, OrderStatus } from '@paket/api';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const queryClient = useQueryClient();
  const { data: baskets = [] } = useQuery({ queryKey: ['baskets'], queryFn: API.getBaskets });

  const updateOrderMutation = useMutation({
    mutationFn: (variables: { id: string; status: OrderStatus }) => 
      API.updateOrderStatus(variables.id, variables.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const createBasketMutation = useMutation({
    mutationFn: async () => {
      const basket = await API.createBasket({
        courier_id: null,
        status: 'prepared',
        orders: [],
      });
      await API.addOrderToBasket(basket.id, order.id);
      await API.updateOrderBasket(order.id, basket.id);
      return basket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baskets'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const addToBasketMutation = useMutation({
    mutationFn: async (basketId: string) => {
      await API.addOrderToBasket(basketId, order.id);
      await API.updateOrderBasket(order.id, basketId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baskets'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const removeFromBasketMutation = useMutation({
    mutationFn: async () => {
      if (!order.basket_id) return;
      await API.removeOrderFromBasket(order.basket_id, order.id);
      await API.updateOrderBasket(order.id, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baskets'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const renderActions = () => {
    // Prevent any actions if order is on_the_way
    if (order.status === 'on_the_way') {
      return null;
    }

    if (order.status === 'preparing') {
      return (
        <Button 
          type="primary"
          onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'prepared' })}
        >
          Mark as Prepared
        </Button>
      );
    }

    if (order.status === 'prepared' && !order.basket_id) {
      const preparedBaskets = baskets.filter(b => b.status === 'prepared');
      return (
        <div className="flex gap-2">
          <Select
            style={{ width: 200 }}
            placeholder="Select basket"
            options={[
              { label: 'Create new basket', value: 'new' },
              ...preparedBaskets.map(b => ({ 
                label: `Basket #${b.id}`, 
                value: b.id 
              }))
            ]}
            onChange={(value) => {
              if (value === 'new') {
                createBasketMutation.mutate();
              } else {
                addToBasketMutation.mutate(value);
              }
            }}
          />
        </div>
      );
    }

    if (order.basket_id && order.status === 'prepared') {
      return (
        <Button 
          danger
          onClick={() => removeFromBasketMutation.mutate()}
        >
          Remove from Basket
        </Button>
      );
    }

    return null;
  };

  return (
    <Card
      size="small"
      className="mb-2 shadow-sm hover:shadow-md transition-shadow bg-white"
      title={
        <div className="flex justify-between items-center">
          <Typography.Text strong>#{order.id}</Typography.Text>
          {renderActions()}
        </div>
      }
    >
      <Typography.Text type="secondary" className="truncate block">
        {order.items.map((item) => item.name).join(', ')}
      </Typography.Text>
      <Typography.Text type="secondary" className="truncate block mt-2">
        {order.address}
      </Typography.Text>
    </Card>
  );
};
