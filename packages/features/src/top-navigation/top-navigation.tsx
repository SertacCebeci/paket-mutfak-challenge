import { Input } from 'antd';
import { API, Test } from '@paket/shared';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Fuse from 'fuse.js';
import { useQuery } from '@tanstack/react-query';

export const TopNavigation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: API.getOrders,
  });

  const fuse = new Fuse(orders, {
    keys: ['id', 'address', 'items.name'],
    threshold: 0.4,
  });

  const filteredOrders = searchTerm ? fuse.search(searchTerm).map((result) => result.item) : orders;

  const activeOrders = orders.filter((order) => order.status !== 'delivered').length;

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Courier Chef</h1>
            <span className="text-gray-500">{activeOrders} Active Orders</span>
          </div>
          <Input
            placeholder="Search orders..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Test />
      </div>
      <Test />
    </div>
  );
};
