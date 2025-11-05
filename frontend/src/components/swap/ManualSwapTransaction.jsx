import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useBattery, useAuth, useSubscription, usePackage, useSwap, useReservation } from '../../hooks/useContext';
import { vehicleService } from '../../services/vehicleService';
import { reservationService } from '../../services/reservationService';
import { swapService } from '../../services/swapService';
import TransactionTimeFilter from '../transactions/TransactionTimeFilter';
import TransactionSearchBar from '../transactions/TransactionSearchBar';
import TransactionStatusFilter from '../transactions/TransactionStatusFilter';
import TransactionTable from '../transactions/TransactionTable';
import TransactionPagination from '../transactions/TransactionPagination';

export default function ManualSwapTransaction() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { batteries, getAllBatteries } = useBattery();
    const { user } = useAuth(); // Get logged-in staff info
    const { getActiveSubscription } = useSubscription();
    const { packages, getPackageById } = usePackage();
    const { createSwapTransaction, swapBatteries } = useSwap();
    const { updateReservationStatus } = useReservation();
    // Start as true if Luồng 1 (reservationId exists), false nếu Luồng 2
    const [loading, setLoading] = useState(!!searchParams.get('reservationId'));
    const [_vehicleData, setVehicleData] = useState(null);
    const [userVehicles, setUserVehicles] = useState([]);

    // Get data from URL params (passed from staff request list in Luồng 1)
    const reservationId = searchParams.get('reservationId');
    const urlUserId = searchParams.get('userId');
    const urlVehicleId = searchParams.get('vehicleId');
    const urlBatteryReturnedId = searchParams.get('batteryReturnedId');
    const urlSubscriptionId = searchParams.get('subscriptionId');
    const _subscriptionName = searchParams.get('subscriptionName');
    const _vin = searchParams.get('vin');

    // Staff's station_id from logged-in user
    const staffStationId = user?.station_id ? parseInt(user.station_id) : null;

    // minimal debug: station id available via `staffStationId`

    const [formData, setFormData] = useState({
        user_id: urlUserId || '',
        vehicle_id: urlVehicleId || '',
        station_id: staffStationId || '',
        subscription_id: urlSubscriptionId && urlSubscriptionId !== 'null' && urlSubscriptionId !== 'undefined' ? urlSubscriptionId : '', // Keep ID for API
        subscription_name: _subscriptionName || '', // Add name for display
        battery_taken_id: searchParams.get('batteryId') || '',
        battery_returned_id: urlBatteryReturnedId || '',
    });
    const [reservationDetails, setReservationDetails] = useState(null);
    const [apiErrors, setApiErrors] = useState([]);

    // Transaction history states
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('week');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    // Map backend error responses to friendly UI messages
    const mapServerErrorToMessage = (resp) => {
        // Try to normalize message(s) into an array
        const msgs = [];
        const raw = resp?.message ?? resp?.error ?? null;

        if (Array.isArray(raw)) {
            raw.forEach(r => msgs.push(String(r)));
        } else if (typeof raw === 'string' && raw) {
            msgs.push(raw);
        } else if (resp && typeof resp === 'string') {
            msgs.push(resp);
        }

        // If there's a specific subscription/vehicle mismatch, return the localized friendly message
        const subscriptionMismatch = msgs.find(m => typeof m === 'string' && /Subscription with ID/i.test(m));
        if (subscriptionMismatch) {
            // Try to get VIN for the selected vehicle
            const selectedVehicleId = formData.vehicle_id || urlVehicleId;
            let vin = _vehicleData?.vin || null;
            if (!vin && selectedVehicleId && Array.isArray(userVehicles)) {
                const found = userVehicles.find(v => String(v.vehicle_id) === String(selectedVehicleId));
                vin = found?.vin || found?.plate || null;
            }

            const idOrVin = vin ? String(vin) : `ID ${selectedVehicleId}`;
            return [`Xe (${idOrVin}) của người dùng chưa đăng ký gói đổi pin, vui lòng đăng ký gói`];
        }

        // Fallback: return original messages if any, otherwise a generic message
        if (msgs.length > 0) return msgs;
        return ['Đã xảy ra lỗi, vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.'];
    };

    // Update station_id when user changes (but don't trigger loading)
    useEffect(() => {
        if (staffStationId && formData.station_id !== staffStationId.toString()) {
            setFormData(prev => ({
                ...prev,
                station_id: staffStationId.toString()
            }));
        }
    }, [staffStationId, formData.station_id]);

    // Luồng 2: When staff manually enters user_id, auto-fill vehicle, subscription, returned_battery

    useEffect(() => {
        if (reservationId || !formData.user_id) {
            return;
        }

        const fetchUserData = async () => {
            try {
                const userId = parseInt(formData.user_id);
                const subscription = await getActiveSubscription(userId);

                if (subscription) {
                    // Resolve package name: prefer backend-provided nested package, otherwise look up from packages list
                    let packageName = subscription.package?.package_name || subscription.package?.name
                        || (Array.isArray(packages) && packages.find(p => String(p.package_id) === String(subscription.package_id))?.package_name)
                        || null;

                    // If still not found, try fetching single package by id
                    if (!packageName && subscription.package_id && typeof getPackageById === 'function') {
                        try {
                            const pkg = await getPackageById(subscription.package_id);
                            packageName = pkg?.package_name || pkg?.name || null;
                        } catch (pkgErr) {
                            console.warn('Failed to fetch package by id for subscription:', subscription.package_id, pkgErr);
                        }
                    }

                    setFormData(prev => ({
                        ...prev,
                        subscription_id: subscription.subscription_id.toString(),
                        subscription_name: packageName || 'Chưa đăng ký',
                        vehicle_id: subscription.vehicle_id?.toString() || prev.vehicle_id,
                    }));

                    if (subscription.vehicle_id) {
                        const vehicle = await vehicleService.getVehicleById(subscription.vehicle_id);
                        setFormData(prev => ({ ...prev, battery_returned_id: vehicle.battery_id?.toString() || '' }));
                        setVehicleData(vehicle);
                    }
                } else {
                    console.warn('⚠️ No active subscription found for userId:', userId);
                }

                // Fetch user's vehicles so staff can choose if multiple
                try {
                    const vehiclesResp = await vehicleService.getVehicleByUserId(userId);
                    const vehArr = Array.isArray(vehiclesResp) ? vehiclesResp : (vehiclesResp ? [vehiclesResp] : []);
                    setUserVehicles(vehArr);
                    // If we don't have vehicle_id set yet, default to first vehicle (if exists)
                    if (!formData.vehicle_id && vehArr.length > 0) {
                        setFormData(prev => ({ ...prev, vehicle_id: String(vehArr[0].vehicle_id) }));
                        setVehicleData(vehArr[0]);
                        if (vehArr[0].battery_id) setFormData(prev => ({ ...prev, battery_returned_id: String(vehArr[0].battery_id) }));
                    }
                } catch (vehErr) {
                    // non-fatal: user may have no vehicles
                }
            } catch (error) {
                console.error('❌ Error fetching user data for manual entry:', error);
            }
        };

        fetchUserData();
    }, [formData.user_id, reservationId, getActiveSubscription, packages, getPackageById]);

    // 3. Update trong Luồng 1 useEffect (khi có reservationId)
    useEffect(() => {
        if (!reservationId || !urlVehicleId) {
            return;
        }

        const fetchVehicleData = async () => {
            try {
                const vehicle = await vehicleService.getVehicleById(urlVehicleId);
                setVehicleData(vehicle);
                if (vehicle?.vehicle_id) setFormData(prev => ({ ...prev, vehicle_id: String(vehicle.vehicle_id) }));
                if (vehicle?.battery_id) setFormData(prev => ({ ...prev, battery_returned_id: String(vehicle.battery_id) }));

                if (!urlSubscriptionId && urlUserId) {
                    const subscription = await getActiveSubscription(parseInt(urlUserId));
                    if (subscription) {
                        const packageName = subscription.package?.package_name || subscription.package?.name
                            || (Array.isArray(packages) && packages.find(p => String(p.package_id) === String(subscription.package_id))?.package_name)
                            || 'Chưa đăng ký';
                        setFormData(prev => ({ ...prev, subscription_id: subscription.subscription_id.toString(), subscription_name: packageName }));
                    }
                }
            } catch (error) {
                // keep minimal error handling; loading flag reset below
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleData();
    }, [reservationId, urlVehicleId, urlSubscriptionId, urlUserId, getActiveSubscription, packages, getPackageById]);

    // When vehicle_id changes (manual selection), fetch its details so we can set battery_returned_id and vehicleData
    useEffect(() => {
        if (!formData.vehicle_id) return;
        // avoid refetch during reservation flow where we already fetched
        if (reservationId && urlVehicleId) return;

        const fetchVehicle = async () => {
            try {
                const vid = parseInt(formData.vehicle_id);
                if (isNaN(vid)) return;
                const vehicle = await vehicleService.getVehicleById(vid);
                setVehicleData(vehicle);
                if (vehicle?.battery_id) {
                    setFormData(prev => ({ ...prev, battery_returned_id: String(vehicle.battery_id) }));
                }
                // Also determine subscription/package for the selected vehicle
                try {
                    const userId = parseInt(formData.user_id || urlUserId || user?.id);
                    if (!isNaN(userId)) {
                        const subscription = await getActiveSubscription(userId);
                        if (subscription && Number(subscription.vehicle_id) === Number(vid)) {
                            // Resolve package name from subscription or packages list
                            let packageName = subscription.package?.package_name || subscription.package?.name
                                || (Array.isArray(packages) && packages.find(p => String(p.package_id) === String(subscription.package_id))?.package_name)
                                || null;

                            if (!packageName && subscription.package_id && typeof getPackageById === 'function') {
                                try {
                                    const pkg = await getPackageById(subscription.package_id);
                                    packageName = pkg?.package_name || pkg?.name || null;
                                } catch (pkgErr) {
                                    /* ignore */
                                }
                            }

                            setFormData(prev => ({
                                ...prev,
                                subscription_id: subscription.subscription_id?.toString() || '',
                                subscription_name: packageName || 'Chưa đăng ký'
                            }));
                        } else {
                            // Selected vehicle has no subscription (or subscription belongs to another vehicle)
                            setFormData(prev => ({ ...prev, subscription_id: '', subscription_name: 'Chưa đăng ký' }));
                        }
                    }
                } catch (subErr) {
                    // non-fatal: keep previous subscription_name if any
                }
            } catch (err) {
                console.warn('Failed to fetch vehicle on vehicle_id change:', err);
            }
        };

        fetchVehicle();
    }, [formData.vehicle_id, reservationId, urlVehicleId]);

    // If we have a reservationId (Luồng 1), fetch reservation details and prefill battery_taken_id
    useEffect(() => {
        if (!reservationId) return;

        // Prefill battery_taken_id from URL if available (Luồng 1)
        const batteryIdFromUrl = searchParams.get('batteryId');
        if (batteryIdFromUrl) {
            setFormData(prev => ({
                ...prev,
                battery_taken_id: batteryIdFromUrl
            }));
        }

        // Optionally still fetch reservation for other info
        const fetchReservation = async () => {
            try {
                let res = await reservationService.getReservationById(parseInt(reservationId));
                // ...existing code...
                setReservationDetails(res);

                // If reservation includes vehicle_id, ensure formData has it for backend validation
                if (res && res.vehicle_id) {
                    setFormData(prev => ({
                        ...prev,
                        vehicle_id: String(res.vehicle_id),
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch reservation details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReservation();
    }, [reservationId, searchParams]);

    // Fetch all transactions for staff's station
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!staffStationId) return;

            setTransactionsLoading(true);
            try {
                const data = await swapService.getSwapTransactionsByStation(staffStationId);
                setTransactions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setTransactions([]);
            } finally {
                setTransactionsLoading(false);
            }
        };

        fetchTransactions();
    }, [staffStationId]);

    // Filter transactions based on time, status, and search
    useEffect(() => {
        let filtered = [...transactions];

        // Time filter
        const now = new Date();
        filtered = filtered.filter(transaction => {
            const transactionDate = new Date(transaction.createAt || transaction.created_at);

            switch (timeFilter) {
                case 'day': {
                    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    return transactionDate >= oneDayAgo;
                }
                case 'week': {
                    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return transactionDate >= oneWeekAgo;
                }
                case 'month': {
                    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    return transactionDate >= oneMonthAgo;
                }
                case 'year': {
                    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    return transactionDate >= oneYearAgo;
                }
                default:
                    return true;
            }
        });

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(transaction => transaction.status === statusFilter);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(transaction => {
                const transactionId = String(transaction.transaction_id).toLowerCase();
                const userId = String(transaction.user_id).toLowerCase();
                const userName = (transaction.user?.full_name || transaction.user?.username || '').toLowerCase();
                const batteryOut = String(transaction.battery_returned_id || '').toLowerCase();
                const batteryIn = String(transaction.battery_taken_id || '').toLowerCase();

                return transactionId.includes(query) ||
                    userId.includes(query) ||
                    userName.includes(query) ||
                    batteryOut.includes(query) ||
                    batteryIn.includes(query);
            });
        }

        setFilteredTransactions(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [transactions, timeFilter, statusFilter, searchQuery]);

    // Get paginated transactions
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );
    const totalPages = Math.ceil(filteredTransactions.length / resultsPerPage);

    // Filter batteries: only show batteries that are 'full' and at staff's station
    const availableBatteries = batteries.filter(b => {
        if (!b || b.status !== 'full' || !staffStationId || b.station_id !== staffStationId) return false;
        if (_vehicleData?.battery_model || _vehicleData?.battery_type) {
            return b.model === _vehicleData.battery_model && b.type === _vehicleData.battery_type;
        }
        return true;
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['vehicle_id', 'user_id', 'battery_taken_id'].includes(name)) setApiErrors([]);
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // For both flows we now call the backend swapping endpoint which accepts only {user_id, station_id}
        try {
            // clear previous API errors
            setApiErrors([]);

            const userIdPayload = parseInt(formData.user_id) || parseInt(urlUserId) || user?.id;
            const stationIdPayload = parseInt(formData.station_id) || staffStationId;

            if (isNaN(userIdPayload) || isNaN(stationIdPayload)) {
                setApiErrors(['user_id and station_id are required']);
                return;
            }

            const swapPayload = { user_id: Number(userIdPayload), station_id: Number(stationIdPayload) };

            // If staff explicitly selected a vehicle (manual flow), use the direct create endpoint
            // so the chosen vehicle is used. Otherwise use automatic swap which resolves vehicle server-side.
            console.log('Determining swap method. reservationId:', reservationId, 'vehicle selected:', formData.vehicle_id);

            let created = false;
            let createdResp = null;

            if (!reservationId && formData.vehicle_id) {
                // Manual flow with staff-selected vehicle: build full payload for createSwapTransaction
                const swapData = {
                    user_id: Number(formData.user_id) || Number(urlUserId) || Number(user?.id),
                    vehicle_id: Number(formData.vehicle_id),
                    station_id: Number(formData.station_id) || Number(staffStationId),
                    subscription_id: formData.subscription_id ? Number(formData.subscription_id) : undefined,
                    battery_taken_id: formData.battery_taken_id ? Number(formData.battery_taken_id) : undefined,
                    battery_returned_id: formData.battery_returned_id ? Number(formData.battery_returned_id) : undefined,
                    status: 'completed',
                };

                console.log('Creating swap transaction via direct create endpoint with payload:', swapData);

                try {
                    const resp = await createSwapTransaction(swapData);
                    console.log('Swap transaction created via createSwapTransaction:', resp);
                    created = true;
                    createdResp = resp;
                } catch (createErr) {
                    console.error('Swap creation failed (createSwapTransaction):', createErr);
                    const resp = createErr?.response?.data;
                    setApiErrors(mapServerErrorToMessage(resp));
                    throw createErr;
                }
            } else {
                // Reservation flow or no vehicle selected: call automatic swap endpoint
                console.log('Creating swap transaction via automatic swap with payload:', swapPayload);
                try {
                    const resp = await swapBatteries(swapPayload);
                    console.log('Swap transaction created via swapping endpoint:', resp);
                    created = true;
                    createdResp = resp;

                    if (reservationId) {
                        try {
                            const resId = parseInt(reservationId);
                            const userIdForUpdate = parseInt(urlUserId || formData.user_id || user?.id);
                            if (!isNaN(resId) && !isNaN(userIdForUpdate)) {
                                console.log(`Updating reservation ${resId} status -> completed (user ${userIdForUpdate})`);
                                await updateReservationStatus(resId, userIdForUpdate, 'completed');
                            }
                        } catch (resUpdateErr) {
                            console.warn('Failed to update reservation status after creating swap:', resUpdateErr);
                            setApiErrors(prev => [...prev, 'Swap created but failed to update reservation status. Please refresh the requests list.']);
                        }
                    }
                } catch (createErr) {
                    console.error('Swap creation failed (swapping endpoint):', createErr);
                    const resp = createErr?.response?.data;
                    setApiErrors(mapServerErrorToMessage(resp));
                    throw createErr;
                }
            }

            // If swap was created (initial or retry) and this was a reservation flow, update reservation status now
            if (created && reservationId) {
                try {
                    const resId = parseInt(reservationId);
                    const userIdForUpdate = parseInt(urlUserId || formData.user_id || user?.id);
                    if (!isNaN(resId) && !isNaN(userIdForUpdate)) {
                        await updateReservationStatus(resId, userIdForUpdate, 'completed');
                    }
                } catch (resUpdateErr) {
                    console.warn('Failed to update reservation status after creating swap (post-retry):', resUpdateErr);
                    setApiErrors(prev => [...prev, 'Swap created but failed to update reservation status. Please refresh the requests list.']);
                }
            }

            // Backend now handles reservation/battery/vehicle updates and ensures 'battery must be full' logic.
            // Frontend only needs to refresh local data (batteries) and navigate back.
            try {
                // refresh battery list from BatteryContext
                if (typeof getAllBatteries === 'function') {
                    await getAllBatteries();
                }
            } catch (refreshErr) {
                console.warn('Failed to refresh batteries after creating swap:', refreshErr);
            }

            alert('Swap transaction completed successfully!');
            navigate('/staff/swap-requests'); // Navigate back to swap requests
        } catch (error) {
            console.error('Error creating swap transaction:', error);
            console.error('Error response:', error.response);
            console.error('Error response data:', error.response?.data);
            console.error('Error response message:', error.response?.data?.message);

            // Map server response to friendly messages
            setApiErrors(mapServerErrorToMessage(error.response?.data));

            console.error('Final error message(s):', apiErrors.length ? apiErrors : error.message);
        }
    };

    const handleCancel = () => {
        // If modal is open, close it. Otherwise navigate back to staff home.
        if (showModal) {
            setShowModal(false);
            return;
        }
        navigate('/staff');
    };

    // Auto-open modal only when navigation sets the open flag (from "Process Request").
    // We prefer navigation state (location.state.openSwapModal) so the modal does NOT open on page reloads
    // even if reservationId is present in the URL.
    const location = useLocation();
    const openedFromRequest = Boolean(location?.state?.openSwapModal);

    const [showModal, setShowModal] = useState(openedFromRequest);

    // If opened from a navigation that set state, clear that history state so refreshing the page
    // won't leave the flag set and re-open the modal.
    useEffect(() => {
        if (!openedFromRequest) return;

        try {
            // replace current history entry with same URL but no state
            navigate(location.pathname + location.search, { replace: true, state: null });
        } catch (err) {
            // non-fatal; navigation replace may fail in some test environments
            console.warn('Failed to clear navigation state after opening modal:', err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading vehicle data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex min-w-72 flex-col gap-2">
                    <p className="text-gray-900 dark:text-gray-50 text-3xl font-black leading-tight tracking-tight">
                        Transaction History - {user?.station?.station_name || 'Station'}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                        View and manage all battery swap transactions for this station.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 shadow-sm hover:bg-blue-700"
                >
                    <span className="material-icons text-base">add</span>
                    <span className="truncate">Create Manual Swap</span>
                </button>
            </div>

            {/* Filters Bar */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                {/* Time Filter */}
                <TransactionTimeFilter value={timeFilter} onChange={setTimeFilter} />

                {/* Toolbar - Search and Status Filter */}
                <div className="flex gap-2 items-center w-full md:w-auto">
                    <TransactionSearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search transactions..."
                    />
                    <TransactionStatusFilter value={statusFilter} onChange={setStatusFilter} />
                </div>
            </div>

            {/* Transaction Table */}
            <div className="mt-6">
                <TransactionTable
                    transactions={paginatedTransactions}
                    loading={transactionsLoading}
                    onViewDetails={(transaction) => {
                        console.log('View details for transaction:', transaction);
                        // TODO: Implement view details modal or navigation
                    }}
                />

                {/* Pagination */}
                {!transactionsLoading && filteredTransactions.length > 0 && (
                    <TransactionPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalResults={filteredTransactions.length}
                        resultsPerPage={resultsPerPage}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            {/* Modal popup for Create New Swap Transaction */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
                    <div className="relative w-[920px] max-w-[calc(100%-2rem)] max-h-[90vh] overflow-auto mx-4 bg-white p-8 rounded-lg shadow-md z-10">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Create New Swap Transaction</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* User ID */}
                                <div className="min-w-0">
                                    <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="user_id">
                                        User ID
                                    </label>
                                    <div className="relative">
                                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">person</span>
                                        <input
                                            type="text"
                                            id="user_id"
                                            name="user_id"
                                            value={formData.user_id}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-green-500 focus:border-green-500"
                                            readOnly={!!reservationId}
                                            placeholder={!reservationId ? "Enter User ID..." : ""}
                                        />
                                    </div>
                                    {!reservationId && (
                                        <p className="text-xs text-blue-600 mt-1">
                                            Enter user ID to auto-fill vehicle & subscription
                                        </p>
                                    )}
                                </div>

                                {/* Vehicle ID */}
                                <div className="min-w-0">
                                    <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="vehicle_id">
                                        Vehicle ID
                                    </label>
                                    <div className="relative">
                                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">electric_scooter</span>
                                        {reservationId ? (
                                            <input
                                                type="text"
                                                id="vehicle_id"
                                                name="vehicle_id"
                                                value={formData.vehicle_id}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-green-500 focus:border-green-500"
                                                readOnly
                                            />
                                        ) : (
                                            <select
                                                id="vehicle_id"
                                                name="vehicle_id"
                                                value={formData.vehicle_id}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-green-500 focus:border-green-500"
                                            >
                                                <option value="">Select vehicle...</option>
                                                {userVehicles && userVehicles.length > 0 ? (
                                                    userVehicles.map(v => (
                                                        <option key={v.vehicle_id} value={v.vehicle_id}>
                                                            {`VEH${String(v.vehicle_id).padStart(3, '0')} ${v.vin ? `- ${v.vin}` : v.plate ? `- ${v.plate}` : ''}`}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="">No vehicles found for this user</option>
                                                )}
                                            </select>
                                        )}
                                    </div>
                                </div>

                                {/* Station ID */}
                                <div className="min-w-0">
                                    <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="station_id">
                                        Station ID
                                    </label>
                                    <div className="relative">
                                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">ev_station</span>
                                        <input
                                            type="text"
                                            id="station_id"
                                            name="station_id"
                                            value={formData.station_id}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-green-500 focus:border-green-500"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Subscription name */}
                                <div className="min-w-0">
                                    <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="subscription_name">
                                        Package Name
                                    </label>
                                    <div className="relative">
                                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">card_membership</span>
                                        <input
                                            type="text"
                                            id="subscription_name"
                                            name="subscription_name"
                                            value={formData.subscription_name || 'Chưa đăng ký'}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-4 py-2 border rounded-md ${formData.subscription_name && formData.subscription_name !== 'Chưa đăng ký'
                                                ? 'bg-gray-50 border-gray-300 text-gray-900'
                                                : 'bg-red-50 border-red-300 text-red-600'
                                                } focus:ring-green-500 focus:border-green-500`}
                                            placeholder="Subscription Name"
                                            readOnly
                                        />
                                    </div>
                                    {(!formData.subscription_name || formData.subscription_name === 'Chưa đăng ký') && (
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                            <span className="material-icons text-sm">warning</span>
                                            User must have an active subscription
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2 border-t border-gray-300 my-2"></div>

                                {/* Battery Taken ID */}
                                <div className="min-w-0">
                                    <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="battery_taken_id">
                                        Battery Taken ID
                                    </label>
                                    <div className="relative">
                                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-green-500 text-xl">battery_charging_full</span>

                                        {/* Debug: Log current state */}
                                        {console.log('🔍 Render Debug - reservationDetails:', reservationDetails)}
                                        {console.log('🔍 Render Debug - reservationDetails.battery_id:', reservationDetails?.battery_id)}
                                        {console.log('🔍 Render Debug - formData.battery_taken_id:', formData.battery_taken_id)}
                                        {console.log('🔍 Render Debug - Should show input?:', !!(reservationDetails && reservationDetails.battery_id))}

                                        {reservationId && formData.battery_taken_id ? (
                                            <input
                                                type="text"
                                                id="battery_taken_id"
                                                name="battery_taken_id"
                                                value={formData.battery_taken_id}
                                                readOnly
                                                className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900"
                                            />
                                        ) : (
                                            <select
                                                id="battery_taken_id"
                                                name="battery_taken_id"
                                                value={formData.battery_taken_id}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-green-500 focus:border-green-500"
                                                required
                                            >
                                                <option value="">Select a full battery...</option>
                                                {availableBatteries.map(battery => (
                                                    <option key={battery.battery_id} value={battery.battery_id}>
                                                        BAT{String(battery.battery_id).padStart(3, '0')} - {battery.model} ({battery.current_charge || battery.capacity}kWh)
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                    <p className="text-xs text-green-600 mt-1">
                                        {availableBatteries.length} full batteries available
                                    </p>
                                </div>

                                {/* Battery Returned ID */}
                                <div className="min-w-0">
                                    <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="battery_returned_id">
                                        Battery Returned ID
                                    </label>
                                    <div className="relative">
                                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-red-500 text-xl">battery_alert</span>
                                        <input
                                            type="text"
                                            id="battery_returned_id"
                                            name="battery_returned_id"
                                            value={formData.battery_returned_id}
                                            className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Auto-filled from vehicle"
                                            readOnly
                                        />
                                    </div>
                                    <p className="text-xs text-orange-600 mt-1">
                                        Battery returned by driver (to be charged)
                                    </p>
                                </div>
                            </div>

                            {/* API validation errors from backend */}
                            {apiErrors && apiErrors.length > 0 && (
                                <div className="md:col-span-2 mt-4 p-3 bg-red-50 border border-red-200 rounded">
                                    <p className="font-semibold text-red-700 mb-2">Server validation errors:</p>
                                    <ul className="list-disc ml-5 text-sm text-red-600">
                                        {apiErrors.map((err, idx) => (
                                            <li key={idx}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <div className="flex items-center gap-4">
                                    {!reservationId && availableBatteries.length === 0 && (
                                        <p className="text-sm text-red-600 mr-2">No compatible full batteries available at this station for the selected vehicle.</p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={!formData.user_id || !formData.station_id || (!reservationId && availableBatteries.length === 0)}
                                        className={`px-6 py-2 rounded-md font-semibold transition-colors flex items-center gap-2 ${formData.user_id && formData.station_id && (reservationId || availableBatteries.length > 0)
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}>
                                        <span className="material-icons">add_circle_outline</span>
                                        Create Transaction
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
