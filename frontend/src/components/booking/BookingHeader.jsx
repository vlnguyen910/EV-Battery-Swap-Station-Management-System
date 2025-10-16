import React from 'react';
import { ArrowLeft, Battery, MapPin } from 'lucide-react';

export default function BookingHeader({ stationName, stationAddress, onBackToMap }) {
  return (
    <div className="p-6 border-b border-gray-200">
      <button 
        onClick={onBackToMap}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Map
      </button>
      
      {/* Station Header */}
      <div className="flex items-start mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
          <Battery className="text-green-600" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{stationName}</h1>
          <p className="text-gray-600 text-sm flex items-center mt-1">
            <MapPin size={14} className="mr-1" />
            {stationAddress}
          </p>
        </div>
      </div>
    </div>
  );
}