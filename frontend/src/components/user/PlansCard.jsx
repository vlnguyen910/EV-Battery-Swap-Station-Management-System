import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ChevronLeft, ChevronRight, Car, CreditCard, Calendar, Package } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { vehicleService } from '../../services/vehicleService';

export default function SubscriptionCard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [vehiclesMap, setVehiclesMap] = useState({});

  // Get user from localStorage
  const user = useMemo(() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user?.id) {
        setSubscriptions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch subscriptions and vehicles in parallel
        const [subsData, vehiclesData] = await Promise.all([
          subscriptionService.getSubscriptionsByUserId(user.id),
          vehicleService.getVehicleByUserId(user.id)
        ]);

        const subscriptionsArray = subsData.data || subsData || [];
        const vehiclesArray = vehiclesData.data || vehiclesData || [];

        // Create vehicles map for quick lookup
        const vMap = {};
        vehiclesArray.forEach(vehicle => {
          vMap[vehicle.vehicle_id] = vehicle;
        });
        setVehiclesMap(vMap);

        // Filter active subscriptions
        const activeSubscriptions = subscriptionsArray.filter(
          sub => sub.status === 'active'
        );

        setSubscriptions(activeSubscriptions);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user?.id]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? subscriptions.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev === subscriptions.length - 1 ? 0 : prev + 1
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle>My Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle>My Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No active subscriptions</p>
            <p className="text-sm mt-1">Subscribe to a plan to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentSubscription = subscriptions[currentIndex];
  const vehicle = currentSubscription.vehicle_id 
    ? vehiclesMap[currentSubscription.vehicle_id] 
    : null;

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>My Subscription</CardTitle>
          {subscriptions.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Previous subscription"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500">
                {currentIndex + 1} / {subscriptions.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Next subscription"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Package Name */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-gray-600 font-medium">Package</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {currentSubscription.package?.name || 
               currentSubscription.name || 
               `Package #${currentSubscription.package_id}`}
            </p>
          </div>

          {/* Price */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-green-600" />
              <p className="text-xs text-gray-600 font-medium">Price</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {formatPrice(
                currentSubscription.package?.base_price || 
                currentSubscription.price
              )}
            </p>
          </div>

          {/* Vehicle */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-gray-600 font-medium">Vehicle</p>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {vehicle 
                ? `${vehicle.brand || ''} ${vehicle.model || ''} (${vehicle.license_plate || 'N/A'})`
                : 'No vehicle assigned'
              }
            </p>
            {vehicle && vehicle.vin && (
              <p className="text-xs text-gray-500 mt-1">VIN: {vehicle.vin}</p>
            )}
          </div>

          {/* Subscription Period */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-orange-600" />
              <p className="text-xs text-gray-600 font-medium">Period</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">From</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(currentSubscription.start_date)}
                </p>
              </div>
              <div className="text-gray-400">→</div>
              <div className="text-right">
                <p className="text-xs text-gray-500">To</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(currentSubscription.end_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
            {/* Swaps Used */}
            {currentSubscription.swap_used !== undefined && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Swaps Used</p>
                <p className="text-lg font-bold text-blue-600">
                  {currentSubscription.swap_used}
                  {currentSubscription.package?.swap_count && 
                    <span className="text-sm text-gray-500 font-normal">
                      {' '}/ {currentSubscription.package.swap_count}
                    </span>
                  }
                </p>
              </div>
            )}
            
            {/* Distance Traveled */}
            {currentSubscription.distance_traveled !== undefined && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">Distance Traveled</p>
                <p className="text-lg font-bold text-green-600">
                  {currentSubscription.distance_traveled.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 1
                  })} km
                  {currentSubscription.package?.base_distance && 
                    <span className="text-sm text-gray-500 font-normal">
                      {' '}/ {currentSubscription.package.base_distance.toLocaleString('en-US')} km
                    </span>
                  }
                </p>
              </div>
            )}
            
            {/* Distance Progress Bar */}
            {currentSubscription.package?.base_distance && 
             currentSubscription.distance_traveled !== undefined && (
              <div className="pt-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      (currentSubscription.distance_traveled / currentSubscription.package.base_distance) > 1
                        ? 'bg-red-500'
                        : (currentSubscription.distance_traveled / currentSubscription.package.base_distance) > 0.8
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min(
                        (currentSubscription.distance_traveled / currentSubscription.package.base_distance) * 100,
                        100
                      )}%` 
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {((currentSubscription.distance_traveled / currentSubscription.package.base_distance) * 100).toFixed(1)}% used
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
