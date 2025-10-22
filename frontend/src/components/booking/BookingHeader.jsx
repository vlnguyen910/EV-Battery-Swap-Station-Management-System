import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function BookingHeader({ stationName, stationAddress, onBackToMap }) {
  return (
    <div className="bg-blue-800 p-8 shadow-lg">
      <button 
        onClick={onBackToMap}
        className="flex items-center text-white hover:text-blue-100 mb-6 text-sm font-medium transition-colors duration-200"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Map
      </button>
      
      <h1 className="text-3xl font-bold text-white mb-3">{stationName}</h1>
      <p className="text-blue-100 flex items-center text-lg">
        <MapPin size={18} className="mr-2 text-blue-200" />
        {stationAddress}
      </p>
    </div>
  );
}