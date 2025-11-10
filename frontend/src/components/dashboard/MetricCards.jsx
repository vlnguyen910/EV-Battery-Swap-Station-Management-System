import React from 'react';
import { Card } from '../ui/card';
import { formatCurrency } from '../../utils/formatters';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Zap,
  MapPin,
} from 'lucide-react';

export default function MetricCards({ data }) {
  const metrics = [
    {
      title: 'Total Transactions',
      value: (data.revenue?.currentMonth?.total_transactions || 0).toLocaleString('vi-VN'),
      icon: Receipt,
      color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
      period: `Avg: ${formatCurrency(data.revenue?.currentMonth?.average_transaction || 0)}`,
    },
    {
      title: 'Total Swaps',
      value: (data.swapAnalytics?.frequency?.total || 0).toLocaleString('vi-VN'),
      icon: Zap,
      color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
      period: `This month: ${data.swapAnalytics?.frequency?.['this_month'] || 0} swaps`,
    },
    {
      title: 'Total Stations',
      value: (data.stationStats?.totalStations || 0).toLocaleString('vi-VN'),
      icon: MapPin,
      color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
      period: 'Active stations',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card
            key={index}
            className="flex flex-col gap-2 p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {metric.title}
              </p>
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${metric.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">
              {metric.value}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-success text-sm font-medium">{metric.change}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{metric.period}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
