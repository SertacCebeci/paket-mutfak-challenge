import { DeleteOutlined } from '@ant-design/icons';
import { API, BasketEntity } from '@paket/shared';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'antd';
import { useInvalidateAll } from '../../../../shared/hooks';

// TODO: remove invalidateAll
// add optimistic update
export const DeleteBasket: React.FC<{ basket: BasketEntity }> = ({
  basket,
}) => {
  const invalidateAll = useInvalidateAll();
  const deleteBasketMutation = useMutation({
    mutationFn: async () => {
      Promise.all(
        basket.orders.map((order_id) => API.updateOrderBasket(order_id, null)),
      );
      await API.deleteBasket(basket.id);
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  if (basket.status === 'delivered') return null;
  if (basket.status === 'on_the_way') return null;

  return (
    <Button
      size="small"
      danger
      icon={<DeleteOutlined />}
      onClick={() => deleteBasketMutation.mutate()}
    >
      Delete
    </Button>
  );
};
