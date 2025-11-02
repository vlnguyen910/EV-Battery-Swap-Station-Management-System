import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { vehicleService } from '../../services/vehicleService'

export default function SubscribeModal({ open, onClose, plan, user, onPay, paying }) {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return
    const fetchVehicles = async () => {
      if (!user?.id) return
      setLoading(true)
      setError(null)
      try {
        const res = await vehicleService.getVehiclesByUser(user.id)
        const data = res?.data || res || []
        setVehicles(Array.isArray(data) ? data : [])
        if (Array.isArray(data) && data.length > 0) setSelectedVehicle(String(data[0].id || data[0].vehicle_id || data[0].vin))
      } catch (err) {
        console.error('Error fetching vehicles', err)
        setError('Failed to load vehicles')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [open, user])

  if (!open || !plan) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Subscribe to {plan.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{plan.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">Price</div>
              <div className="font-medium">{plan.price}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Period</div>
              <div className="font-medium">{plan.period}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">Select vehicle</div>
            {loading ? (
              <div className="mt-2 text-sm text-gray-500">Loading vehicles...</div>
            ) : error ? (
              <div className="mt-2 text-sm text-red-600">{error}</div>
            ) : vehicles.length === 0 ? (
              <div className="mt-2 text-sm text-gray-500">No vehicles found. You can add one later in your profile.</div>
            ) : (
              <select
                value={selectedVehicle || ''}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="mt-2 w-full border border-gray-200 rounded-md p-2 bg-white dark:bg-slate-700 dark:text-gray-100"
              >
                {vehicles.map((v) => {
                  const id = String(v.id || v.vehicle_id || v.vin)
                  const label = v.license_plate || v.plate || v.name || v.vin || id
                  return (
                    <option key={id} value={id}>{label}</option>
                  )
                })}
              </select>
            )}
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Features</div>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
              {plan.features && plan.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 p-4 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="">Cancel</Button>
          <Button
            onClick={() => onPay(selectedVehicle)}
            disabled={paying}
            className=""
          >
            {paying ? 'Processing...' : 'Pay'}
          </Button>
        </div>
      </div>
    </div>
  )
}
