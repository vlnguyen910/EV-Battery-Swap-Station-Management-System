import React, { useMemo, useState, useEffect } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import PersonalInfoCard from '../components/profile/PersonalInfoCard';
import VehiclesList from '../components/profile/VehiclesList';
import { ArrowLeftRight, PiggyBank } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { batteryService } from '../services/batteryService';

export default function Profile() {
  const [vehicles, setVehicles] = useState([]);

  // Read user from localStorage (fallback to demo user)
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : { id: 0, name: 'John Doe', email: 'john.doe@example.com', phone: '(123) 456-7890' };
    } catch {
      return { id: 0, name: 'John Doe', email: 'john.doe@example.com', phone: '(123) 456-7890' };
    }
  }, []);

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user?.id) return;

      try {
        const vehicleData = await vehicleService.getVehicleByUserId(user.id);
        
        // Fetch battery data for each vehicle
        const vehiclesWithBattery = await Promise.all(
          (vehicleData || []).map(async (vehicle) => {
            try {
              const batteryData = await batteryService.getBatteryByVehicleId(vehicle.id);
              return {
                ...vehicle,
                soh: batteryData?.soh,
                batteryLevel: batteryData?.pin_hien_tai,
              };
            } catch (error) {
              console.error(`Error fetching battery for vehicle ${vehicle.id}:`, error);
              return vehicle;
            }
          })
        );

        setVehicles(vehiclesWithBattery);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setVehicles([]);
      }
    };

    fetchVehicles();
  }, [user?.id]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="max-w-5xl ml-8 p-6">
        <ProfileHeader />
        <PersonalInfoCard user={user} />
        <VehiclesList vehicles={vehicles} onAddVehicle={() => {}} />
      </div>
    </div>
  );
}
