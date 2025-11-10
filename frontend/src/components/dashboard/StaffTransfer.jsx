import React, { useState, useEffect } from 'react'
import TransferTicketCard from './TransferTicketCard'
import { useAuth } from '../../hooks/useContext'
import batteryTransferService from '../../services/batteryTransferService'
import { toast } from 'sonner'

function StaffTransfer() {
    const { user } = useAuth()
    const [pendingRequests, setPendingRequests] = useState([])
    const [allRequests, setAllRequests] = useState([])
    const [filteredRequests, setFilteredRequests] = useState([])
    const [loading, setLoading] = useState(true)

    // Filter states
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [filterFromStation, setFilterFromStation] = useState('')
    const [filterToStation, setFilterToStation] = useState('')

    // Pagination for pending exports and imports
    const [exportIndex, setExportIndex] = useState(0)
    const [importIndex, setImportIndex] = useState(0)

    useEffect(() => {
        if (user?.station_id) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.station_id])

    useEffect(() => {
        applyFilters()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allRequests, searchQuery, filterType, filterFromStation, filterToStation])

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await batteryTransferService.getAllRequests()
            const requests = response.data || response

            // Filter pending requests for current station
            const pending = requests.filter(
                req => req.status === 'in_progress' &&
                    (req.from_station_id === user.station_id || req.to_station_id === user.station_id)
            )

            setPendingRequests(pending)
            setAllRequests(requests)
        } catch (error) {
            console.error('Error fetching transfer data:', error)
            toast.error('Failed to load transfer requests')
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...allRequests]

        if (searchQuery) {
            filtered = filtered.filter(req => {
                const reqId = (req.transfer_request_id || '').toString().toLowerCase()
                const from = (req.fromStation?.station_name || '').toLowerCase()
                const to = (req.toStation?.station_name || '').toLowerCase()
                return reqId.includes(searchQuery.toLowerCase()) ||
                    from.includes(searchQuery.toLowerCase()) ||
                    to.includes(searchQuery.toLowerCase())
            })
        }

        if (filterType && filterType !== 'all') {
            filtered = filtered.filter(req => {
                const reqType = req.to_station_id === user?.station_id ? 'import' : 'export'
                return reqType === filterType
            })
        }

        if (filterFromStation) {
            filtered = filtered.filter(req =>
                req.fromStation?.station_name === filterFromStation
            )
        }

        if (filterToStation) {
            filtered = filtered.filter(req =>
                req.toStation?.station_name === filterToStation
            )
        }

        setFilteredRequests(filtered)
    }

    const handleConfirm = async (request) => {
        try {
            await batteryTransferService.updateRequest(request.transfer_request_id, {
                status: 'completed'
            })
            toast.success('Transfer confirmed successfully')
            fetchData()
        } catch (error) {
            console.error('Error confirming transfer:', error)
            toast.error('Failed to confirm transfer')
        }
    }

    const getStatusLabel = (status) => {
        if (status === 'completed') return 'Completed'
        if (status === 'in_progress') return 'In Transit'
        return 'Pending'
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    // Separate pending requests into exports and imports
    const pendingExports = pendingRequests.filter(req => req.from_station_id === user?.station_id)
    const pendingImports = pendingRequests.filter(req => req.to_station_id === user?.station_id)

    const currentExport = pendingExports[exportIndex]
    const currentImport = pendingImports[importIndex]

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with title and user info */}
                <div className="flex items-center justify-between gap-3 mb-8">
                    <h1 className="text-[#212529] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                        Battery Transfer Management
                    </h1>
                </div>

                {/* Pending Transfers Section - 2 Column Grid */}
                <section className="mb-10">
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-8">
                        {/* Pending Exports Column */}
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between pb-3 pt-5">
                                <h2 className="text-[#212529] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                                    Pending Exports
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {pendingExports.length > 0 ? `Export ${exportIndex + 1} of ${pendingExports.length}` : 'No exports'}
                                    </span>
                                    {pendingExports.length > 1 && (
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => setExportIndex(Math.max(0, exportIndex - 1))}
                                                disabled={exportIndex === 0}
                                                className="flex items-center justify-center size-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setExportIndex(Math.min(pendingExports.length - 1, exportIndex + 1))}
                                                disabled={exportIndex === pendingExports.length - 1}
                                                className="flex items-center justify-center size-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {currentExport ? (
                                <TransferTicketCard
                                    type="export"
                                    stationLabel={`From: ${currentExport.fromStation?.station_name || 'Unknown'} (Your Station)`}
                                    fromStation={currentExport.fromStation?.station_name || 'Unknown'}
                                    toStation={currentExport.toStation?.station_name || 'Unknown'}
                                    quantity={currentExport.quantity}
                                    model={currentExport.battery_model || 'N/A'}
                                    buttonText="Confirm & Prepare for Dispatch"
                                    onConfirm={() => handleConfirm(currentExport)}
                                    borderColor="border-orange-500"
                                    icon="north_east"
                                    iconColor="text-orange-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-orange-300 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/10 min-h-[220px]">
                                    <p className="text-orange-600 dark:text-orange-400 font-medium text-lg">No pending exports</p>
                                </div>
                            )}
                        </div>

                        {/* Pending Imports Column */}
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between pb-3 pt-5">
                                <h2 className="text-[#212529] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                                    Pending Imports
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {pendingImports.length > 0 ? `Import ${importIndex + 1} of ${pendingImports.length}` : 'No imports'}
                                    </span>
                                    {pendingImports.length > 1 && (
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => setImportIndex(Math.max(0, importIndex - 1))}
                                                disabled={importIndex === 0}
                                                className="flex items-center justify-center size-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setImportIndex(Math.min(pendingImports.length - 1, importIndex + 1))}
                                                disabled={importIndex === pendingImports.length - 1}
                                                className="flex items-center justify-center size-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {currentImport ? (
                                <TransferTicketCard
                                    type="import"
                                    stationLabel={`To: ${currentImport.toStation?.station_name || 'Unknown'} (Your Station)`}
                                    fromStation={currentImport.fromStation?.station_name || 'Unknown'}
                                    toStation={currentImport.toStation?.station_name || 'Unknown'}
                                    quantity={currentImport.quantity}
                                    model={currentImport.battery_model || 'N/A'}
                                    buttonText="Receive & Confirm Inventory"
                                    onConfirm={() => handleConfirm(currentImport)}
                                    borderColor="border-green-500"
                                    icon="south_west"
                                    iconColor="text-green-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-green-300 dark:border-green-900/50 bg-green-50 dark:bg-green-900/10 min-h-[220px]">
                                    <p className="text-green-600 dark:text-green-400 font-medium text-lg">No pending imports</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Transfer History Section */}
                <section className="mt-10">
                    <h2 className="text-[#212529] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                        Transfer History
                    </h2>

                    {/* Search and Filter Bar */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 mb-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full md:w-auto md:flex-1">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                    search
                                </span>
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:max-w-xs h-10 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-primary focus:border-primary text-sm"
                                    placeholder="Search by Ticket ID, Station..."
                                    type="text"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full sm:w-auto h-10 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-primary focus:border-primary text-sm"
                                >
                                    <option value="all">Type: All</option>
                                    <option value="import">Import</option>
                                    <option value="export">Export</option>
                                </select>
                                <select
                                    value={filterFromStation}
                                    onChange={(e) => setFilterFromStation(e.target.value)}
                                    className="w-full sm:w-auto h-10 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-primary focus:border-primary text-sm"
                                >
                                    <option value="">From Station</option>
                                    {[...new Set(allRequests.map(r => r.fromStation?.station_name))].filter(Boolean).map(station => (
                                        <option key={station} value={station}>{station}</option>
                                    ))}
                                </select>
                                <select
                                    value={filterToStation}
                                    onChange={(e) => setFilterToStation(e.target.value)}
                                    className="w-full sm:w-auto h-10 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-primary focus:border-primary text-sm"
                                >
                                    <option value="">To Station</option>
                                    {[...new Set(allRequests.map(r => r.toStation?.station_name))].filter(Boolean).map(station => (
                                        <option key={station} value={station}>{station}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                        {filteredRequests.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                No transfer records found
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                                <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3">Ticket ID</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">From</th>
                                        <th className="px-6 py-3">To</th>
                                        <th className="px-6 py-3 text-right">Quantity</th>
                                        <th className="px-6 py-3">Model</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map((request) => {
                                        const isImport = request.to_station_id === user?.station_id
                                        const typeBg = isImport
                                            ? 'bg-green-100 dark:bg-green-900/50'
                                            : 'bg-orange-100 dark:bg-orange-900/50'
                                        const typeText = isImport
                                            ? 'text-green-700 dark:text-green-300'
                                            : 'text-orange-700 dark:text-orange-300'

                                        let statusBg = 'bg-gray-100 dark:bg-gray-900/50'
                                        let statusText = 'text-gray-700 dark:text-gray-300'

                                        if (request.status === 'completed') {
                                            statusBg = 'bg-green-100 dark:bg-green-900/50'
                                            statusText = 'text-green-800 dark:text-green-300'
                                        } else if (request.status === 'in_progress') {
                                            statusBg = 'bg-yellow-100 dark:bg-yellow-900/50'
                                            statusText = 'text-yellow-800 dark:text-yellow-300'
                                        }

                                        return (
                                            <tr key={request.transfer_request_id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                    #{request.transfer_request_id || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">{formatDate(request.created_at)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full ${typeBg} px-2 py-1 text-xs font-medium ${typeText}`}>
                                                        <span className="material-symbols-outlined !text-sm">
                                                            {isImport ? 'south_west' : 'north_east'}
                                                        </span>
                                                        {isImport ? 'IMPORT' : 'EXPORT'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{request.fromStation?.station_name || 'Unknown'}</td>
                                                <td className="px-6 py-4">{request.toStation?.station_name || 'Unknown'}</td>
                                                <td className="px-6 py-4 text-right">{request.quantity || 'N/A'}</td>
                                                <td className="px-6 py-4">{request.battery_model || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full ${statusBg} px-2.5 py-0.5 text-xs font-medium ${statusText}`}>
                                                        {getStatusLabel(request.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default StaffTransfer