import { CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { API, BasketEntity } from '@paket/shared';
import { useQuery } from '@tanstack/react-query';
import { Typography } from 'antd';

export const BasketDeliveredBy: React.FC<{ basket: BasketEntity }> = ({
  basket,
}) => {
  const { data: courier, isSuccess } = useQuery({
    queryKey: ['couriers', basket.delivered_by],
    queryFn: () => {
      console.log('basmaa');
      if (!basket.delivered_by) return;
      return API.getCourier(basket.delivered_by);
    },
    enabled: () => basket.delivered_by !== null,
  });

  if (isSuccess) {
    return (
      <Typography.Text type="success">
        <CheckCircleOutlined /> Delivered by: {courier?.name}
      </Typography.Text>
    );
  }
};
