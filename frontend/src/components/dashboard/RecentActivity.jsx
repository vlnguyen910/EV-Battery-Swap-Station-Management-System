import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { History, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { swapService } from "../../services/swapService"

export default function RecentActivity() {
  const [swapTransactions, setSwapTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  // Get user from localStorage
  const user = useMemo(() => {
    try {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    const fetchSwapHistory = async () => {
      if (!user?.id) {
        setSwapTransactions([])
        setLoading(false)
        return
      }

      try {
        const transactions = await swapService.getAllSwapTransactionsByUserId(user.id)
        
        // Get recent 3 transactions and transform to UI format (same as SwapHistory)
        const recentActivities = (transactions || [])
          .slice(0, 3)
          .map(transaction => ({
            transaction_id: transaction.transaction_id,
            date: transaction.createAt 
              ? new Date(transaction.createAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : 'N/A',
            time: transaction.createAt 
              ? new Date(transaction.createAt).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              : 'N/A',
            location: `Station ${transaction.station_id}`,
            amount: 1, // Each transaction is 1 battery swap
            status: transaction.status,
            createAt: transaction.createAt
          }))
        
        setSwapTransactions(recentActivities)
      } catch (error) {
        console.error('Error fetching swap transactions:', error)
        setSwapTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSwapHistory()
  }, [user?.id])

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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
          </div>
        ) : swapTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent swap transactions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {swapTransactions.map((activity) => (
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
                      <p>Duration: {activity.duration}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-indigo-500 text-sm font-medium capitalize">{activity.status}</p>
                  <p className="text-gray-500 text-xs">{new Date(activity.createAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}