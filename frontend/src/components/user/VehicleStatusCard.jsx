import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MapPin } from 'lucide-react';

export default function VehicleStatusCard({ vehicle, onFindStations }) {
  const v = vehicle || {
    name: 'My EV',
    model: 'Model X',
    vin: 'XXXXXXXXXXXXXXXXX',
    motorPower: '258 kW',
    batteryLevel: 75,
    soh: 98,
    estimatedRange: '250 km',
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-[22px]">Vehicle Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-sm">Vehicle Name</span>
            <span className="text-gray-900 text-sm">{v.name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-sm">Model</span>
            <span className="text-gray-900 text-sm">{v.model}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-sm">VIN</span>
            <span className="text-gray-900 text-sm">{v.vin}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-sm">Motor Power</span>
            <span className="text-gray-900 text-sm">{v.motorPower}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 text-sm font-medium">Battery Level</span>
              <span className="text-gray-900 text-sm">{v.batteryLevel}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-200">
              <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${v.batteryLevel}%` }} />
            </div>
            <span className="text-gray-500 text-sm">Estimated Range: {v.estimatedRange}</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 text-sm font-medium">Battery Health (SOH)</span>
              <span className="text-gray-900 text-sm">{v.soh}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-200">
              <div className="h-2.5 rounded-full bg-green-600" style={{ width: `${v.soh}%` }} />
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
