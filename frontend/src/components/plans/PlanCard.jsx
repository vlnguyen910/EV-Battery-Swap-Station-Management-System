import { Button } from "../ui/button"

export default function PlanCard({ plan, onSubscribe, subscribed }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
          <p className="text-sm text-gray-600">{plan.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
          <div className="text-sm text-gray-500">{plan.period}</div>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {plan.features.map((f, i) => (
          <li key={i} className="text-sm text-gray-600">• {f}</li>
        ))}
      </ul>

      <div className="mt-6">
        {subscribed ? (
          <Button variant="outline" className="w-full" disabled>Subscribed</Button>
        ) : (
          <Button className="w-full" onClick={() => onSubscribe(plan)}>Subscribe</Button>
        )}
      </div>
    </div>
  )
}