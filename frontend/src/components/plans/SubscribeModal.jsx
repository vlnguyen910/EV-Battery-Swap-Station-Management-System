import React, { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle } from 'lucide-react'
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
        const res = await vehicleService.getVehicleByUserId(user.id)
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
    <div className="fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center p-4">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
        {/* ToolBar / Close Button */}
        <div className="flex justify-end p-2">
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-8 pb-8">
          {/* PageHeading */}
          <div className="flex flex-wrap justify-between gap-3 pb-2">
            <p className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight w-full text-center">
              Subscribe to {plan.name}
            </p>
          </div>
          
          {/* BodyText */}
          <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal text-center">
            {plan.description}
          </p>
          
          {/* HeadlineText - Price */}
          <h2 className="text-slate-900 dark:text-white tracking-tight text-4xl font-bold leading-tight text-center pb-6 pt-4">
            {plan.price} <span className="text-base font-medium text-slate-500 dark:text-slate-400">/ {plan.period}</span>
          </h2>
          
          {/* Vehicle Selection */}
          <div className="w-full py-3">
            <label className="flex flex-col w-full">
              <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">
                Select your vehicle
              </p>
              {loading ? (
                <div className="text-sm text-slate-500 dark:text-slate-400 py-3">Loading vehicles...</div>
              ) : error ? (
                <div className="text-sm text-red-600 dark:text-red-400 py-3">{error}</div>
              ) : vehicles.length === 0 ? (
                <div className="text-sm text-slate-500 dark:text-slate-400 py-3">
                  No vehicles found.
                </div>
              ) : (
                <select
                  value={selectedVehicle || ''}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="form-select flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-primary h-12 placeholder:text-slate-400 px-3 text-base font-normal leading-normal"
                >
                  {vehicles.map((v) => {
                    const id = String(v.id || v.vehicle_id || v.vin)
                    const brand = v.brand || v.make || ''
                    const model = v.model || ''
                    const plate = v.license_plate || v.plate || v.vin || id
                    const label = brand && model ? `${brand} ${model} - ${plate}` : plate
                    return (
                      <option key={id} value={id}>{label}</option>
                    )
                  })}
                </select>
              )}
            </label>
          </div>
          
          {/* Deposit Warning */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">First-time purchase notice</p>
              <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                A refundable deposit of <strong>400,000 VND</strong> will be charged for your first subscription purchase.
              </p>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="py-5">
            <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-3">
              Features Included
            </p>
            <ul className="space-y-3">
              {plan.features && plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="text-primary w-5 h-5 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Button Group */}
          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-6">
            <button
              onClick={() => onPay(selectedVehicle)}
              disabled={paying || loading}
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 py-3 text-base font-semibold leading-6 text-white transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paying ? 'Processing...' : 'Confirm & Pay'}
            </button>
            <button
              onClick={onClose}
              disabled={paying}
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-slate-100 dark:bg-slate-700 px-5 py-3 text-base font-semibold leading-6 text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
