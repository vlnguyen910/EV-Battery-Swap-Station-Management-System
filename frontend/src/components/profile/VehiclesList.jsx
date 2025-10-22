import React from 'react';
import { Button } from '../../components/ui/button';
import { Plus, Edit3, ToggleLeft, ToggleRight, Car as CarIcon } from 'lucide-react';

export default function VehiclesList({ vehicles = [], onAddVehicle }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Linked Vehicles</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAddVehicle}>
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Button>
      </div>

      <div className="space-y-4">
        {vehicles.map((v, idx) => (
          <div key={idx} className="border border-gray-200 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <CarIcon className={`w-6 h-6 ${v.active ? 'text-blue-600' : 'text-gray-400'}`} />
                  <h3 className="font-semibold text-lg text-gray-900">{v.name}</h3>
                  {v.active ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Inactive</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">License:</span>
                    <span className="text-gray-800 ml-1">{v.license}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">VIN:</span>
                    <span className="text-gray-800 ml-1">{v.vin}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Battery:</span>
                    <span className="text-gray-800 ml-1">{v.battery}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4 mt-1">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
                  <Edit3 className="w-5 h-5" />
                </Button>
                {v.active ? (
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                    <ToggleLeft className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700">
                    <ToggleRight className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
