import { Typography, Tag, Select, Button, Space } from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  ShopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { API, OrderEntity, OrderStatus } from '@paket/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderDetailsModal } from './order-details-modal';

interface OrderCardProps {
  order: OrderEntity;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const queryClient = useQueryClient();
  const { data: baskets = [] } = useQuery({
    queryKey: ['baskets'],
    queryFn: API.getBaskets,
  });

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

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'preparing':
        return 'error';
      case 'prepared':
        return 'warning';
      case 'on_the_way':
        return 'processing';
      case 'delivered':
        return 'success';
      default:
        return 'default';
    }
  };

  const renderOrderInfo = () => (
    <Space direction="vertical" size="small" className="w-full">
      <Space>
        <Tag icon={<ShopOutlined />} color="blue">
          {order.restaurant?.name}
        </Tag>
        <Tag icon={<CreditCardOutlined />} color="green">
          {order.payment}
        </Tag>
      </Space>

      <Typography.Paragraph ellipsis={{ rows: 2 }} className="mb-0">
        <EnvironmentOutlined className="mr-1" />
        <span className="text-xs">{order.address}</span>
      </Typography.Paragraph>

      <Space wrap>
        {order.items.map((item) => (
          <Tag key={item.id} bordered={true}>
            <span className="text-sm">{item.name}</span>
          </Tag>
        ))}
      </Space>
    </Space>
  );

  const renderOrderActions = () => {
    if (order.status === 'on_the_way') {
      return (
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          disabled={false}
          onClick={() =>
            updateOrderMutation.mutate({ id: order.id, status: 'delivered' })
          }
        >
          Mark Delivered
        </Button>
      );
    }

    if (order.status === 'preparing') {
      return (
        <Button
          type="primary"
          icon={<ClockCircleOutlined />}
          onClick={() =>
            updateOrderMutation.mutate({ id: order.id, status: 'prepared' })
          }
        >
          Mark Prepared
        </Button>
      );
    }

    if (order.status === 'prepared' && !order.basket_id) {
      const preparedBaskets = baskets.filter((b) => b.status === 'prepared');
      return (
        <Space>
          <Select
            style={{ width: 200 }}
            placeholder="Select basket"
            onChange={(value) => {
              if (value === 'new') {
                createBasketMutation.mutate();
              } else {
                addToBasketMutation.mutate(value);
              }
            }}
            options={[
              { label: '+ Create new basket', value: 'new' },
              ...preparedBaskets.map((b) => ({
                label: `Basket #${b.id}`,
                value: b.id,
              })),
            ]}
          />
        </Space>
      );
    }

    if (order.basket_id && order.status === 'prepared') {
      return (
        <Button danger onClick={() => removeFromBasketMutation.mutate()}>
          Remove from Basket
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-2 overflow-hidden hover:shadow-xl shadow-md transition-all">
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <Space>
          <OrderDetailsModal order={order} />
          <Tag color={getStatusColor(order.status)}>
            {order.status.replace('_', ' ').toUpperCase()}
          </Tag>
        </Space>
      </div>
      <div className="px-4 py-3">{renderOrderInfo()}</div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        {renderOrderActions()}
      </div>
    </div>
  );
};
