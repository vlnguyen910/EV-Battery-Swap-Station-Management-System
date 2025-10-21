import React, { useMemo } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import PersonalInfoCard from '../components/profile/PersonalInfoCard';
import VehiclesList from '../components/profile/VehiclesList';
import { ArrowLeftRight, PiggyBank } from 'lucide-react';
import { useVehicle } from '../hooks/useContext';

export default function Profile() {
  // Read user from localStorage (fallback to demo user)
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : { id: 0, name: 'John Doe', email: 'john.doe@example.com', phone: '(123) 456-7890' };
    } catch {
      return { id: 0, name: 'John Doe', email: 'john.doe@example.com', phone: '(123) 456-7890' };
    }
  }, []);

  const stats = [
    { label: 'Total Swaps', value: '128', icon: ArrowLeftRight, accent: 'text-blue-600 bg-blue-50' },
    { label: 'Total Savings', value: '$1,450.75', icon: PiggyBank, accent: 'text-blue-600 bg-blue-50' },
  ];

  const vehicles = [
    {
      name: '2023 Tesla Model 3',
      active: true,
      license: 'EVDRIVR',
      vin: '...KLP123',
      battery: '75 kWh',
    },
    {
      name: '2021 Nissan Leaf',
      active: false,
      license: 'LEAFY',
      vin: '...XYZ789',
      battery: '40 kWh',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 lg:p-10">
        <ProfileHeader />
        <ProfileStats stats={stats} />
        <PersonalInfoCard user={user} />
        <VehiclesList vehicles={vehicles} onAddVehicle={() => {}} />
      </div>
    </div>
  );
}
