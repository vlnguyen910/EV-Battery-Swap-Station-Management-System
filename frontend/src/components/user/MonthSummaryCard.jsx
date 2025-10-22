import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

export default function MonthSummaryCard({ stats }) {
  const data = stats && stats.length ? stats : [
    { label: 'Total Swaps', value: '12' },
    { label: 'Total Cost', value: '$150.75' },
    { label: 'Avg. Time', value: '25 min' },
  ];

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle>This Month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {data.map((item, idx) => (
            <div key={idx} className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">{item.label}</p>
              <p className="text-gray-900 text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
