import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useBattery, useAuth, useSubscription, usePackage, useSwap, useReservation } from '../../hooks/useContext';
import { vehicleService } from '../../services/vehicleService';
import { reservationService } from '../../services/reservationService';

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

    // Debug user data
    console.log('🔍 Debug User Object:', {
        full_user: user,
        station_id: user?.station_id,
        role: user?.role,
        id: user?.id,
        name: user?.name
    });
    console.log('📍 Staff station_id resolved:', staffStationId);

    // Debug: Log URL params
    console.log('URL Params:', {
        reservationId,
        urlUserId,
        urlVehicleId,
        staffStationId,
        urlBatteryReturnedId,
        urlSubscriptionId,
    });

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
                console.log('🔍 Luồng 2: Fetching user data for userId:', userId);

                const subscription = await getActiveSubscription(userId);
                console.log('🔍 getActiveSubscription response:', subscription);

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
                        subscription_name: packageName || 'N/A',
                        vehicle_id: subscription.vehicle_id?.toString() || prev.vehicle_id,
                    }));

                    if (subscription.vehicle_id) {
                        const vehicle = await vehicleService.getVehicleById(subscription.vehicle_id);
                        setFormData(prev => ({
                            ...prev,
                            battery_returned_id: vehicle.battery_id?.toString() || '',
                        }));
                        setVehicleData(vehicle);
                    }
                } else {
                    console.warn('⚠️ No active subscription found for userId:', userId);
                }

                // Also fetch all vehicles belonging to this user so staff can choose if multiple
                try {
                    const vehiclesResp = await vehicleService.getVehicleByUserId(userId);
                    const vehArr = Array.isArray(vehiclesResp) ? vehiclesResp : (vehiclesResp ? [vehiclesResp] : []);
                    setUserVehicles(vehArr);
                    // If we don't have vehicle_id set yet, default to first vehicle (if exists)
                    if (!formData.vehicle_id && vehArr.length > 0) {
                        setFormData(prev => ({ ...prev, vehicle_id: String(vehArr[0].vehicle_id) }));
                        setVehicleData(vehArr[0]);
                        if (vehArr[0].battery_id) {
                            setFormData(prev => ({ ...prev, battery_returned_id: String(vehArr[0].battery_id) }));
                        }
                    }
                } catch (vehErr) {
                    console.warn('Failed to fetch vehicles for user:', vehErr);
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

                // Ensure vehicle_id is present in formData for backend validation
                if (vehicle && vehicle.vehicle_id) {
                    setFormData(prev => ({
                        ...prev,
                        vehicle_id: String(vehicle.vehicle_id)
                    }));
                }

                if (vehicle.battery_id) {
                    setFormData(prev => ({
                        ...prev,
                        battery_returned_id: vehicle.battery_id.toString()
                    }));
                }

                if (!urlSubscriptionId && urlUserId) {
                    console.log('🔍 Luồng 1: subscription_id missing from URL, fetching for userId:', urlUserId);
                    const subscription = await getActiveSubscription(parseInt(urlUserId));
                    console.log('🔍 Luồng 1: getActiveSubscription response:', subscription);

                    if (subscription) {
                        const packageName = subscription.package?.package_name || subscription.package?.name
                            || (Array.isArray(packages) && packages.find(p => String(p.package_id) === String(subscription.package_id))?.package_name)
                            || 'N/A';

                        setFormData(prev => ({
                            ...prev,
                            subscription_id: subscription.subscription_id.toString(),
                            subscription_name: packageName,
                        }));
                        console.log('✅ Luồng 1: Updated subscription_id to:', subscription.subscription_id);
                    }
                }

            } catch (error) {
                console.error('Error fetching vehicle data:', error);
                alert('Failed to fetch vehicle data');
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

    // Filter batteries: only show batteries that are 'full' and at staff's station
    const availableBatteries = batteries.filter(b => {
        if (!b || b.status !== 'full' || !staffStationId || b.station_id !== staffStationId) return false;
        // If we have vehicle data, ensure battery model/type match vehicle's required model/type
        if (_vehicleData && (_vehicleData.battery_model || _vehicleData.battery_type)) {
            return b.model === _vehicleData.battery_model && b.type === _vehicleData.battery_type;
        }
        return true;
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Clear server-side API errors when the staff changes critical fields
        if (name === 'vehicle_id' || name === 'user_id' || name === 'battery_taken_id') {
            setApiErrors([]);
        }

        setFormData({
            ...formData,
            [name]: value
        });
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
            <div class="flex flex-wrap justify-between gap-4 mb-6">
                <div class="flex min-w-72 flex-col gap-3">
                    <p class="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Lịch sử giao dịch</p>
                    <p class="text-gray-500 dark:text-[#9ba0bb] text-base font-normal leading-normal">Xem và quản lý tất cả các giao dịch đổi pin đã hoàn thành tại trạm hiện tại.</p>
                </div>

                <button onClick={() => setShowModal(true)} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#272a3a] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                    <span className="truncate">Create New Swap</span>
                </button>
            </div>

            <div class="flex flex-wrap md:flex-nowrap items-center gap-3 mb-4">
                {/* <!-- Ô tìm kiếm --> */}
                <div class="flex-1 min-w-[250px]">
                    <label class="flex flex-col h-12 w-full">
                        <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
                            <div class="text-gray-500 flex border-none bg-gray-100 dark:bg-[#272a3a] items-center justify-center pl-4 rounded-l-lg border-r-0">
                                <i class="ri-search-line text-lg"></i>
                            </div>
                            <input
                                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-gray-100 dark:bg-[#272a3a] h-full placeholder:text-gray-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                                placeholder="Tìm kiếm một giao dịch cụ thể"
                                value=""
                            />
                        </div>
                    </label>
                </div>

                {/* <!-- Bộ nút lọc --> */}
                <div class="flex gap-2 shrink-0">
                    <button class="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-[#272a3a] px-4">
                        <i class="ri-calendar-line text-gray-600 dark:text-white text-lg"></i>
                        <p class="text-gray-800 dark:text-white text-sm font-medium leading-normal">Ngày</p>
                        <i class="ri-arrow-down-s-line text-gray-600 dark:text-white text-lg"></i>
                    </button>

                    <button class="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-[#272a3a] px-4">
                        <i class="ri-battery-2-charge-line text-gray-600 dark:text-white text-lg"></i>
                        <p class="text-gray-800 dark:text-white text-sm font-medium leading-normal">Model pin</p>
                        <i class="ri-arrow-down-s-line text-gray-600 dark:text-white text-lg"></i>
                    </button>

                    <button class="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-[#272a3a] px-4">
                        <i class="ri-checkbox-circle-line text-gray-600 dark:text-white text-lg"></i>
                        <p class="text-gray-800 dark:text-white text-sm font-medium leading-normal">Trạng thái</p>
                        <i class="ri-arrow-down-s-line text-gray-600 dark:text-white text-lg"></i>
                    </button>
                </div>
            </div>



            {/* Modal popup for Create New Swap Transaction */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
                    <div className="relative max-w-4xl w-full mx-4 bg-white p-8 rounded-lg shadow-md z-10">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Create New Swap Transaction</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* User ID */}
                                <div>
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
                                <div>
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
                                <div>
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="subscription_name">
                                        Package Name
                                    </label>
                                    <div className="relative">
                                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">card_membership</span>
                                        <input
                                            type="text"
                                            id="subscription_name"
                                            name="subscription_name"
                                            value={formData.subscription_name || 'N/A'}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-4 py-2 border rounded-md ${formData.subscription_name && formData.subscription_name !== 'N/A'
                                                ? 'bg-gray-50 border-gray-300 text-gray-900'
                                                : 'bg-red-50 border-red-300 text-red-600'
                                                } focus:ring-green-500 focus:border-green-500`}
                                            placeholder="Subscription Name"
                                            readOnly
                                        />
                                    </div>
                                    {(!formData.subscription_name || formData.subscription_name === 'N/A') && (
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                            <span className="material-icons text-sm">warning</span>
                                            User must have an active subscription
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2 border-t border-gray-300 my-2"></div>

                                {/* Battery Taken ID */}
                                <div>
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
                                <div>
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
