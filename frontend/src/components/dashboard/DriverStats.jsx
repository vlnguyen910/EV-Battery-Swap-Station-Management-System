import { RefreshCw, DollarSign, Clock, Calendar } from "lucide-react"

const stats = [
  {
    label: "Total Swaps",
    value: "18",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: RefreshCw
  },
  {
    label: "Total Cost",
    value: "$153.00",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: DollarSign
  },
  {
    label: "Avg. Time",
    value: "4.2 min",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    icon: Clock
  },
]

export default function DriverStats() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-gray-800" />
        <h2 className="text-xl font-bold text-gray-800">This Month</h2>
      </div>
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`bg-gray-200 rounded-lg p-4 flex justify-between items-center`}>
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-indigo-700" />
                <span className="text-gray-700 font-medium">{stat.label}</span>
              </div>
              <span className={`font-bold text-2xl text-indigo-700`}>
                {stat.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}