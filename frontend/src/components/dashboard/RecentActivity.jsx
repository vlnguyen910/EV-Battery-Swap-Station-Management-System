import { Card, CardContent, CardHeader } from "../ui/card"
import { History, CheckCircle, Clock, TrendingUp } from "lucide-react"

//Nữa fetch data từ backend về
const activities = [
  {
    station: "Downtown Station A",
    time: "2 hours ago",
    cost: "$8.50",
    status: "completed",
    progress: "40% → 100%",
    borderColor: "border-indigo-200"
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
      <CardHeader className="bg-blue-800 text-white rounded-lg pt-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" />
            <h2 className="text-lg font-bold">Recent Activity</h2>
          </div>
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
              className={`bg-gray-200 border ${activity.borderColor} rounded-lg p-4 flex justify-between items-center hover:bg-indigo-300 transition-all`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-300">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{activity.station}</p>
                  <div className="flex items-center gap-1 text-gray-600 text-sm font-medium">
                    <Clock className="w-3 h-3" />
                    <p>{activity.time}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-700 text-sm">
                    <TrendingUp className="w-3 h-3" />
                    <p>{activity.progress}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-indigo-600">{activity.cost}</p>
                <p className="text-indigo-500 text-sm font-medium capitalize">{activity.status}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}