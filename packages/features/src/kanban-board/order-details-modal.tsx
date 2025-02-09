import React, { useState } from 'react';
import { Modal, Typography, Descriptions, Tag, Space } from 'antd';
import { OrderEntity } from '@paket/shared';

interface OrderDetailsModalProps {
  order: OrderEntity;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-2">
      <Typography.Text
        className="cursor-pointer"
        strong
        onClick={() => setOpen(true)}
      >
        <span className="underline hover:no-underline">Order #{order.id}</span>
      </Typography.Text>
      <Modal
        title={`Order #${order.id}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
      >
        <Descriptions column={1} bordered className="mt-4">
          <Descriptions.Item label={<Space>Restaurant</Space>}>
            <Space direction="vertical">
              <Typography.Text strong>{order.restaurant.name}</Typography.Text>
              <Typography.Text type="secondary">
                {order.restaurant.location}
              </Typography.Text>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label={<Space>Delivery Address</Space>}>
            {order.address}
          </Descriptions.Item>

          <Descriptions.Item label={<Space>Payment Method</Space>}>
            {order.payment}
          </Descriptions.Item>

          <Descriptions.Item label="Items">
            <Space direction="vertical" className="w-full">
              {' '}
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between w-full">
                  {' '}
                  <Typography.Text>{item.name}</Typography.Text>{' '}
                </div>
              ))}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag
              color={
                order.status === 'preparing'
                  ? 'error'
                  : order.status === 'prepared'
                    ? 'warning'
                    : order.status === 'on_the_way'
                      ? 'processing'
                      : 'success'
              }
            >
              {order.status.replace('_', ' ').toUpperCase()}
            </Tag>
          </Descriptions.Item>

          {order.basket_id && (
            <Descriptions.Item label="Basket">
              #{order.basket_id}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Modal>
    </div>
  );
};
