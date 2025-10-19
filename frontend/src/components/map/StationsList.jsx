import React from 'react';
import StationCard from './StationCard';

export default function StationsList({ stations, onStationClick }) {
  return (
    <div className="h-full p-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full">
        <div className="px-4 py-3 border-b border-gray-100 rounded-t-lg">
          <h2 className="font-semibold text-gray-900">Nearby Stations</h2>
          <p className="text-sm text-gray-600">{stations.length} stations found</p>
        </div>

        <div className="h-full overflow-y-auto pb-16">
          {stations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onClick={onStationClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}