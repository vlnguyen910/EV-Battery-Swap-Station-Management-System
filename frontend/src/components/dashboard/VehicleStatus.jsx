import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"

export default function VehicleStatus() {
  const batteryLevel = 68
  const range = 286

  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-bold">Vehicle Status</h2>
          <Button variant="outline" size="sm" className="bg-white text-blue-600 border-white hover:bg-blue-50">
            Manage Vehicle
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Vehicle Image */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 flex justify-center">
          <div className="w-48 h-32 bg-white rounded-lg shadow-md flex items-center justify-center">
            <span className="text-6xl">🚗</span>
          </div>
        </div>
        
        {/* Vehicle Info */}
        <div className="text-center space-y-2 bg-gray-50 rounded-lg p-4">
          <h3 className="text-2xl font-bold text-gray-800">Tesla Model 3</h3>
          <p className="text-gray-600 font-medium">License: ABC-1234</p>
          <p className="text-gray-500 text-sm">VIN: 5YJ3E1EA1JF000001</p>
        </div>

        {/* Battery Status */}
        <div className="space-y-4 bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Current Battery Level</span>
            <span className="text-3xl font-bold text-blue-600">{batteryLevel}%</span>
          </div>
          
          {/* Battery Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${batteryLevel}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>0%</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                {range} km
              </span>
              <span>100%</span>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2 font-medium">
              Range: {range} km remaining
            </p>
          </div>
        </div>

        {/* Premium Plan Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 rounded-lg p-4 flex justify-between items-center shadow-md">
          <div>
            <p className="font-bold text-lg">Premium Plan</p>
            <p className="text-sm font-medium">12 swaps remaining this month</p>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
            Upgrade
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 shadow-md">
            📍 Find Stations
          </Button>
          <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 font-medium py-3">
            📅 Book Swap
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}