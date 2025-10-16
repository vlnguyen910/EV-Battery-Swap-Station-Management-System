import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"

export default function VehicleStatus() {
  const batteryLevel = 68
  const range = 286

  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader className="bg-blue-800 text-white rounded-lg">
        <div className="flex flex-row items-center justify-between pt-2 py-1">
          <h2 className="text-xl font-bold">Vehicle Status</h2>
          <Button variant="outline" size="sm" className="bg-white text-blue-800 border-white hover:bg-blue-50">
            Manage Vehicle
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Vehicle Image */}
        {/* <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 flex justify-center">
          <div className="w-48 h-32 bg-white rounded-lg shadow-md flex items-center justify-center">
            <span className="text-6xl">bla bla bla</span>
          </div>
        </div> */}

        {/* Vehicle Info */}
        <div className="text-center space-y-2 bg-gray-200 shadow-md rounded-lg p-4">
          <h3 className="text-2xl font-bold text-gray-800">Tesla Model 3</h3>
          <p className="text-gray-600 font-medium">License: ABC-1234</p>
          <p className="text-gray-500 text-sm">VIN: 5YJ3E1EA1JF000001</p>
        </div>

        {/* Battery Status */}
        <div className="space-y-4 bg-gray-200 shadow-sm rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Current Battery Level</span>
            <span className="text-3xl font-bold text-blue-800">{batteryLevel}%</span>
          </div>

          {/* Battery Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-800 to-blue-500 h-4 rounded-full transition-all duration-300 shadow-sm"
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
              Range: {range} km remaining
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
          {/* <Button variant="outline" className="text-blue-800 border-blue-800 hover:bg-blue-50 font-medium py-3">
            Book Swap
          </Button> */}
        </div>
      </CardContent>
    </Card>
  )
}