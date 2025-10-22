import { useEffect, useState } from 'react'
import PlansList from '../components/plans/PlansList'
import SubscribedList from '../components/plans/SubscribedList'
import { packageService } from '../services/packageService'
import { subscriptionService } from '../services/subscriptionService'

export default function Plans() {
  const [packages, setPackages] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError] = useState(null)

  // Get user from localStorage
  const getUser = () => {
    try {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    } catch (err) {
      console.error('Error parsing user data:', err)
      return null
    }
  }

  const user = getUser()

  // Transform package data from backend to UI format
  const transformPackageToUI = (pkg) => ({
    id: String(pkg.package_id),
    name: pkg.name,
    description: pkg.description,
    price: pkg.base_price && pkg.base_price > 0 ? `${pkg.base_price} vnd` : 'Contact sales',
    period: pkg.duration_days && pkg.duration_days > 0
      ? pkg.duration_days === 30
        ? 'per month'
        : `per ${pkg.duration_days} days`
      : 'per swap',
    features: [
      pkg.base_distance && pkg.base_distance > 0 ? `${pkg.base_distance} km included` : 'Flexible swaps',
      pkg.phi_phat && pkg.phi_phat > 0 ? `Extra fee: ${pkg.phi_phat}` : 'No extra fee',
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
      return activePackages
    } catch (err) {
      setError(err.message)
      console.error('Error fetching packages:', err)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Fetch user subscriptions from backend
  const fetchUserSubscriptions = async () => {
    if (!user?.id) {
      console.warn('No user ID found')
      return
    }

    try {
      const response = await subscriptionService.getSubscriptionsByUserId(user.id)
      const subscriptionsData = response.data || response
      console.log('Fetched subscriptions:', subscriptionsData)
      return Array.isArray(subscriptionsData) ? subscriptionsData : []
    } catch (err) {
      console.error('Error fetching subscriptions:', err)
      // If API fails, fallback to localStorage for now
      const savedSubscriptions = localStorage.getItem('subscriptions')
      if (savedSubscriptions) {
        try {
          return JSON.parse(savedSubscriptions)
        } catch (parseErr) {
          console.error('Error parsing local subscriptions:', parseErr)
          return []
        }
      }
      return []
    }
  }

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // fetch packages and subscriptions in parallel and return results
      const [fetchedPackages, fetchedSubscriptions] = await Promise.all([
        fetchPackages(),
        fetchUserSubscriptions()
      ])

      // Enrich subscriptions with package UI info when possible
      const enrichedSubs = (fetchedSubscriptions || []).map(sub => {
        // subscription may contain package_id or a nested package object
        const pkgId = sub.package_id || sub.package?.package_id || sub.packageId || sub.packageId
        const matched = (fetchedPackages || []).find(p => String(p.rawData.package_id) === String(pkgId) || String(p.id) === String(pkgId))
        return {
          ...sub,
          // prefer package fields from matched package, fall back to existing fields
          name: matched?.name || sub.name || (sub.package && sub.package.name),
          description: matched?.description || sub.description || (sub.package && sub.package.description),
          details: matched?.details || sub.details || (sub.package && sub.package.description),
          price: matched?.price || sub.price || (sub.package && sub.package.base_price),
          period: matched?.period || sub.period,
          package_id: pkgId || sub.package_id
        }
      })

      setSubscriptions(enrichedSubs)
    } catch (err) {
      setError(err.message)
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
    fetchAllData()
  }, [user?.id])

  // Handle subscription with backend API
  const handleSubscribe = async (plan) => {
    if (!user?.id) {
      alert('Please login to subscribe to a plan')
      return
    }

    setSubscribing(true)
    try {
      // Call backend API to create subscription
      await subscriptionService.createSubscription(user.id, plan.rawData.package_id)
      
      // Refresh subscriptions after successful subscription
      await fetchUserSubscriptions()
      
      alert(`Successfully subscribed to ${plan.name}!`)
    } catch (err) {
      console.error('Subscription failed:', err)
      alert(`Subscription failed: ${err.message}`)
      
      // Fallback: save to localStorage if API fails
      const newSub = {
        id: Date.now(), // temporary ID
        user_id: user.id,
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
    } finally {
      setSubscribing(false)
    }
  }

  // Check if user is already subscribed to a package
  const isUserSubscribed = (packageId) => {
    return subscriptions.some(sub => 
      String(sub.package_id) === String(packageId)
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading packages and subscriptions...</div>
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
              onClick={fetchAllData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No user state
  if (!user) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-yellow-800 font-medium text-lg">Authentication Required</h3>
            <p className="text-yellow-600 text-sm mt-2">Please login to view and manage your subscriptions.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Plans & Subscriptions</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
        </div>

        <section className="mb-8">
          <PlansList
            plans={packages}
            subscriptions={subscriptions}
            onSubscribe={handleSubscribe}
            loading={subscribing}
            isUserSubscribed={isUserSubscribed}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Subscriptions</h2>
          <SubscribedList 
            subscriptions={subscriptions}
            onRefresh={fetchUserSubscriptions}
          />
        </section>
      </div>
    </div>
  )
}