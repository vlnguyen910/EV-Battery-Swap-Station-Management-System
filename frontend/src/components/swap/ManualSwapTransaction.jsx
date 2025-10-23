import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBattery, useAuth, useSubscription } from '../../hooks/useContext';
import { swapService } from '../../services/swapService';
import { vehicleService } from '../../services/vehicleService';
import { batteryService } from '../../services/batteryService';
import { reservationService } from '../../services/reservationService';

export default function ManualSwapTransaction() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { batteries, refreshBatteries } = useBattery();
    const { user } = useAuth(); // Get logged-in staff info
    const { getActiveSubscription } = useSubscription();
    // Start as true if Luồng 1 (reservationId exists), false nếu Luồng 2
    const [loading, setLoading] = useState(!!searchParams.get('reservationId'));
    const [_vehicleData, setVehicleData] = useState(null);

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
        user_id: urlUserId || '', // If Luồng 1, pre-filled; if Luồng 2, staff types
        vehicle_id: urlVehicleId || '',
        station_id: staffStationId || '', // Always set from staff login
        subscription_id: urlSubscriptionId && urlSubscriptionId !== 'null' && urlSubscriptionId !== 'undefined' ? urlSubscriptionId : '',
        // Prefill battery_taken_id from URL if available (Luồng 1)
        battery_taken_id: searchParams.get('batteryId') || '',
        battery_returned_id: urlBatteryReturnedId || '',
    });
    const [reservationDetails, setReservationDetails] = useState(null);

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
        // Only auto-fill if we DON'T have a reservationId (Luồng 2) AND user_id is filled
        if (reservationId || !formData.user_id) {
            return; // Don't set loading here - let Luồng 1 handle it
        }

        const fetchUserData = async () => {
            try {
                // No setLoading(true) here to avoid page reload effect
                const userId = parseInt(formData.user_id);
                console.log('🔍 Luồng 2: Fetching user data for userId:', userId);

                // Get active subscription for user
                const subscription = await getActiveSubscription(userId);
                console.log('🔍 getActiveSubscription response:', subscription);

                if (subscription) {
                    setFormData(prev => ({
                        ...prev,
                        subscription_id: subscription.subscription_id.toString(),
                        vehicle_id: subscription.vehicle_id?.toString() || prev.vehicle_id,
                    }));

                    // Get vehicle to fetch battery_returned_id
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
            } catch (error) {
                console.error('❌ Error fetching user data for manual entry:', error);
            }
            // No setLoading(false) here since we didn't set loading to true
        };

        fetchUserData();
    }, [formData.user_id, reservationId, getActiveSubscription]);    // Luồng 1: Fetch vehicle data from URL params AND subscription if missing
    useEffect(() => {
        if (!reservationId || !urlVehicleId) {
            return; // Luồng 2 - no initial loading needed
        }

        const fetchVehicleData = async () => {
            try {
                const vehicle = await vehicleService.getVehicleById(urlVehicleId);
                setVehicleData(vehicle);

                // Auto-fill battery_returned_id with vehicle's current battery
                if (vehicle.battery_id) {
                    setFormData(prev => ({
                        ...prev,
                        battery_returned_id: vehicle.battery_id.toString()
                    }));
                }

                // If subscription_id is missing from URL, fetch it manually
                if (!urlSubscriptionId && urlUserId) {
                    console.log('🔍 Luồng 1: subscription_id missing from URL, fetching for userId:', urlUserId);
                    const subscription = await getActiveSubscription(parseInt(urlUserId));
                    console.log('🔍 Luồng 1: getActiveSubscription response:', subscription);

                    if (subscription) {
                        setFormData(prev => ({
                            ...prev,
                            subscription_id: subscription.subscription_id.toString(),
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
    }, [reservationId, urlVehicleId, urlSubscriptionId, urlUserId, getActiveSubscription]);

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
            } catch (err) {
                console.error('Failed to fetch reservation details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReservation();
    }, [reservationId]);

    // Filter batteries: only show batteries that are 'full' and at staff's station
    const availableBatteries = batteries.filter(
        b => b.status === 'full' && staffStationId && b.station_id === staffStationId
    );

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate subscription_id
        if (!formData.subscription_id || formData.subscription_id === 'undefined') {
            alert('Subscription ID is required. User must have an active subscription.');
            return;
        }

        try {
            // Prepare swap transaction data for API
            const takenBatteryId = reservationDetails?.battery_id ? parseInt(reservationDetails.battery_id) : parseInt(formData.battery_taken_id);

            const swapData = {
                user_id: parseInt(formData.user_id),
                vehicle_id: parseInt(formData.vehicle_id),
                station_id: parseInt(formData.station_id),
                battery_taken_id: takenBatteryId,
                battery_returned_id: formData.battery_returned_id ? parseInt(formData.battery_returned_id) : null,
                subscription_id: parseInt(formData.subscription_id),
                // Attach reservation reference so backend can validate and consume it atomically when possible
                reservation_id: reservationId ? parseInt(reservationId) : null,
                status: 'completed',
            };

            console.log('Creating swap transaction:', swapData);
            console.log('Request payload (stringified):', JSON.stringify(swapData, null, 2));

            // If this is Luồng 1 and the reserved battery is not currently 'full', require staff confirmation
            // to force process. This avoids silently turning multiple 'booked' batteries into 'full' which
            // would allow overbooking when many reservations contend for limited full batteries.
            let originalTakenBatteryStatus = null;
            const reservedId = reservationDetails?.battery_id || formData.battery_taken_id;
            if (reservationDetails && reservedId) {
                try {
                    let reservedBattery = batteries.find(b => String(b.battery_id) === String(reservedId));
                    if (!reservedBattery) {
                        reservedBattery = await batteryService.getBatteryById(reservedId);
                        if (reservedBattery && reservedBattery.data) reservedBattery = reservedBattery.data;
                    }

                    originalTakenBatteryStatus = reservedBattery?.status;
                    console.log('Reserved battery current status:', originalTakenBatteryStatus, 'for battery', reservedId);

                    if (originalTakenBatteryStatus !== 'full') {
                        const confirmMsg = `Battery ${reservedId} is currently '${originalTakenBatteryStatus}'.\n` +
                            `Proceeding will temporarily mark it 'full' to complete this swap.\n` +
                            `Only confirm if you verified the physical battery is available.\n\nDo you want to proceed?`;

                        const force = window.confirm(confirmMsg);
                        if (!force) {
                            alert('Swap cancelled. Choose a different full battery or resolve the reservation first.');
                            return; // abort submit
                        }

                        try {
                            console.log('Staff confirmed force processing reserved battery', reservedId);
                            await batteryService.updateBatteryById(reservedId, { status: 'full' });
                        } catch (prepErr) {
                            console.error('Failed to prepare reserved battery for swap after confirmation:', prepErr);
                            throw new Error('Failed to prepare reserved battery for swap');
                        }
                    }
                } catch (err) {
                    console.error('Error checking reserved battery status:', err);
                    throw err;
                }
            }

            // Call real API to create swap transaction
            let transaction;
            try {
                transaction = await swapService.createSwapTransaction(swapData);
                console.log('Swap transaction created via API:', transaction);
            } catch (createErr) {
                console.error('Swap creation failed:', createErr);
                // revert reserved battery status if we changed it
                if (originalTakenBatteryStatus === 'booked' && reservedId) {
                    try {
                        await batteryService.updateBatteryById(reservedId, { status: 'booked' });
                        console.log('Reverted reserved battery', reservedId, 'to booked after failed transaction');
                    } catch (revertErr) {
                        console.error('Failed to revert reserved battery status after failed transaction:', revertErr);
                    }
                }
                throw createErr;
            }

            // Immediately mark reservation as completed (swap attempt has been made)
            // Only update reservation if this is Luồng 1 (reservationId exists)
            if (reservationId) {
                try {
                    await reservationService.updateReservationStatus(
                        parseInt(reservationId),
                        parseInt(formData.user_id),
                        'completed'
                    );
                    console.log(`Reservation ${reservationId} status updated to 'completed'`);
                } catch (resErr) {
                    console.error('Failed to update reservation status after creating transaction:', resErr);
                    // don't block further processing
                }
            }

            // Continue with battery and vehicle updates; failures here do not affect reservation status
            try {
                // Update returned battery: set status to 'charging', station_id to current station, and clear vehicle_id
                if (formData.battery_returned_id) {
                    await batteryService.updateBatteryById(formData.battery_returned_id, {
                        status: 'charging',
                        station_id: parseInt(formData.station_id),
                        vehicle_id: null
                    });
                    console.log(`Battery ${formData.battery_returned_id} updated: status=charging, station_id=${formData.station_id}, vehicle_id=null`);
                }

                // Update taken battery: set status to 'in_use' and set vehicle_id to the vehicle
                await batteryService.updateBatteryById(formData.battery_taken_id, {
                    status: 'in_use',
                    station_id: null,
                    vehicle_id: parseInt(formData.vehicle_id)
                });
                console.log(`Battery ${formData.battery_taken_id} updated: status=in_use, vehicle_id=${formData.vehicle_id}`);

                // Update vehicle's current battery_id to the new battery
                await vehicleService.updateVehicle(formData.vehicle_id, {
                    battery_id: parseInt(formData.battery_taken_id)
                });
                console.log(`Vehicle ${formData.vehicle_id} battery updated to ${formData.battery_taken_id}`);
            } catch (postErr) {
                console.error('Post-transaction update failed (batteries/vehicle):', postErr);
                // We already marked reservation completed; surface errors to staff but do not rollback reservation
            }

            // Refresh battery list
            await refreshBatteries();

            alert('Swap transaction completed successfully!');
            navigate('/staff/swap-requests'); // Navigate back to swap requests
        } catch (error) {
            console.error('Error creating swap transaction:', error);
            console.error('Error response:', error.response);
            console.error('Error response data:', error.response?.data);
            console.error('Error response message:', error.response?.data?.message);

            let errorMessage = 'Failed to create swap transaction';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }

            console.error('Final error message:', errorMessage);
            alert(errorMessage);
        }
    };

    const handleCancel = () => {
        navigate('/staff');
    };

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
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Swap Transaction</h1>
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
                                <input
                                    type="text"
                                    id="vehicle_id"
                                    name="vehicle_id"
                                    value={formData.vehicle_id}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-green-500 focus:border-green-500"
                                    readOnly
                                />
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

                        {/* Subscription ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="subscription_id">
                                Subscription ID
                            </label>
                            <div className="relative">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">card_membership</span>
                                <input
                                    type="text"
                                    id="subscription_id"
                                    name="subscription_id"
                                    value={formData.subscription_id || 'N/A'}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-2 border rounded-md ${formData.subscription_id
                                        ? 'bg-gray-50 border-gray-300 text-gray-900'
                                        : 'bg-red-50 border-red-300 text-red-600'
                                        } focus:ring-green-500 focus:border-green-500`}
                                    placeholder="Enter Subscription ID (Optional)"
                                    readOnly
                                />
                            </div>
                            {!formData.subscription_id && (
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

                                {/* Always bind to formData.battery_taken_id so prefill from reservation shows up reliably.
                                    If we have reservationId and battery_taken_id is prefilled, show readonly input.
                                    Otherwise show dropdown for manual selection. */}
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

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!formData.subscription_id}
                            className={`px-6 py-2 rounded-md font-semibold transition-colors flex items-center gap-2 ${formData.subscription_id
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <span className="material-icons">add_circle_outline</span>
                            Create Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
