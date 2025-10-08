import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);

  // Sample data - will be replaced with backend API call later
  const sampleStations = [
    {
      id: 1,
      name: "Downtown Station",
      lat: 10.8231,
      lng: 106.6297,
      address: "123 Main St, District 1, Ho Chi Minh City",
      status: "Active",
      batteryCount: 15,
      availableBatteries: 8
    },
    {
      id: 2,
      name: "Airport Station",
      lat: 10.8184,
      lng: 106.6520,
      address: "456 Airport Rd, District 7, Ho Chi Minh City",
      status: "Active",
      batteryCount: 20,
      availableBatteries: 12
    },
    {
      id: 3,
      name: "University Station",
      lat: 10.7769,
      lng: 106.6954,
      address: "789 University Ave, District 3, Ho Chi Minh City",
      status: "Maintenance",
      batteryCount: 10,
      availableBatteries: 0
    }
  ];

  useEffect(() => {
    // Initialize Google Map
    const initMap = () => {
      if (window.google && mapRef.current) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 10.8231, lng: 106.6297 }, // Ho Chi Minh City center
          zoom: 12,
          mapTypeId: 'roadmap',
        });

        setMap(mapInstance);

        // Create InfoWindow instance
        const infoWindowInstance = new window.google.maps.InfoWindow();
        setInfoWindow(infoWindowInstance);

        // Add markers for each station
        const newMarkers = sampleStations.map(station => {
          const marker = new window.google.maps.Marker({
            position: { lat: station.lat, lng: station.lng },
            map: mapInstance,
            title: station.name,
            icon: {
              url: getMarkerIcon(station.status),
              scaledSize: new window.google.maps.Size(40, 40)
            }
          });

          // Add click listener to marker
          marker.addListener('click', () => {
            setSelectedStation(station);
            infoWindowInstance.setContent(createInfoWindowContent(station));
            infoWindowInstance.open(mapInstance, marker);
          });

          return marker;
        });

        setMarkers(newMarkers);
      }
    };

    // Check if Google Maps API is already loaded
    if (window.google) {
      initMap();
    } else {
      // Wait for Google Maps API to load
      window.initMap = initMap;
    }

    return () => {
      // Cleanup markers on unmount
      markers.forEach(marker => marker.setMap(null));
    };
  }, []);

  // Function to get marker icon based on status
  const getMarkerIcon = (status) => {
    switch (status) {
      case 'Active':
        return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'Maintenance':
        return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
      case 'Inactive':
        return 'https://maps.google.com/mapfiles/ms/icons/grey-dot.png';
      default:
        return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    }
  };

  // Function to create info window content
  const createInfoWindowContent = (station) => {
    return `
      <div style="padding: 10px; max-width: 250px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">${station.name}</h3>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Address:</strong> ${station.address}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Status:</strong> 
          <span style="color: ${station.status === 'Active' ? 'green' : station.status === 'Maintenance' ? 'red' : 'grey'};">
            ${station.status}
          </span>
        </p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Available Batteries:</strong> ${station.availableBatteries}/${station.batteryCount}</p>
        <div style="margin-top: 10px;">
          <button style="background: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">
            View Details
          </button>
          <button style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
            Navigate
          </button>
        </div>
      </div>
    `;
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{ padding: '20px', background: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <h2 style={{ margin: '0 0 10px 0' }}>EV Battery Swap Station Management System</h2>
        <p style={{ margin: '0 0 15px 0', color: '#666' }}>Welcome! Find the nearest battery swap stations on the map below.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'green' }}></div>
            <span>Active</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'red' }}></div>
            <span>Maintenance</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'grey' }}></div>
            <span>Inactive</span>
          </div>
        </div>
      </div>
      <div
        ref={mapRef}
        style={{
          height: 'calc(100vh - 250px)',
          width: '100%'
        }}
      />
    </div>
  );
}