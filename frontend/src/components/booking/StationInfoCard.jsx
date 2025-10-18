import React from 'react';
import { MapPin, Battery, Clock } from 'lucide-react';

export default function StationInfoCard({ 
  stationName, 
  stationAddress, 
  availableSlots, 
  totalSlots, 
  bookingTime 
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-5">
      <h3 className="font-bold text-gray-900 mb-4 text-lg">Thông Tin Trạm</h3>
      
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">{stationName}</p>
            <p className="text-sm text-gray-600">{stationAddress}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Battery className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Pin còn lại:</p>
            <p className="font-semibold text-gray-900">{availableSlots}/{totalSlots}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-orange-600" />
          <div>
            <p className="text-sm text-gray-600">Thời gian đặt:</p>
            <p className="font-semibold text-gray-900">{bookingTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
