import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export default function VehicleStatusCard({ vehicles = [], onFindStations }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Return early if no vehicles
  if (!vehicles || vehicles.length === 0) {
    return (
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-[22px]">Vehicle Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No vehicles found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentVehicle = vehicles[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? vehicles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === vehicles.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[22px]">Vehicle Status</CardTitle>
          {vehicles.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Previous vehicle"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500 font-medium min-w-[40px] text-center">
                {currentIndex + 1}/{vehicles.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Next vehicle"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4 mb-4">
          <div className="md:col-span-2 grid grid-cols-2 gap-x-4 gap-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm">Battery Type</span>
              <span className="text-gray-900 text-sm">{currentVehicle.battery_type || 'N/A'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm">VIN</span>
              <span className="text-gray-900 text-sm">{currentVehicle.vin || 'N/A'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm">Battery Model</span>
              <span className="text-gray-900 text-sm">{currentVehicle.battery_model || 'N/A'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm">Status</span>
              {currentVehicle.status ? (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-0.5 rounded">Active</span>
              ) : (
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-0.5 rounded">Inactive</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-center md:col-span-1">
            <img 
              src="/images/xe-may-1.png" 
              alt="Vehicle" 
              className="w-full max-w-[300px] h-auto object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 text-sm font-medium">Battery Level</span>
              <span className="text-gray-900 text-sm">{currentVehicle.batteryLevel || 0}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-200">
              <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${currentVehicle.batteryLevel || 0}%` }} />
            </div>
            <span className="text-gray-500 text-sm">Estimated Range: {currentVehicle.estimatedRange || 'N/A'}</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 text-sm font-medium">Battery Health (SOH)</span>
              <span className="text-gray-900 text-sm">{currentVehicle.soh || 0}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-200">
              <div className="h-2.5 rounded-full bg-green-600" style={{ width: `${currentVehicle.soh || 0}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button className="w-full" onClick={onFindStations}>
            <MapPin className="mr-2" size={18} /> Find Stations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
