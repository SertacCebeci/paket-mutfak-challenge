import { Card, Select, Button, Space, Progress, Typography, Divider } from 'antd';
import { 
  ShoppingOutlined, 
  UserOutlined, 
  CheckCircleOutlined,
  DeleteOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient,  API, Basket } from '@paket/api';
import { OrderCard } from './order-card';
import React from 'react';

interface BasketContainerProps {
  basket: Basket;
}

export const BasketContainer = ({ basket }: BasketContainerProps) => {
  const queryClient = useQueryClient();
  const { data: orders = [] } = useQuery({ queryKey: ['orders'], queryFn: API.getOrders });
  const { data: availableCouriers = [] } = useQuery({ 
    queryKey: ['availableCouriers'], 
    queryFn: API.getAvailableCouriers 
  });

  const ordersInBasket = orders.filter((order) => basket.orders.includes(order.id));
  const allOrdersDelivered = ordersInBasket.every(order => order.status === 'delivered');

  // Effect to automatically mark basket as delivered when all orders are delivered
  React.useEffect(() => {
    if (basket.status === 'on_the_way' && allOrdersDelivered) {
      updateBasketMutation.mutate({ status: 'delivered' });
    }
  }, [allOrdersDelivered]);

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

      // If all orders are delivered, mark basket as delivered
      if (allOrdersDelivered) {
        await API.markBasketAsDelivered(basket.id);
        return basket;
      }

      return API.updateBasket(basket.id, variables);
    },
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['baskets'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['couriers'] });
      queryClient.invalidateQueries({ queryKey: ['availableCouriers'] });
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

  const assignCourierMutation = useMutation({
    mutationFn: (courierId: string) => 
      API.assignCourierToBasket(basket.id, courierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baskets'] });
      queryClient.invalidateQueries({ queryKey: ['couriers'] });
      queryClient.invalidateQueries({ queryKey: ['availableCouriers'] });
    },
  });

  const renderBasketHeader = () => {
    const deliveredCount = ordersInBasket.filter(o => o.status === 'delivered').length;
    const progress = (deliveredCount / ordersInBasket.length) * 100;

    return (
      <Space className="w-full" direction="vertical" size="small">
        <div className="flex justify-between items-center">
          <Space>
            <Typography.Title level={4} className="mb-0">
              <ShoppingOutlined /> Basket #{basket.id}
            </Typography.Title>
            {basket.status !== 'delivered' && (
              <Progress 
                type="circle" 
                percent={progress} 
                size="small" 
                status={progress === 100 ? 'success' : 'active'}
              />
            )}
          </Space>
          {renderActions()}
        </div>
        
        <Space split={<Divider type="vertical" />}>
          {basket.courier_id && (
            <Typography.Text type="secondary">
              <UserOutlined /> Assigned to: {availableCouriers.find(c => c.id === basket.courier_id)?.name}
            </Typography.Text>
          )}
          {basket.delivered_by && (
            <Typography.Text type="success">
              <CheckCircleOutlined /> Delivered by: {availableCouriers.find(c => c.id === basket.delivered_by)?.name}
            </Typography.Text>
          )}
        </Space>
      </Space>
    );
  };

  const renderActions = () => {
    if (basket.status === 'prepared') {
      return (
        <Space>
          <Select
            style={{ width: 200 }}
            placeholder="Assign courier"
            value={basket.courier_id || undefined}
            options={availableCouriers.map(c => ({ 
              label: c.name, 
              value: c.id 
            }))}
            onChange={(value) => assignCourierMutation.mutate(value)}
          />
          {basket.courier_id && ordersInBasket.length > 0 && (
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => updateBasketMutation.mutate({ status: 'on_the_way' })}
            >
              Send Out
            </Button>
          )}
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteBasketMutation.mutate()}
          >
            Delete
          </Button>
        </Space>
      );
    }
    return null;
  };

  return (
    <Card 
      className="mb-4 shadow-sm hover:shadow-md transition-all"
      title={renderBasketHeader()}
    >
      <div className="space-y-2">
        {ordersInBasket.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
        {ordersInBasket.length === 0 && (
          <Typography.Text type="secondary" className="block text-center py-4">
            No orders in this basket
          </Typography.Text>
        )}
      </div>
    </Card>
  );
};
