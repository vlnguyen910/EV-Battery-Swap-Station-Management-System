import { Card, CardContent, CardHeader } from "../ui/card"

const stations = [
  {
    name: "Downtown Station A",
    distance: "0.8 km • 3 slots",
    status: "available",
    icon: "🟢",
    bgColor: "bg-green-50",
    textColor: "text-green-700"
  },
  {
    name: "Mall Station B",
    distance: "1.2 km • 2 slots",
    status: "busy", 
    icon: "🟡",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700"
  },
  {
    name: "University Station D",
    distance: "1.5 km • 4 slots",
    status: "available",
    icon: "🟢",
    bgColor: "bg-green-50",
    textColor: "text-green-700"
  }
]

export default function NearbyStations() {
  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold">Nearby Stations</h2>
          <button className="text-white hover:text-green-100 text-sm font-medium underline">
            View All
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {stations.map((station, index) => (
            <div 
              key={index} 
              className={`${station.bgColor} rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border border-gray-100`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{station.icon}</span>
                <div>
                  <p className={`font-semibold text-sm ${station.textColor}`}>{station.name}</p>
                  <p className="text-gray-600 text-xs font-medium">{station.distance}</p>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-sm">
                <span className="text-sm font-medium">→</span>
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}