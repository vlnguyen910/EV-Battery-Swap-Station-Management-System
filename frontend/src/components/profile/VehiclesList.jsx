import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Plus, Edit3, ToggleLeft, ToggleRight, Bike } from 'lucide-react';
import AddVehicleDialog from './AddVehicleDialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { useNavigate } from 'react-router-dom'
import { vehicleService } from '../../services/vehicleService'

export default function VehiclesList({ vehicles = [], onAddVehicle }) {
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const navigate = useNavigate()

  const handleAdded = (info) => {
    // parent can refresh by passing onAddVehicle
    if (onAddVehicle) onAddVehicle()
    // show suggestion banner if user declined subscription
    if (info?.suggestedSubscription) setShowSuggestion(true)
    // hide after a while
    setTimeout(() => setShowSuggestion(false), 8000)
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Linked Vehicles</h2>
        <AddVehicleDialog onAdded={handleAdded} />
      </div>

      {showSuggestion && (
        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm">
          Vehicle added. Bạn có thể <a className="text-blue-600 underline" href="/plans">đăng ký gói thuê pin</a> cho xe này sau.
        </div>
      )}

      <div className="space-y-4">
        {vehicles.map((v, idx) => (
          <div key={idx} className="border border-gray-200 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <Bike className={`w-6 h-6 ${v.active ? 'text-blue-600' : 'text-gray-400'}`} />
                  <h3 className="font-semibold text-lg text-gray-900">{v.name || v.vin || 'Vehicle'}</h3>
                  {v.status === 'active' ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Inactive</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">VIN:</span>
                    <span className="text-gray-800 ml-1">{v.vin}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Battery:</span>
                    <span className="text-gray-800 ml-1">{v.battery_model}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4 mt-1">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
                  <Edit3 className="w-5 h-5" />
                </Button>
                {v.status === 'active' ? (
                  // Active -> show green (on). Clicking will deactivate immediately.
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-green-600 hover:text-green-700"
                    onClick={async () => {
                      try {
                        await vehicleService.updateVehicle(v.vehicle_id, { status: 'inactive' })
                        if (onAddVehicle) onAddVehicle()
                      } catch (e) {
                        console.error('Failed to deactivate vehicle', e)
                      }
                    }}
                  >
                    <ToggleRight className="w-5 h-5" />
                  </Button>
                ) : (
                  // Inactive -> show red (off). Clicking should prompt to subscribe / go to plans.
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => {
                      setSelectedVehicle(v)
                      setConfirmOpen(true)
                    }}
                  >
                    <ToggleLeft className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm dialog when activating an inactive vehicle */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đăng ký gói thuê pin</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn cần đăng ký gói thuê pin để kích hoạt xe này. Bạn muốn chuyển tới trang đăng ký gói ngay bây giờ?</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Không</Button>
            <Button onClick={() => {
              setConfirmOpen(false)
              if (selectedVehicle?.vehicle_id) {
                navigate('/driver/plans', { state: { vehicle_id: selectedVehicle.vehicle_id } })
              } else {
                navigate('/driver/plans')
              }
            }}>Có</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
