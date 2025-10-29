import PlanCard from './PlanCard'

export default function PlansList({ plans, subscriptions, onSubscribe, loading }) {
  if (!plans || plans.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No plans available at the moment.</p>
      </div>
    )
  }

  // Create a set of subscribed package_ids for O(1) lookup
  const subscribedIds = new Set((subscriptions || []).map(s => String(s.package_id || s.rawData?.package_id || s.package?.package_id || s.id)))

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {plans.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          subscribed={subscribedIds.has(String(plan.rawData?.package_id || plan.id))}
          onSubscribe={onSubscribe}
          loading={loading}
        />
      ))}
    </div>
  )
}
