import { useState } from 'react'
import { ChevronDown, ChevronUp, XCircle, Calendar, CreditCard } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

export default function CancelledSubscriptions({ subscriptions = [] }) {
  const [isOpen, setIsOpen] = useState(false)

  const cancelledSubs = subscriptions.filter(sub => 
    sub.status === 'cancelled' || sub.status === 'CANCELLED' || sub.status === 'canceled'
  )

  if (cancelledSubs.length === 0) {
    return null
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch (err) {
      return dateString
    }
  }

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return amount
    return Number(amount).toLocaleString('en-US')
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-gray-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Cancelled Subscriptions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {cancelledSubs.length} {cancelledSubs.length === 1 ? 'subscription' : 'subscriptions'} cancelled
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {cancelledSubs.map((sub, index) => (
            <Card key={sub.subscription_id || index} className="border-gray-200 dark:border-slate-700 opacity-75">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {sub.name || sub.package?.name || 'Subscription'}
                    </CardTitle>
                    <CardDescription>
                      {sub.description || sub.package?.description || 'No description'}
                    </CardDescription>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Cancelled
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {/* Start Date */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Started</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(sub.start_date)}
                      </p>
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Cancelled On</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(sub.end_date || sub.cancelled_at || sub.updated_at)}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  {(sub.price || sub.package?.base_price) && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CreditCard className="w-4 h-4" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Price</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(sub.price || sub.package?.base_price)} VND
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Distance Used */}
                  {sub.distance_traveled !== undefined && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Distance Used</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(sub.distance_traveled)} / {formatCurrency(sub.package?.base_distance || sub.base_distance)} km
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vehicle Info */}
                {sub.vehicle && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Vehicle</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {sub.vehicle.brand} {sub.vehicle.model} - {sub.vehicle.license_plate || sub.vehicle.vin}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
