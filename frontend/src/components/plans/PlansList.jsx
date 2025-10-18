import PlanCard from './PlanCard'

export default function PlansList({ plans, subscriptions, onSubscribe }) {
  if (!plans || plans.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No plans available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {plans.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          subscribed={subscriptions.some(s => s.name === plan.name)}
          onSubscribe={onSubscribe}
        />
      ))}
    </div>
  )
}
