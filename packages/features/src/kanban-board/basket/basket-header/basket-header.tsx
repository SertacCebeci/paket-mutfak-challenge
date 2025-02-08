import { BasketEntity } from '@paket/shared';
import { MoveOnTheWayButton } from './actions';
import { DeleteBasket } from './actions/delete-basket';
import { BasketAssignedTo } from './basket-assigned-to';
import { BasketCourierSelect } from './basket-courier-select';
import { BasketDeliveredBy } from './basket-delivered-by';
import { BasketDeliveryProgress } from './basket-delivery-progress';
import { BasketTitle } from './basket-title';

interface BasketEntityHeaderProps {
  basket: BasketEntity;
}

export const BasketHeader: React.FC<BasketEntityHeaderProps> = ({ basket }) => {
  return (
    <div className="w-full">
      <div className="w-full h-full flex items-start justify-start">
        <BasketTitle id={basket.id} />
        <BasketDeliveryProgress basket={basket} />
        <BasketCourierSelect basket={basket} />
      </div>
      <div className="w-full h-full flex items-start justify-start gap-2">
        <MoveOnTheWayButton basket={basket} />
        <DeleteBasket basket={basket} />
      </div>

      <div>
        <BasketAssignedTo basket={basket} />
        <BasketDeliveredBy basket={basket} />
      </div>
    </div>
  );
};
