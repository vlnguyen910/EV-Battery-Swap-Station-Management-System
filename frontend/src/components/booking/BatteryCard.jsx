import React from 'react';
import { Battery, Zap } from 'lucide-react';

export default function BatteryCard({ battery }) {
  return (
    <div 
      className={`p-3 rounded-lg border-2 transition-all ${
        battery.isAvailable 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {battery.isAvailable ? (
            <Battery className="text-green-600" size={16} />
          ) : (
            <Zap className="text-orange-500" size={16} />
          )}
          <span className="ml-1 text-xs font-medium text-gray-600">
            Slot {battery.id}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          battery.status === 'charged' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-orange-100 text-orange-700'
        }`}>
          {battery.status}
        </span>
      </div>
      
      {/* Battery Level Bar */}
      <div className="flex items-center">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              battery.level >= 80 ? 'bg-green-500' :
              battery.level >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${battery.level}%` }}
          />
        </div>
        <span className="ml-2 text-xs font-medium text-gray-700">
          {battery.level}%
        </span>
      </div>
    </div>
  );
}