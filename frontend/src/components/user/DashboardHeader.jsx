import React from 'react';

export default function DashboardHeader({ name = 'Driver' }) {
  return (
    <div className="flex flex-wrap justify-between gap-3 mb-6">
      <div className="flex min-w-72 flex-col gap-1">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">Good morning, {name}</p>
        <p className="text-gray-600 text-base">Ready for your next journey?</p>
      </div>
    </div>
  );
}
