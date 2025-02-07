import { Card, Typography, Tag } from 'antd';
import { useSetAtom } from 'jotai';
import { OrderStatus, Order, orderAtom } from './kanban-atoms';

const TagsSwitch: React.FC<{ order: Order }> = ({ order }) => {
  const setOrders = useSetAtom(orderAtom);

  if (order.status === 'preparing') {
    return (
      <div>
        <Tag
          className="cursor-pointer"
          color="blue"
          onClick={() => {
            setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'not_basket_prepared' } : o)));
          }}
        >
          Move to Pending
        </Tag>
      </div>
    );
  }

  if (order.status === 'not_basket_prepared') {
    return (
      <div>
        <Tag
          className="cursor-pointer"
          color="blue"
          onClick={() => {
            setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'preparing' } : o)));
          }}
        >
          Move to Preparing
        </Tag>
        <Tag
          className="cursor-pointer"
          color="green"
          onClick={() => {
            setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'in_basket_prepared' } : o)));
          }}
        >
          Move to Basket
        </Tag>
      </div>
    );
  }

  if (order.status === 'in_basket_prepared') {
    return (
      <div>
        <Tag
          className="cursor-pointer"
          color="blue"
          onClick={() => {
            setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'not_basket_prepared' } : o)));
          }}
        >
          Move to Pending
        </Tag>
        <Tag
          className="cursor-pointer"
          color="green"
          onClick={() => {
            setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'on_the_way' } : o)));
          }}
        >
          Move to On The Way
        </Tag>
      </div>
    );
  }

  if (order.status === 'on_the_way') {
    return (
      <div>
        <Tag
          className="cursor-pointer"
          color="blue"
          onClick={() => {
            setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'in_basket_prepared' } : o)));
          }}
        >
          Move to Basket
        </Tag>
        <Tag
          className="cursor-pointer"
          color="green"
          onClick={() => {
            setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'delivered' } : o)));
          }}
        >
          Move to Delivered
        </Tag>
      </div>
    );
  }

  return null;
};

export const OrderCard: React.FC<Order> = (props) => {
  const setOrders = useSetAtom(orderAtom);

  const handleStatusChange = () => {
    if (props.status === 'delivered') return;
    if (props.status === 'on_the_way') return;
    const newStatus = props.status === 'preparing' ? 'not_basket_prepared' : 'preparing';
    setOrders((prev) => prev.map((o) => (o.id === props.id ? { ...o, status: newStatus } : o)));
  };

  return (
    <Card
      size="small"
      className="mb-2 shadow-sm hover:shadow-md transition-shadow bg-white"
      title={
        <div className="flex justify-between items-center">
          <Typography.Text strong>#{props.id}</Typography.Text>
          <TagsSwitch order={props} />
        </div>
      }
    >
      <Typography.Text type="secondary" className="truncate block">
        {props.items.map((item) => item.name).join(', ')}
      </Typography.Text>
      <Typography.Text type="secondary" className="truncate block mt-2">
        {props.address}
      </Typography.Text>
    </Card>
  );
};
