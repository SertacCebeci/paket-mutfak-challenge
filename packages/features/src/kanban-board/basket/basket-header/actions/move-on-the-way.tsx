import { API, BasketEntity, CourierEntity, OrderEntity } from '@paket/shared';

import { useMutation } from '@tanstack/react-query';
import { useInvalidateAll } from '../../../../shared/hooks';
import { Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

// TODO: remove invalidateAll
// add optimistic update
export const MoveOnTheWayButton: React.FC<{ basket: BasketEntity }> = ({
  basket,
}) => {
  const invalidateAll = useInvalidateAll();

  const updateBasketEntityMutation = useMutation({
    mutationFn: async (variables: Partial<BasketEntity>) => {
      if (variables.status === 'on_the_way') {
        await Promise.all(
          basket.orders.map((order_id) =>
            API.updateOrderStatus(order_id, 'on_the_way'),
          ),
        );
      }
      return API.updateBasket(basket.id, variables);
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  if (basket.status === 'delivered') return null;
  if (basket.status === 'on_the_way') return null;
  if (!basket.courier_id) return null;
  if (basket.orders.length === 0) return null;

  return (
    <Button
      type="primary"
      size="small"
      icon={<SendOutlined />}
      onClick={() =>
        updateBasketEntityMutation.mutate({ status: 'on_the_way' })
      }
    >
      Send Out
    </Button>
  );
};
