import React from 'react';
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Zap, CheckCircle } from 'lucide-react';

export default function RecentActivityCard({ items = [], onViewAll }) {
  const recent = items.length ? items : [
    { title: 'ChargePoint Station', date: 'Oct 26, 2023', from: '40%', to: '85%', price: '$12.50' },
    { title: 'EVgo Downtown', date: 'Oct 24, 2023', from: '25%', to: '90%', price: '$18.20' },
  ];

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-2">
        <div className="w-full flex items-start justify-between">
          <div>
            <CardTitle className="text-[22px]">Recent Activity</CardTitle>
            <CardDescription>Latest swap/charge events</CardDescription>
          </div>
          <Link
            to="/driver/reports"
            onClick={(e) => {
              if (onViewAll) {
                e.preventDefault();
                onViewAll();
              }
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {recent.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full"><Zap size={18} /></div>
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-gray-500 text-sm">{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{item.from} -&gt; {item.to}</p>
              <p className="text-gray-500 text-sm">{item.price}</p>
            </div>
            <div className="text-green-600 font-medium text-sm flex items-center gap-1">
              <CheckCircle size={16} /> Completed
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
