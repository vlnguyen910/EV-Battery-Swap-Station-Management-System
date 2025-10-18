import { useEffect, useState } from 'react'
import PlansList from '../components/plans/PlansList'
import SubscribedList from '../components/plans/SubscribedList'
import { battery_service_packages } from '../data/mockData'
import { getActivePlans } from '../utils/planMapper'

// Get active plans from mock data
const PLANS = getActivePlans(battery_service_packages)

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
