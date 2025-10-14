import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import trackasia from 'trackasia-gl';
import 'trackasia-gl/dist/trackasia-gl.css';

export default function MapContainer({ stations, onMapReady }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const navigate = useNavigate();
  const TRACKASIA_API_KEY = '090ec4d01e17603677119843fa3c839c69';

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
        style: `https://maps.track-asia.com/styles/v2/streets.json?key=${TRACKASIA_API_KEY}`,
        center: [106.6297, 10.8231], // Ho Chi Minh City
        zoom: 12,
        // Ensure all TrackAsia sprite/glyph/tile requests include the API key
        transformRequest: (url) => {
          const needsKey = url.includes('track-asia.com') && !/[?&]key=/.test(url);
          if (needsKey) {
            const sep = url.includes('?') ? '&' : '?';
            return { url: `${url}${sep}key=${TRACKASIA_API_KEY}` };
          }
          return { url };
        },
      });

      mapInstanceRef.current = mapInstance;

      // Provide placeholder images for any missing sprite icons to prevent console errors
      mapInstance.on('styleimagemissing', (e) => {
        const id = e.id;
        if (!mapInstance.hasImage(id)) {
          try {
            // Create a tiny transparent image as a fallback
            const width = 1, height = 1;
            const data = new Uint8ClampedArray(width * height * 4); // all zeros => transparent
            const imageData = new ImageData(data, width, height);
            mapInstance.addImage(id, imageData, { pixelRatio: 1 });
          } catch (err) {
            // As a secondary fallback, try using a small canvas
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            mapInstance.addImage(id, canvas, { pixelRatio: 1 });
          }
        }
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
        // Create popup content with Book Now button
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3';
        popupContent.innerHTML = `
          <div>
            <h3 class="font-semibold text-gray-800">${station.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${station.address}</p>
            <p class="text-sm mb-3">
              <span class="font-medium text-green-600">${station.availableBatteries}/${station.totalBatteries}</span> 
              batteries available
            </p>
            <button 
              id="book-btn-${station.id}" 
              class="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Book Now
            </button>
          </div>
        `;

        // Add click handler for the Book Now button
        const bookButton = popupContent.querySelector(`#book-btn-${station.id}`);
        bookButton.addEventListener('click', () => {
          const params = new URLSearchParams({
            stationId: station.id,
            name: station.name,
            address: station.address,
            availableBatteries: station.availableBatteries,
            totalBatteries: station.totalBatteries,
            status: station.status
          });
          navigate(`/booking?${params.toString()}`);
        });

        const popup = new trackasia.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false 
        }).setDOMContent(popupContent);

        const marker = new trackasia.Marker({
          color: getMarkerColor(station.status)
        })
          .setLngLat(station.coordinates)
          .setPopup(popup)
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