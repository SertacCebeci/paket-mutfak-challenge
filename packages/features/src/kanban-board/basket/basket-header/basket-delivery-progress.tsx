import { API, BasketEntity } from '@paket/shared';
import { useQueries } from '@tanstack/react-query';
import { Progress } from 'antd';

export const BasketDeliveryProgress: React.FC<{ basket: BasketEntity }> = ({
  basket,
}) => {
  const orders = useQueries({
    queries: basket.orders.map((order_id) => ({
      queryKey: ['orders', order_id],
      queryFn: () => API.getOrder(order_id),
    })),
  });

  if (orders.some((order) => !order.isSuccess)) return null;
  // do not show if basket is prepared
  if (basket.status === 'prepared') return null;

  const progress = Math.round(
    (orders.filter((order) => order.data?.status === 'delivered').length /
      orders.length) *
      100,
  );

  if (progress === 100) {
    API.updateBasket(basket.id, {
      ...basket,
      status: 'delivered',
    });
  }

  return (
    <Progress
      type="line"
      percent={progress}
      size="small"
      status={progress === 100 ? 'success' : 'active'}
    />
  );
};
