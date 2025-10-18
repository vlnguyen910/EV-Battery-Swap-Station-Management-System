import { useEffect, useState } from 'react'
import PlansList from '../components/plans/PlansList'
import SubscribedList from '../components/plans/SubscribedList'
import { battery_service_packages } from '../data/mockData'

// Map the battery_service_packages shape into the UI-friendly plan shape
const PLANS = battery_service_packages
  .filter(p => p.active)
  .map(p => ({
    id: String(p.package_id),
    name: p.name,
    description: p.description,
    price: p.base_price && p.base_price > 0 ? `$${p.base_price}` : 'Contact sales',
    period:
      p.duration_days && p.duration_days > 0
        ? p.duration_days === 30
          ? 'per month'
          : `per ${p.duration_days} days`
        : 'per swap',
    features: [
      p.base_distance && p.base_distance > 0 ? `${p.base_distance} km included` : 'Flexible swaps',
      p.phi_phat && p.phi_phat > 0 ? `Extra fee: $${p.phi_phat}` : 'No extra fee',
      'Access to all stations',
      'Mobile app access',
      '24/7 customer support'
    ],
    details: p.description
  }))

export default function Plans() {
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    // Load from localStorage if any
    const stored = localStorage.getItem('subscriptions')
    if (stored) setSubscriptions(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions))
  }, [subscriptions])

  function handleSubscribe(plan) {
    // Allow subscribing to multiple packages
    const newSub = {
      id: plan.id + '-' + Date.now(),
      name: plan.name,
      description: plan.description,
      price: plan.price,
      period: plan.period,
      details: plan.details,
      subscribedAt: new Date().toISOString()
    }

    setSubscriptions(prev => [...prev, newSub])
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Plans & Subscriptions</h1>

        <section className="mb-8">
          <PlansList
            plans={PLANS}
            subscriptions={subscriptions}
            onSubscribe={handleSubscribe}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Subscriptions</h2>
          <SubscribedList subscriptions={subscriptions} />
        </section>
      </div>
    </div>
  )
}
