const stats = [
  {
    label: "Total Swaps",
    value: "18",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    label: "Total Cost",
    value: "$153.00",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    label: "Avg. Time",
    value: "4.2 min",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
]

export default function DriverStats() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">This Month</h2>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-indigo-200 rounded-lg p-4 flex justify-between items-center`}>
            <span className="text-gray-700 font-medium">{stat.label}</span>
            <span className={`font-bold text-2xl text-indigo-700`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}