import { UserOutlined } from '@ant-design/icons';
import { API, BasketEntity } from '@paket/shared';
import { useQuery } from '@tanstack/react-query';
import { Typography } from 'antd';

export const BasketAssignedTo: React.FC<{ basket: BasketEntity }> = ({
  basket,
}) => {
  const { data: courier, isSuccess } = useQuery({
    queryKey: ['couriers', basket.courier_id],
    queryFn: () => {
      if (!basket.courier_id) return;
      return API.getCourier(basket.courier_id);
    },
    enabled: () => basket.courier_id !== null,
  });

  if (basket.status === 'prepared') return null;

  if (isSuccess) {
    return (
      <Typography.Text type="secondary">
        <UserOutlined /> Assigned to: {courier?.name}
      </Typography.Text>
    );
  }
};
