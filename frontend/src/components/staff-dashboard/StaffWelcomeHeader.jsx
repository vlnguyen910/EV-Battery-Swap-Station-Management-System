import { MapPin } from 'lucide-react';
import { useStation } from '../../hooks/useContext';

export default function StaffWelcomeHeader({ user }) {
  const { stations } = useStation();
  
  // Get staff's assigned station (giả sử staff_id có liên kết với station)
  // Tạm thời lấy station đầu tiên
  const currentStation = stations && stations.length > 0 ? stations[0] : null;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome back, {user?.full_name || user?.username || 'Staff'}!
      </h1>
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <MapPin className="w-5 h-5" />
        <p className="text-base">
          You are currently working at{' '}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {currentStation?.name || 'Undefined Station'}
          </span>
        </p>
      </div>
    </div>
  );
}