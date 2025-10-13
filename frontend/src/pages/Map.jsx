import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, MapPin, Clock, Battery, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Map as TrackAsiaMap, Marker, Popup } from 'trackasia-gl';
import 'trackasia-gl/dist/trackasia-gl.css';

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
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStations, setFilteredStations] = useState(mockStations);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialize Track Asia Map
    if (mapRef.current) {
      const mapInstance = new TrackAsiaMap({
        container: mapRef.current,
        style: {
          "version": 8,
          "sources": {
            "osm": {
              "type": "raster",
              "tiles": [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
              ],
              "tileSize": 256,
              "attribution": "© OpenStreetMap contributors"
            }
          },
          "layers": [
            {
              "id": "osm",
              "type": "raster",
              "source": "osm"
            }
          ]
        },
        center: [106.6297, 10.8231], // Ho Chi Minh City
        zoom: 12
      });

      // Add markers for stations
      mockStations.forEach(station => {
        const marker = new Marker({
          color: getMarkerColor(station.status)
        })
          .setLngLat(station.coordinates)
          .setPopup(
            new Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold">${station.name}</h3>
                  <p class="text-sm text-gray-600">${station.address}</p>
                  <p class="text-sm mt-1">
                    <span class="font-medium">${station.availableBatteries}/${station.totalBatteries}</span> 
                    batteries available
                  </p>
                </div>
              `)
          )
          .addTo(mapInstance);
      });

      setMap(mapInstance);

      return () => mapInstance.remove();
    }
  }, []);



  const getMarkerColor = (status) => {
    switch (status) {
      case 'Available':
        return '#10B981'; // Green
      case 'Limited':
        return '#F59E0B'; // Yellow
      case 'No Slots':
        return '#EF4444'; // Red
      default:
        return '#6B7280'; // Gray
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Limited':
        return 'bg-yellow-100 text-yellow-800';
      case 'No Slots':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Find Stations</h1>
      </div>

      {/* Search Bar */}
      <div className="bg-blue-600 px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stations or locations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div 
          ref={mapRef} 
          className="w-full h-full"
        />
        
        {/* Current Location Button */}
        <button className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <MapPin size={20} className="text-blue-600" />
        </button>
      </div>

      {/* Nearby Stations List */}
      <div className="bg-white border-t border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Nearby Stations</h2>
          <p className="text-sm text-gray-600">{filteredStations.length} stations found</p>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {filteredStations.map((station) => (
            <div
              key={station.id}
              onClick={() => handleStationClick(station)}
              className="px-4 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Zap className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{station.name}</h3>
                      <p className="text-sm text-gray-600">{station.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock size={16} />
                      <span>{station.distance}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Battery size={16} />
                      <span>{station.availableBatteries}/{station.totalBatteries} slots</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(station.status)}`}>
                    {station.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}