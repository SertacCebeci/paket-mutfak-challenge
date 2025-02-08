import { Card, Typography, Tag, Select, Button, Tooltip } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, CreditCardOutlined } from '@ant-design/icons';
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
        delivered_by: null,
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

  const renderTimer = () => {
    if (order.status === 'preparing') {
      const deliveryTime = new Date(order.delivery_time);
      const timeLeft = deliveryTime.getTime() - Date.now();
      const minutesLeft = Math.floor(timeLeft / 1000 / 60);
      
      return (
        <Tooltip title="Time until delivery">
          <Tag icon={<ClockCircleOutlined />} color={minutesLeft < 30 ? 'red' : 'blue'}>
            {minutesLeft}m
          </Tag>
        </Tooltip>
      );
    }
    return null;
  };

  const renderActions = () => {
    // Orders in on_the_way status can only be marked as delivered
    if (order.status === 'on_the_way') {
      return (
        <Button
          type="primary"
          disabled={false}
          onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'delivered' })}
        >
          Mark as Delivered
        </Button>
      );
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
          <div className="flex items-center gap-2">
            <Typography.Text strong>#{order.id}</Typography.Text>
            {renderTimer()}
          </div>
          {renderActions()}
        </div>
      }
    >
      <div className="space-y-2">
        <Typography.Text type="secondary" className="block">
          <div className="flex items-center gap-1">
            <EnvironmentOutlined />
            <span className="truncate">{order.address}</span>
          </div>
        </Typography.Text>
        <Typography.Text type="secondary" className="block">
          <div className="flex items-center gap-1">
            <CreditCardOutlined />
            {order.payment}
          </div>
        </Typography.Text>
        <div className="flex flex-wrap gap-1">
          {order.items.map((item) => (
            <Tag key={item.id}>{item.name}</Tag>
          ))}
        </div>
      </div>
    </Card>
  );
};
