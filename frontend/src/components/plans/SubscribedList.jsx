export default function SubscribedList({ subscriptions }) {
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">You don't have any active packages.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((s, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-800">{s.name}</div>
            <div className="text-sm text-gray-500">{s.description}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">{s.price}</div>
            <div className="text-sm text-gray-500">{s.period}</div>
            <div className="text-sm text-gray-500">{s.vehicle_id}</div>
          </div>
        </div>
      ))}
    </div>
  )
}