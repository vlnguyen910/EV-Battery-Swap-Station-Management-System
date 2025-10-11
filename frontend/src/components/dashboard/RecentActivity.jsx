import { Card, CardContent, CardHeader } from "../ui/card"

const activities = [
  {
    station: "Downtown Station A",
    time: "2 hours ago",
    cost: "$8.50",
    status: "completed",
    progress: "40% → 100%",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    station: "Mall Station B", 
    time: "Yesterday",
    cost: "$8.50",
    status: "completed",
    progress: "25% → 100%",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    station: "Airport Station C",
    time: "3 days ago", 
    cost: "$8.50",
    status: "completed",
    progress: "30% → 100%",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  }
]

export default function RecentActivity() {
  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold">Recent Activity</h2>
          <button className="text-white hover:text-blue-100 text-sm font-medium underline">
            View All
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={index}
              className={`${activity.bgColor} border ${activity.borderColor} rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-all`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-300">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{activity.station}</p>
                  <p className="text-gray-600 text-sm font-medium">{activity.time}</p>
                  <p className="text-gray-700 text-sm">{activity.progress}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-green-600">{activity.cost}</p>
                <p className="text-green-500 text-sm font-medium capitalize">{activity.status}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}