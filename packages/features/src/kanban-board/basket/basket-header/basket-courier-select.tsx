import { API, BasketEntity } from '@paket/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Select } from 'antd';

export const BasketCourierSelect: React.FC<{ basket: BasketEntity }> = ({
  basket,
}) => {
  const { data: couriers = [] } = useQuery({
    queryKey: ['couriers'],
    queryFn: API.getCouriers,
  });

  const queryClient = useQueryClient();

  const availableCouriers = couriers.filter((courier) => {
    return courier.basket_id === null || courier.basket_id === basket.id;
  });

  const assignCourierMutation = useMutation({
    mutationFn: async ({
      basket,
      new_courier_id,
    }: {
      basket: BasketEntity;
      new_courier_id: string;
    }) => {
      if (basket.courier_id === new_courier_id) return;
      if (basket.courier_id)
        await API.removeCourierFromBasket(basket.id, basket.courier_id);

      await API.assignCourierToBasket(basket.id, new_courier_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baskets', basket.id] });
      queryClient.invalidateQueries({ queryKey: ['couriers'] });
    },
  });

  if (basket.status !== 'prepared') return null;

  return (
    <Select
      placeholder="Assign courier"
      className="w-full"
      value={basket.courier_id || undefined}
      options={availableCouriers.map((c) => ({
        label: c.name,
        value: c.id,
      }))}
      onChange={(value) => {
        assignCourierMutation.mutate({ basket: basket, new_courier_id: value });
      }}
    />
  );
};
