//KHONG BIET CAI NAY DE LAM GI
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import { Battery } from "lucide-react"

export default function VehicleStatus() {
  // Get current user's vehicle (user_id: 1, vehicle_id: 1)
  const vehicle = mockVehicles[0];
  const currentBattery = mockBatteries.find(b => b.battery_id === vehicle.battery_id);

  const batteryLevel = currentBattery?.pin_hien_tai || 68;
  // Assuming 1% = 4.2km range for 100kWh battery
  const range = Math.floor(batteryLevel * 4.2);

  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader className="bg-blue-800 text-white rounded-lg">
        <div className="flex flex-row items-center justify-between pt-2 py-1">
          <div className="flex items-center gap-2">
            <Battery className="w-5 h-5" />
            <h2 className="text-xl font-bold">Vehicle Status</h2>
          </div>
          <Button variant="outline" size="sm" className="bg-white text-blue-800 border-white hover:bg-blue-50">
            Manage Vehicle
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Vehicle Info */}
        <div className="text-center space-y-2 bg-gray-200 shadow-md rounded-lg p-4">
          <h3 className="text-2xl font-bold text-gray-800">EV Bike {vehicle.battery_model}</h3>
          <p className="text-gray-600 font-medium">Model: {vehicle.battery_type}</p>
          <p className="text-gray-500 text-sm">VIN: {vehicle.vin}</p>
          <p className="text-gray-500 text-sm">Motor: {vehicle.cong_suat_dong_co} kW</p>
        </div>

        {/* Battery Status */}
        <div className="space-y-4 bg-gray-200 shadow-sm rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Battery className={`w-5 h-5 ${batteryLevel > 50 ? 'text-green-600' : batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'}`} />
              <span className="text-gray-700 font-medium">Current Battery Level</span>
            </div>
            <span className="text-3xl font-bold text-blue-800">{batteryLevel.toFixed(0)}%</span>
          </div>

          {/* Battery Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
              <div
                className={`h-4 rounded-full transition-all duration-300 shadow-sm ${batteryLevel > 50 ? 'bg-gradient-to-r from-green-600 to-green-400' :
                    batteryLevel > 20 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
                      'bg-gradient-to-r from-red-600 to-red-400'
                  }`}
                style={{ width: `${batteryLevel}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>0%</span>
              <span className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-medium">
                {range} km
              </span>
              <span>100%</span>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2 font-medium">
              Range: ~{range} km remaining
            </p>
            <p className="text-center text-xs text-gray-500 mt-1">
              Battery Health (SOH): {currentBattery?.soh || 89.5}%
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <Link to="/driver/map">
            <Button className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-3 shadow-md w-full">
              Find Stations
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}