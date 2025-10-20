import React, { useState } from 'react';
import { Clock, Battery, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBattery } from '../../hooks/useContext';

export default function StationCard({ station, onClick }) {
  const navigate = useNavigate();
  const { countAvailableBatteriesByStation } = useBattery();
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);

  // Check if user has active subscription
  const checkSubscription = () => {
    const subscriptions = localStorage.getItem('subscriptions');
    if (!subscriptions || JSON.parse(subscriptions).length === 0) {
      return false;
    }
    return true;
  };

  const handleBookNow = (e) => {
    e.stopPropagation(); // Prevent triggering onClick

    // Check if user has subscription
    if (!checkSubscription()) {
      setShowSubscriptionAlert(true);
      return;
    }

    // Proceed with booking if user has subscription
    const params = new URLSearchParams({
      station_id: station?.station_id ?? station?.id,
      name: station?.name,
      address: station?.address,
      availableBatteries: station?.availableBatteries,
      totalBatteries: station?.totalBatteries,
      status: station?.status
    });
    navigate(`/booking?${params.toString()}`);
  };

  const handleGoToPlans = () => {
    setShowSubscriptionAlert(false);
    navigate('/driver/plans');
  };

  const handleCloseAlert = () => {
    setShowSubscriptionAlert(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // If station prop is not provided, render nothing (avoid runtime errors)
  if (!station) return null;

  return (
    <>
      <div
        onClick={() => onClick && onClick(station)}
        className="px-4 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Zap className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{station.name}</h3>
                <p className="text-sm text-gray-600">{station.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Clock size={16} />
                <span>{station.distance}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Battery size={16} />
                <span>{countAvailableBatteriesByStation(station.station_id)} Slots</span>
              </div>
            </div>
          </div>

          <div className="ml-4 flex flex-col items-end gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(station.status)}`}>
              {station.status}
            </span>
            {station.status !== 'No Slots' && (
              <button
                onClick={handleBookNow}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Required Alert Modal */}
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
    </>
  );
}