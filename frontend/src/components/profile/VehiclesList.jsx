import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Bike, X } from 'lucide-react';
import AddVehicleDialog from './AssignVehicle'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { vehicleService } from '../../services/vehicleService'
import { toast } from 'sonner'

export default function VehiclesList({ vehicles = [], onAddVehicle }) {
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [removeVehicle, setRemoveVehicle] = useState(null)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleAdded = (info) => {
    // parent can refresh by passing onAddVehicle
    if (onAddVehicle) onAddVehicle()
    // show suggestion banner if user declined subscription
    if (info?.suggestedSubscription) setShowSuggestion(true)
    // hide after a while
    setTimeout(() => setShowSuggestion(false), 8000)
  }

  const handleRemoveClick = (vehicle) => {
    setRemoveVehicle(vehicle)
    setConfirmOpen(true)
  }

  const handleConfirmRemove = async () => {
    if (!removeVehicle) return

    setIsRemoving(true)
    try {
      await vehicleService.removeVehicleFromCurrentUser(removeVehicle.vin)
      toast.success('Vehicle unlinked successfully!')
      setConfirmOpen(false)
      setRemoveVehicle(null)
      // Refresh vehicle list
      if (onAddVehicle) onAddVehicle()
    } catch (error) {
      console.error('Error removing vehicle:', error)
      toast.error(error.response?.data?.message || 'Cannot unlink vehicle')
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Linked Vehicles</h2>
        <AddVehicleDialog onAdded={handleAdded} />
      </div>

      {showSuggestion && (
        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm">
          Vehicle added. You can <a className="text-blue-600 underline" href="/driver/plans">subscribe to a battery rental plan</a> for this vehicle later.
        </div>
      )}

      <div className="space-y-4">
        {vehicles.map((v, idx) => (
          <div key={idx} className="border border-gray-200 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Bike className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-lg text-gray-900">{v.name || v.vin || 'Vehicle'}</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">VIN:</span>
                    <span className="text-gray-800 ml-1">{v.vin}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Battery Module:</span>
                    <span className="text-gray-800 ml-1">{v.battery_model}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveClick(v)}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">Unlink</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm dialog for removing vehicle */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Unlink Vehicle</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to unlink the vehicle <strong>{removeVehicle?.vin}</strong> from your account?</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={isRemoving}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={isRemoving}
            >
              {isRemoving ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
