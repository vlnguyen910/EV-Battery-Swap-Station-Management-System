import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function BookingHeader({ stationName, stationAddress, onBackToMap }) {
  return (
    <div className="bg-white p-6 border-b border-gray-200">
      <button 
        onClick={onBackToMap}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
      >
        <ArrowLeft size={18} className="mr-1" />
        Quay lại
      </button>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{stationName}</h1>
      <p className="text-gray-600 flex items-center">
        <MapPin size={16} className="mr-2 text-gray-500" />
        {stationAddress}
      </p>
    </div>
  );
}