import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import trackasia from 'trackasia-gl';
import 'trackasia-gl/dist/trackasia-gl.css';

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

  const mapInstanceRef = useRef(null);

  // Initialize map once
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const mapInstance = new trackasia.Map({
        container: mapRef.current,
        style: 'https://maps.track-asia.com/styles/v2/streets.json?key=090ec4d01e17603677119843fa3c839c69',
        center: [106.6297, 10.8231], // Ho Chi Minh City
        zoom: 12
      });

      mapInstanceRef.current = mapInstance;

      // Pass map instance to parent component
      if (onMapReady) {
        onMapReady(mapInstance);
      }

      return () => {
        // Clear markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        // Remove map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, [onMapReady]);

  // Update markers when stations change
  useEffect(() => {
    if (mapInstanceRef.current && stations) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add new markers
      stations.forEach(station => {
        const marker = new trackasia.Marker({
          color: getMarkerColor(station.status)
        })
          .setLngLat(station.coordinates)
          .setPopup(
            new trackasia.Popup({ offset: 25 })
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
          .addTo(mapInstanceRef.current);

        markersRef.current.push(marker);
      });
    }
  }, [stations]);

  return (
    <div className="w-full h-full p-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full relative overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-full rounded-lg"
          style={{ minHeight: '400px' }}
        />
        
        {/* Current Location Button */}
        <button className="absolute top-6 right-6 bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow z-10 border border-gray-200">
          <MapPin size={20} className="text-blue-600" />
        </button>
      </div>
    </div>
  );
}