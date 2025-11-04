import React, { useState, useEffect } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import PersonalInfoCard from '../components/profile/PersonalInfoCard';
import VehiclesList from '../components/profile/VehiclesList';
import { vehicleService } from '../services/vehicleService';
import { subscriptionService } from '../services/subscriptionService'
import { useAuth } from '../hooks/useContext';

export default function Profile() {
  const [vehicles, setVehicles] = useState([]);
  const { user } = useAuth();

  // Fetch enriched vehicles (with batteryLevel & soh) from service
  // Extract fetch function so child components can trigger refresh
  const fetchVehicles = async () => {
    if (!user?.user_id) return;

    try {
      const [vehicles, subscriptions] = await Promise.all([
        vehicleService.getVehiclesByUserIdWithBattery(user.user_id),
        // fetch subscriptions for user once and map by vehicle_id
        subscriptionService.getSubscriptionsByUserId(user.user_id).catch(() => []),
      ])

      const subsByVehicle = (subscriptions || []).reduce((acc, s) => {
        if (s?.vehicle_id) acc[s.vehicle_id] = acc[s.vehicle_id] || []
        if (s?.vehicle_id) acc[s.vehicle_id].push(s)
        return acc
      }, {})

      const enriched = (vehicles || []).map(v => {
        const vehicleId = v?.vehicle_id || v?.id || null
        const subs = vehicleId ? (subsByVehicle[vehicleId] || []) : []
        const hasActiveSub = subs.some(s => (s.status || '').toLowerCase() === 'active')
        return { ...v, hasActiveSubscription: hasActiveSub }
      })

      setVehicles(Array.isArray(enriched) ? enriched : []);
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
