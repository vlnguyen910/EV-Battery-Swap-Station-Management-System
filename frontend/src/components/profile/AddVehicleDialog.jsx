import React, { useEffect, useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { batteryService } from '../../services/batteryService'
import { vehicleService } from '../../services/vehicleService'
import { useAuth } from '../../hooks/useContext'
import { useNavigate } from 'react-router-dom'

export default function AddVehicleDialog({ onAdded }) {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(1)

    // Step 1 fields
    const [vin, setVin] = useState('')
    const [batteryModel, setBatteryModel] = useState('')
    const [batteryType, setBatteryType] = useState('')
    const [modules, setModules] = useState([]) // unique module options (model+type)
    const [selectedModuleKey, setSelectedModuleKey] = useState('')

    const [batteryTypes, setBatteryTypes] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [createdVehicle, setCreatedVehicle] = useState(null)

    useEffect(() => {
        if (!open) return
        const load = async () => {
            try {
                const resp = await batteryService.getAllBatteries()
                const list = resp?.data ?? resp ?? []
                // derive unique types
                const types = Array.from(new Set((list || []).map(b => b.type || b.battery_type).filter(Boolean)))
                setBatteryTypes(types)
                // derive unique module options (by model + type)
                const map = new Map()
                    ; (list || []).forEach((b) => {
                        const model = b.model || b.battery_model || ''
                        const type = b.type || b.battery_type || ''
                        const key = `${model}||${type}`
                        if (!map.has(key)) map.set(key, { key, model, type })
                    })
                setModules(Array.from(map.values()))
            } catch (err) {
                console.error('Error loading batteries:', err)
                setBatteryTypes([])
            }
        }
        load()
    }, [open])

    const onContinue = async () => {
        // validate
        if (!vin || !batteryModel || !batteryType) {
            setError('Please fill VIN, battery model and battery type')
            return
        }
        setError(null)
        setLoading(true)

        try {
            // Always create vehicle as 'inactive'. Activation will happen after successful subscription/payment.
            const payload = {
                user_id: user.id,
                vin,
                battery_model: batteryModel,
                battery_type: batteryType,
                status: 'inactive',
            }

            const created = await vehicleService.createVehicle(payload)
            setCreatedVehicle(created)
            setStep(2)
        } catch (err) {
            console.error('Error creating vehicle:', err)
            setError(err?.response?.data?.message || err.message || 'Failed to create vehicle')
        } finally {
            setLoading(false)
        }
    }

    const handleSubscribe = () => {
        // navigate to plans and pass vehicle id
        setOpen(false)
        if (createdVehicle?.vehicle_id) {
            navigate('/plans', { state: { vehicle_id: createdVehicle.vehicle_id } })
        } else {
            navigate('/plans')
        }
    }

    const handleFinishWithoutSubscribe = () => {
        setOpen(false)
        // notify parent to refresh list and optionally show banner
        if (onAdded) onAdded({ vehicle: createdVehicle, suggestedSubscription: true })
        // reset form
        setStep(1)
        setVin('')
        setBatteryModel('')
        setBatteryType('')
        setCreatedVehicle(null)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">Add Vehicle</Button>
                </DialogTrigger>

                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{step === 1 ? 'Add Vehicle' : 'Subscription'}</DialogTitle>
                    </DialogHeader>

                    {step === 1 ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-700">VIN</label>
                                <Input value={vin} onChange={(e) => setVin(e.target.value)} placeholder="Enter VIN" />
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">Battery Module</label>
                                <select
                                    className="w-full border rounded px-2 py-1"
                                    value={selectedModuleKey ?? ''}
                                    onChange={(e) => {
                                        const key = e.target.value || ''
                                        setSelectedModuleKey(key)
                                        const mod = modules.find(m => m.key === key)
                                        if (mod) {
                                            setBatteryModel(mod.model || '')
                                            setBatteryType(mod.type || '')
                                        } else {
                                            setBatteryModel('')
                                            setBatteryType('')
                                        }
                                    }}
                                >
                                    <option value="">-- Select battery module --</option>
                                    {(modules || []).map(m => (
                                        <option key={m.key} value={m.key}>{`${m.model} (${m.type})`}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">Battery Type</label>
                                <select className="w-full border rounded px-2 py-1" value={batteryType} onChange={(e) => setBatteryType(e.target.value)}>
                                    <option value="">Select battery type</option>
                                    {(batteryTypes || []).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            {error && <div className="text-sm text-red-600">{error}</div>}

                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button onClick={onContinue} disabled={loading}>{loading ? 'Working…' : 'Tiếp tục'}</Button>
                            </DialogFooter>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p>Bạn có muốn đăng ký gói thuê pin cho xe này không?</p>
                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" onClick={handleFinishWithoutSubscribe}>Không</Button>
                                <Button onClick={handleSubscribe}>Có — Đăng ký</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </div>
        </Dialog>
    )
}
