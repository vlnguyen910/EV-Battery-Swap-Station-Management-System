import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MapPin } from 'lucide-react';
import { batteryService } from '../../services/batteryService';

export default function NearbyStationsCard({ stations = [], onViewAll }) {
  const [stationsWithBatteries, setStationsWithBatteries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch battery data for each station
  useEffect(() => {
    const fetchBatteryData = async () => {
      if (!stations || stations.length === 0) {
        setStationsWithBatteries([]);
        return;
      }

      console.log('Stations prop:', stations);

      setLoading(true);
      try {
        // Fetch batteries for all stations in parallel
        const stationsWithBatteryCounts = await Promise.all(
          stations.map(async (station) => {
            try {
              // Get station_id - might be 'station_id' or 'id'
              const stationId = station.station_id || station.id;
              
              console.log(`Fetching batteries for station:`, { 
                stationId, 
                stationName: station.name,
                fullStation: station 
              });

              if (!stationId) {
                console.warn('Station missing ID:', station);
                return {
                  ...station,
                  available: 0,
                  total: 0
                };
              }

              const batteries = await batteryService.getBatteriesByStationId(stationId);
              
              console.log(`Station ${stationId} (${station.name}):`, batteries);
              console.log(`Total batteries fetched:`, batteries.length);
              console.log(`Battery IDs:`, batteries.map(b => b.battery_id));
              
              // Count available batteries (status: 'full' or 'available')
              const availableBatteries = batteries.filter(
                battery => battery.status === 'full' || battery.status === 'available'
              ).length;
              
              const totalBatteries = batteries.length;

              console.log(`Available: ${availableBatteries}, Total: ${totalBatteries}`);

              return {
                ...station,
                station_id: stationId, // Ensure station_id is set
                available: availableBatteries,
                total: totalBatteries
              };
            } catch (error) {
              console.error(`Error fetching batteries for station:`, error);
              // Return station with 0/0 if fetch fails
              return {
                ...station,
                available: 0,
                total: 0
              };
            }
          })
        );

        setStationsWithBatteries(stationsWithBatteryCounts);
      } catch (error) {
        console.error('Error fetching battery data:', error);
        setStationsWithBatteries(stations.map(st => ({ ...st, available: 0, total: 0 })));
      } finally {
        setLoading(false);
      }
    };

    fetchBatteryData();
  }, [stations]);

  const displayStations = stationsWithBatteries.length > 0 ? stationsWithBatteries : stations;

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-2">
        <div className="w-full flex items-start justify-between">
          <CardTitle>Nearby Stations</CardTitle>
          {/* View All aligned top-right; if onViewAll provided, call it on click */}
          <Link
            to="/driver/map"
            onClick={(e) => {
              if (onViewAll) {
                e.preventDefault();
                onViewAll();
              }
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {loading ? (
          <p className="text-sm text-gray-500">Loading battery data...</p>
        ) : displayStations.length === 0 ? (
          <p className="text-sm text-gray-500">No stations available.</p>
        ) : (
          displayStations.map((st) => (
            <div key={st.station_id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" size={18} />
                <div>
                  <p className="font-medium text-gray-900">{st.name}</p>
                  <p className="text-gray-500 text-sm">{st.address}</p>
                </div>
              </div>
              <p className="text-green-700 font-medium text-sm">
                {st.available ?? 0}/{st.total ?? 0} slots
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
