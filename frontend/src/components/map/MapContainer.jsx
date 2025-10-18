import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import trackasia from 'trackasia-gl';
import 'trackasia-gl/dist/trackasia-gl.css';

export default function MapContainer({ stations, onMapReady }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const navigate = useNavigate();
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);
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
        //style: `https://maps.track-asia.com/styles/v2/night.json?key=${TRACKASIA_API_KEY}`, DARK MODE
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

        // Add click handler for the Book Now button with subscription check
        const bookButton = popupContent.querySelector(`#book-btn-${station.id}`);
        bookButton.addEventListener('click', () => {
          // Check if user has active subscription
          const subscriptions = localStorage.getItem('subscriptions');
          const hasSubscription = subscriptions && JSON.parse(subscriptions).length > 0;
          
          if (!hasSubscription) {
            // Show custom modal alert
            setShowSubscriptionAlert(true);
            return;
          }
          
          // If has subscription, proceed to booking
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

  const handleGoToPlans = () => {
    setShowSubscriptionAlert(false);
    navigate('/driver/plans');
  };

  const handleCloseAlert = () => {
    setShowSubscriptionAlert(false);
  };

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

      {/* Subscription Required Alert Modal - Same as StationCard */}
      {showSubscriptionAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Chưa có gói đăng ký
                </h3>
                <p className="text-gray-600 mb-4">
                  Bạn cần đăng ký một gói dịch vụ trước khi có thể đặt lịch thay pin. 
                  Vui lòng chọn gói phù hợp với nhu cầu của bạn.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCloseAlert}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleGoToPlans}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Xem gói đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}