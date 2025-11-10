import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import batteryTransferService from '../../services/batteryTransferService'

function ConfirmReceiveBatteriesModal({
    isOpen,
    ticketId,
    transferRequestId,
    stationId,
    onClose,
    onConfirm
}) {
    const [batteries, setBatteries] = useState([])
    const [loading, setLoading] = useState(false)
    const [confirmChecked, setConfirmChecked] = useState(false)

    // Fetch batteries from export ticket when modal opens
    useEffect(() => {
        if (isOpen && transferRequestId && stationId) {
            fetchExportedBatteries()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, transferRequestId, stationId])

    const fetchExportedBatteries = async () => {
        try {
            setLoading(true)
            // Get available batteries that were exported
            const data = await batteryTransferService.getAvailableBatteriesEnriched(
                transferRequestId,
                'export', // Export ticket to see what was sent
                stationId
            )

            const batteriesList = data.available_batteries || (Array.isArray(data) ? data : data.data || [])
            setBatteries(batteriesList)
        } catch (error) {
            console.error('Error fetching exported batteries:', error)
            toast.error('Failed to load battery list')
        } finally {
            setLoading(false)
        }
    }

    const handleConfirm = () => {
        if (!confirmChecked) {
            toast.error('Please confirm that all batteries are in good condition')
            return
        }

        // Call parent with battery IDs to confirm import
        const batteryIds = batteries.map(b => b.battery_id || b.id)
        onConfirm(batteryIds)

        // Reset state
        setConfirmChecked(false)
    }

    const handleClose = () => {
        setConfirmChecked(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-[#212529] dark:text-white">
                            Confirm Received Batteries (Ticket #{ticketId})
                        </h2>
                        <p className="text-base text-gray-600 dark:text-gray-400">
                            Verify the list of batteries received from source station.
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content - Scrollable Table */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : batteries.length === 0 ? (
                        <div className="flex justify-center items-center h-40 text-gray-500 dark:text-gray-400">
                            <p>No batteries to receive</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                                <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3">Battery ID</th>
                                        <th className="px-6 py-3">Model</th>
                                        <th className="px-6 py-3">State of Charge (SOC)</th>
                                        <th className="px-6 py-3">State of Health (SOH)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {batteries.map((battery) => {
                                        const batteryId = battery.battery_id || battery.id
                                        return (
                                            <tr key={batteryId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                    {batteryId}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {battery.model || battery.battery_model || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 max-w-xs">
                                                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                                                    style={{
                                                                        width: `${battery.current_charge || battery.soc || battery.state_of_charge || 0}%`
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white min-w-fit">
                                                            {battery.current_charge || battery.soc || battery.state_of_charge || 0}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 max-w-xs">
                                                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                                                    style={{
                                                                        width: `${battery.soh || 0}%`
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white min-w-fit">
                                                            {battery.soh || battery.state_of_health || 0}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Confirmation Checkbox */}
                {!loading && batteries.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={confirmChecked}
                                onChange={(e) => setConfirmChecked(e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                I confirm that all batteries listed above have been received and are in good condition.
                            </span>
                        </label>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                    >
                        Report Issue
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!confirmChecked || loading}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        Confirm & Add to Inventory
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmReceiveBatteriesModal
