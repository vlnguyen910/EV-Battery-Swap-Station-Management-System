import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { TrendingUp, Clock, Flame } from 'lucide-react';

export default function SwapAnalytics({ data }) {
  const swapAnalytics = data.swapAnalytics;

  if (!swapAnalytics) {
    return null;
  }

  const frequency = swapAnalytics.frequency || {};
  const peakHours = swapAnalytics.peakHours || {};

  const frequencyData = [
    { period: 'Today', count: frequency.today || 0 },
    { period: 'This Week', count: frequency.this_week || 0 },
    { period: 'This Month', count: frequency.this_month || 0 },
    { period: 'Total', count: frequency.total || 0 },
  ];

  const hourlyData = peakHours.hourly_distribution || [];
  const peakHoursList = peakHours.peak_hours || [];

  return (
    <Card className="mb-8 overflow-hidden">
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-success" />
          Swap Activity Analysis
        </h3>
      </div>

      {/* Frequency Overview */}
      <div className="grid grid-cols-4 md:grid-cols-4 border-b border-gray-200 dark:border-gray-800">
        <div className="p-5 text-center border-r border-gray-200 dark:border-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {frequency.today || 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
        </div>
        <div className="p-5 text-center md:border-r border-gray-200 dark:border-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {frequency.this_week || 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
        </div>
        <div className="p-5 text-center border-r border-gray-200 dark:border-gray-800">
          <p className="text-2xl font-bold text-primary">{frequency.this_month || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
        </div>
        <div className="p-5 text-center">
          <p className="text-2xl font-bold text-success">{frequency.total || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
        </div>
      </div>

      {/* Averages */}
      <div className="grid grid-cols-3 gap-4 p-5 border-b border-gray-200 dark:border-gray-800">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 uppercase font-semibold">
            Avg per Day
          </p>
          <p className="text-2xl font-bold text-primary">
            {frequency.averages?.per_day || 0}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 uppercase font-semibold">
            Avg per Week
          </p>
          <p className="text-2xl font-bold text-success">
            {frequency.averages?.per_week || 0}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 uppercase font-semibold">
            Avg per Month
          </p>
          <p className="text-2xl font-bold text-warning">
            {frequency.averages?.per_month || 0}
          </p>
        </div>
      </div>

      {/* Peak Hours Analysis */}
      <div className="p-5">
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-danger" />
            Peak Hours (Top 5)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {peakHoursList.slice(0, 5).map((peak, index) => (
              <div
                key={index}
                className="bg-danger/5 border border-danger/20 rounded-lg p-3 text-center"
              >
                <p className="text-2xl font-bold text-danger">{peak.hour}:00</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {peak.count} swaps ({peak.percentage}%)
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Distribution Chart */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Hourly Distribution (24 hours)
          </h4>
          {hourlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="hour"
                  stroke="#9ca3af"
                  tickFormatter={(value) => `${value}:00`}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value, name) => {
                    if (name === 'count') return [value, 'Swaps'];
                    return value;
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#2563eb"
                  name="Number of Swaps"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No hourly data available
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Peak Activity Insights
          </p>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>
              • Peak swap time:{' '}
              <strong>
                {peakHoursList[0]?.hour}:00 - {peakHoursList[0]?.count} swaps (
                {peakHoursList[0]?.percentage}%)
              </strong>
            </li>
            <li>
              • Total swaps in {peakHours.month}/{peakHours.year}:{' '}
              <strong>{peakHours.total_swaps}</strong>
            </li>
            <li>
              • Recommend: Ensure adequate staff and battery inventory during peak hours
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
