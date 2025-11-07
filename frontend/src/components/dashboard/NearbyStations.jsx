import { Card, CardContent, CardHeader } from "../ui/card"
import { MapPin, Navigation, ArrowRight, Zap } from "lucide-react"

export default function NearbyStations({ stations = [] }) {
  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader className="bg-blue-800 text-white rounded-lg pt-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            <h2 className="text-lg font-bold">Nearby Stations</h2>
          </div>
          <button className="text-white hover:text-green-100 text-sm font-medium underline">
            View All
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {stations.map((station) => {
            // Handle both camelCase and snake_case from backend
            const availableCount = station.available_batteries ?? station.availableBatteries ?? 0;
            const totalCount = station.total_batteries ?? station.totalBatteries ?? 0;

            return (
              <div
                key={station.station_id || station.id}
                className={`bg-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-indigo-300 transition-all cursor-pointer border border-gray-100`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${availableCount > 0 ? 'bg-green-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center`}>
                    <Zap className={`w-5 h-5 ${availableCount > 0 ? 'text-green-600' : 'text-yellow-600'}`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm text-indigo-800`}>{station.name}</p>
                    <div className="flex items-center gap-1 text-gray-600 text-xs font-medium">
                      <MapPin className="w-3 h-3" />
                      <p>{station.address}</p>
                    </div>
                    <p className="text-green-700 font-medium text-xs mt-1">
                      {availableCount}/{totalCount} Slots Available
                    </p>
                  </div>
                </div>
                <button className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded-lg transition-colors shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          {stations.length === 0 && (
            <p className="text-sm text-gray-500">No stations available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}