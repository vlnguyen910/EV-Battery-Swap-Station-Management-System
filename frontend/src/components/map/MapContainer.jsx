import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Map as TrackAsiaMap, Marker, Popup } from 'trackasia-gl';

export default function MapContainer({ stations, onMapReady }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

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

  useEffect(() => {
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
      stations.forEach(station => {
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

        markersRef.current.push(marker);
      });

      // Pass map instance to parent component
      if (onMapReady) {
        onMapReady(mapInstance);
      }

      return () => {
        // Clear markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        // Remove map
        mapInstance.remove();
      };
    }
  }, [stations]); // Include stations as dependency

  return (
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
  );
}