import React, { useState, useCallback, useEffect } from 'react';
import 'trackasia-gl/dist/trackasia-gl.css';
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
  const [userLocation, setUserLocation] = useState(null);
  const [geoError, setGeoError] = useState(null);

  // Compute Haversine distance in meters
  const distanceMeters = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371000; // meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Enrich stations with distance fields and sort
  const computeWithDistance = (list, loc) => {
    if (!Array.isArray(list)) return [];
    const enriched = list.map((s) => {
      if (loc && s?.latitude != null && s?.longitude != null) {
        const meters = distanceMeters(loc.latitude, loc.longitude, s.latitude, s.longitude);
        return {
          ...s,
          distanceValue: meters,
          distance: `${(meters / 1000).toFixed(1)} km`,
        };
      }
      return { ...s, distanceValue: Number.POSITIVE_INFINITY, distance: undefined };
    });
    enriched.sort((a, b) => (a.distanceValue || Infinity) - (b.distanceValue || Infinity));
    return enriched;
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const base = computeWithDistance(stations || [], userLocation);
    const q = (query || '').toLowerCase();
    const filtered = base.filter((station) =>
      station.name?.toLowerCase().includes(q) || station.address?.toLowerCase().includes(q)
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
    // Tự động định vị người dùng khi map load xong
    locateUser();
  }, []);

  // Keep filteredStations in sync when stations change (async fetch)
  useEffect(() => {
    const base = computeWithDistance(stations || [], userLocation);
    if (!searchQuery) {
      setFilteredStations(base);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredStations(
        base.filter((station) =>
          station.name?.toLowerCase().includes(q) || station.address?.toLowerCase().includes(q)
        )
      );
    }
  }, [stations, userLocation, searchQuery]);

  // Locate user using browser geolocation
  const locateUser = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setUserLocation(loc);
        setGeoError(null);
        if (map && typeof map.flyTo === 'function') {
          map.flyTo({ center: [loc.longitude, loc.latitude], zoom: 14 });
        }
      },
      (err) => {
        setGeoError(err?.message || 'Unable to retrieve your location.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="flex flex-col pb-6 h-screen overflow-hidden">
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
            userLocation={userLocation}
            onLocate={locateUser}
          />
        </div>

        {/* Right side - Nearby Stations */}
        <div className="w-96 bg-transparent overflow-hidden ">
          <StationsList
            stations={filteredStations}
            onStationClick={handleStationClick}
            userLocation={userLocation}
          />
        </div>
      </div>
    </div>
  );
}