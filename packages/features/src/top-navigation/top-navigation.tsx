import { Input } from 'antd';
import { API } from '@paket/shared';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export const TopNavigation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: API.getOrders,
  });

  const activeOrders = orders.filter(
    (order) => order.status !== 'delivered',
  ).length;

  return (
    <div className="bg-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Courier Chef</h1>
            <span className="text-gray-700">{activeOrders} Active Orders</span>
          </div>
        </div>
      </div>
    </div>
  );
};
