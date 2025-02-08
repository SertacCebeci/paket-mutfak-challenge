import { ShoppingOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

export const BasketTitle: React.FC<{ id: string }> = ({ id }) => {
  return (
    <Typography.Title
      level={4}
      className="flex w-full gap-2 text-start items-center justify-start"
    >
      <ShoppingOutlined />
      <span>{id}</span>
    </Typography.Title>
  );
};
