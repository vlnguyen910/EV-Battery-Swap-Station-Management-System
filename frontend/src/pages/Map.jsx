import React, { useState, useCallback } from 'react';
import 'trackasia-gl/dist/trackasia-gl.css';
import MapHeader from '../components/map/MapHeader';
import MapSearchBar from '../components/map/MapSearchBar';
import MapContainer from '../components/map/MapContainer';
import StationsList from '../components/map/StationsList';

// Mock data for nearby stations
const mockStations = [
  {
    id: 1,
    name: "EV Station 01",
    address: "123 Main Street, Downtown",
    distance: "0.8 km • 3 min drive",
    status: "Available",
    availableBatteries: 12,
    totalBatteries: 16,
    coordinates: [106.6297, 10.8231] // Ho Chi Minh City coordinates
  },
  {
    id: 2,
    name: "Power Station B",
    address: "456 Shopping Center Blvd",
    distance: "1.2 km • 5 min drive",
    status: "Limited",
    availableBatteries: 3,
    totalBatteries: 12,
    coordinates: [106.6397, 10.8331]
  },
  {
    id: 3,
    name: "Quick Charge Hub",
    address: "789 Airport Terminal Road",
    distance: "2.1 km • 8 min drive",
    status: "No Slots",
    availableBatteries: 0,
    totalBatteries: 8,
    coordinates: [106.6197, 10.8131]
  },
  {
    id: 4,
    name: "Express Station",
    address: "321 Campus Drive",
    distance: "1.8 km • 6 min drive",
    status: "Available",
    availableBatteries: 8,
    totalBatteries: 10,
    coordinates: [106.6497, 10.8431]
  }
];

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStations, setFilteredStations] = useState(mockStations);
  const [map, setMap] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = mockStations.filter(station => 
      station.name.toLowerCase().includes(query.toLowerCase()) ||
      station.address.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStations(filtered);
  };

  const handleStationClick = (station) => {
    if (map) {
      map.flyTo({
        center: station.coordinates,
        zoom: 15
      });
    }
  };

  const handleMapReady = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <MapHeader />
      
      <MapSearchBar 
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />
      
      <MapContainer 
        stations={mockStations}
        onMapReady={handleMapReady}
      />
      
      <StationsList 
        stations={filteredStations}
        onStationClick={handleStationClick}
      />
    </div>
  );
}