import React, { useState, useEffect } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import PersonalInfoCard from '../components/profile/PersonalInfoCard';
import VehiclesList from '../components/profile/VehiclesList';
import { vehicleService } from '../services/vehicleService';
import { useAuth } from '../hooks/useContext';

export default function Profile() {
  const [vehicles, setVehicles] = useState([]);
  const { user } = useAuth();

  // Fetch enriched vehicles (with batteryLevel & soh) from service
  // Extract fetch function so child components can trigger refresh
  const fetchVehicles = async () => {
    if (!user?.id) return;

    try {
      const vehicles = await vehicleService.getVehiclesByUserIdWithBattery(user.id);
      setVehicles(Array.isArray(vehicles) ? vehicles : []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    }
  };

  useEffect(() => {
    // Only refetch when user id changes
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="max-w-5xl ml-8 p-6">
        <ProfileHeader />
        <PersonalInfoCard user={user} />
        <VehiclesList vehicles={vehicles} onAddVehicle={fetchVehicles} />
      </div>
    </div>
  );
}
