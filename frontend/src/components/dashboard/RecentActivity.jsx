import { Card, CardContent, CardHeader } from "../ui/card"
import { History, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { mockSwapTransactions, mockStations, mockBatteries } from "../../data/mockData"

// Get recent 3 swap transactions
const activities = mockSwapTransactions
  .slice(0, 3)
  .map(swap => {
    const station = mockStations.find(s => s.station_id === swap.station_id);
    const batteryTaken = mockBatteries.find(b => b.battery_id === swap.battery_taken_id);
    const batteryReturned = mockBatteries.find(b => b.battery_id === swap.battery_returned_id);
    
    const createTime = new Date(swap.createAT);
    const updateTime = new Date(swap.updateAt);
    const durationMinutes = Math.floor((updateTime - createTime) / 60000);
    
    // Calculate time ago
    const now = new Date();
    const hoursAgo = Math.floor((now - createTime) / (1000 * 60 * 60));
    const timeAgo = hoursAgo < 24 
      ? `${hoursAgo} hours ago` 
      : hoursAgo < 48 
        ? 'Yesterday' 
        : `${Math.floor(hoursAgo / 24)} days ago`;
    
    return {
      transaction_id: swap.transaction_id,
      station: station?.name || 'Unknown Station',
      time: timeAgo,
      cost: `$${(5000 / 1000).toFixed(2)}`, // Service fee in USD equivalent
      status: swap.status,
      progress: `${batteryReturned?.pin_hien_tai?.toFixed(0) || 40}% → ${batteryTaken?.pin_hien_tai?.toFixed(0) || 100}%`,
      borderColor: "border-indigo-200",
      duration: `${durationMinutes} min`
    };
  });

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
          {activities.map((activity) => (
            <div 
              key={activity.transaction_id}
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