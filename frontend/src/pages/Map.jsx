import React, { useState, useCallback, useEffect } from 'react';
import 'trackasia-gl/dist/trackasia-gl.css';
import MapHeader from '../components/map/MapHeader';
import MapSearchBar from '../components/map/MapSearchBar';
import MapContainer from '../components/map/MapContainer';
import StationsList from '../components/map/StationsList';
import { useStation } from '../hooks/useContext';

// Take real station data from StationContext

export default function MapPage() {
  const { stations } = useStation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStations, setFilteredStations] = useState(stations);
  const [map, setMap] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = stations.filter(station =>
      station.name.toLowerCase().includes(query.toLowerCase()) ||
      station.address.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStations(filtered);
  };

  const handleStationClick = (station) => {
    if (map) {
      map.flyTo({
        center: [station.longitude, station.latitude],
        zoom: 15
      });
    }
  };

  const handleMapReady = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // Keep filteredStations in sync when stations change (async fetch)
  useEffect(() => {
    setFilteredStations(stations || []);
  }, [stations]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <MapHeader />

      <MapSearchBar
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />

      {/* Main content area with Map and Stations side by side */}
      <div className="flex flex-1 overflow-hidden bg-gray-50">
        {/* Left side - Map */}
        <div className="flex-1 h-full">
          <MapContainer
            stations={stations}
            onMapReady={handleMapReady}
          />
        </div>

        {/* Right side - Nearby Stations */}
        <div className="w-96 bg-white overflow-y-auto">
          <StationsList
            stations={filteredStations}
            onStationClick={handleStationClick}
          />
        </div>
      </div>
    </div>
  );
}