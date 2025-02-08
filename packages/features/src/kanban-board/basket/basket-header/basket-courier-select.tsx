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

  const availableCouriers = couriers.filter(
    (c) => !basket.courier_id || c.id === basket.courier_id,
  );

  const assignCourierMutation = useMutation({
    mutationFn: (variables: { id: string; courier_id: string }) =>
      API.assignCourierToBasket(variables.id, variables.courier_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baskets', basket.id] });
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
        assignCourierMutation.mutate({ id: basket.id, courier_id: value });
      }}
    />
  );
};
