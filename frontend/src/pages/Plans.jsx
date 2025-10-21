import { useEffect, useState } from 'react'
import PlansList from '../components/plans/PlansList'
import SubscribedList from '../components/plans/SubscribedList'
import { packageService } from '../services/packageService'

export default function Plans() {
  const [packages, setPackages] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Transform package data from backend to UI format
  const transformPackageToUI = (pkg) => ({
    id: String(pkg.package_id),
    name: pkg.name,
    description: pkg.description,
    price: pkg.base_price && pkg.base_price > 0 ? `$${pkg.base_price}` : 'Contact sales',
    period: pkg.duration_days && pkg.duration_days > 0
      ? pkg.duration_days === 30
        ? 'per month'
        : `per ${pkg.duration_days} days`
      : 'per swap',
    features: [
      pkg.base_distance && pkg.base_distance > 0 ? `${pkg.base_distance} km included` : 'Flexible swaps',
      pkg.phi_phat && pkg.phi_phat > 0 ? `Extra fee: $${pkg.phi_phat}` : 'No extra fee',
      'Access to all stations',
      'Mobile app access',
      '24/7 customer support'
    ],
    details: pkg.description,
    rawData: pkg
  })

  // Fetch packages from backend
  const fetchPackages = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await packageService.getAllPackages()
      const packagesData = response.data || response
      
      // Filter active packages and transform for UI
      const activePackages = packagesData
        .filter(pkg => pkg.active)
        .map(transformPackageToUI)
      
      setPackages(activePackages)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching packages:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load subscriptions from localStorage (temporary until backend is ready)
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('subscriptions')
    if (savedSubscriptions) {
      try {
        setSubscriptions(JSON.parse(savedSubscriptions))
      } catch (err) {
        console.error('Error parsing subscriptions:', err)
        setSubscriptions([])
      }
    }
  }, [])

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages()
  }, [])

  function handleSubscribe(plan) {
    const newSub = {
      id: Date.now(), // temporary ID
      package_id: plan.rawData.package_id,
      name: plan.name,
      price: plan.price,
      period: plan.period,
      subscribedAt: new Date().toISOString()
    }

    const updatedSubscriptions = [...subscriptions, newSub]
    setSubscriptions(updatedSubscriptions)
    
    // Save to localStorage (temporary until backend is ready)
    localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions))
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading packages...</div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-medium text-lg">Error loading packages</h3>
            <p className="text-red-600 text-sm mt-2">{error}</p>
            <button 
              onClick={fetchPackages}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Plans & Subscriptions</h1>

        <section className="mb-8">
          <PlansList
            plans={packages}
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
}1111