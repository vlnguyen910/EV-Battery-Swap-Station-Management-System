import React, { useMemo, useState, useEffect } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import PersonalInfoCard from '../components/profile/PersonalInfoCard';
import VehiclesList from '../components/profile/VehiclesList';
import { ArrowLeftRight, PiggyBank } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';

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
        setVehicles(vehicleData || []);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setVehicles([]);
      }
    };

    fetchVehicles();
  }, [user?.id]);

  const stats = [
    { label: 'Total Swaps', value: '128', icon: ArrowLeftRight, accent: 'text-blue-600 bg-blue-50' },
    { label: 'Total Savings', value: '$1,450.75', icon: PiggyBank, accent: 'text-blue-600 bg-blue-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="max-w-5xl ml-8 p-6">
        <ProfileHeader />
        <ProfileStats stats={stats} />
        <PersonalInfoCard user={user} />
        <VehiclesList vehicles={vehicles} onAddVehicle={() => {}} />
      </div>
    </div>
  );
}
