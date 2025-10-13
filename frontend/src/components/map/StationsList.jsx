import React from 'react';
import StationCard from './StationCard';

export default function StationsList({ stations, onStationClick }) {
  return (
    <div className="bg-white border-t border-gray-200">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Nearby Stations</h2>
        <p className="text-sm text-gray-600">{stations.length} stations found</p>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {stations.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            onClick={onStationClick}
          />
        ))}
      </div>
    </div>
  );
}