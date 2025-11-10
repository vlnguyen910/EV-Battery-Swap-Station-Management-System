import React from 'react';
import { Card } from '../ui/card';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

export default function RevenueAnalytics({ data }) {
  const byPackageData = data.revenue?.byPackage || [];
  const currentMonth = data.revenue?.currentMonth;

  // Transform data for pie chart
  const pieData = byPackageData.map((pkg) => ({
    name: pkg.package_name,
    value: pkg.total_revenue,
  }));

  // Colors for pie chart
  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Line chart data from API
  const lineData = data.revenue?.dailyTrend || [];

  // Chart config for shadcn
  const chartConfig = {
    revenue: {
      label: 'Revenue',
    },
    ...byPackageData.reduce((acc, pkg, idx) => {
      acc[pkg.package_name] = {
        label: pkg.package_name,
        color: COLORS[idx % COLORS.length],
      };
      return acc;
    }, {}),
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue by Package - Pie Chart */}
      <Card className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Revenue by Package
        </h3>
        {byPackageData.length > 0 ? (
          <ChartContainer config={chartConfig} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No revenue data available
          </div>
        )}
      </Card>

      {/* Monthly Revenue Trend - Line Chart */}
      <Card className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Revenue Trend - {currentMonth?.month}/{currentMonth?.year}
        </h3>
        <div className="flex items-center justify-center min-h-[300px]">
          {lineData.length > 0 ? (
            <ChartContainer config={chartConfig} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    stroke="#9ca3af"
                    label={{ value: 'Days in Month', position: 'insideBottomRight', offset: -5 }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No revenue trend data available
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
