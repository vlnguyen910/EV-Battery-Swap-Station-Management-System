import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBattery } from '../../hooks/useContext';
import { swapService } from '../../services/swapService';
import { vehicleService } from '../../services/vehicleService';
import { batteryService } from '../../services/batteryService';
import { reservationService } from '../../services/reservationService';

export default function ManualSwapTransaction() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { batteries, refreshBatteries } = useBattery();
    const [loading, setLoading] = useState(true);
    const [_vehicleData, setVehicleData] = useState(null);

    // Get data from URL params (passed from staff request list)
    const reservationId = searchParams.get('reservationId');
    const userId = searchParams.get('userId');
    const vehicleId = searchParams.get('vehicleId');
    const stationId = searchParams.get('stationId') || '1'; // Default to station 1
    const batteryReturnedId = searchParams.get('batteryReturnedId');
    const subscriptionId = searchParams.get('subscriptionId');
    const _subscriptionName = searchParams.get('subscriptionName');
    const _vin = searchParams.get('vin');

    // Debug: Log URL params
    console.log('URL Params:', {
        reservationId,
        userId,
        vehicleId,
        stationId,
        batteryReturnedId,
        subscriptionId,
        subscriptionIdType: typeof subscriptionId
    });

    const [formData, setFormData] = useState({
        user_id: userId,
        vehicle_id: vehicleId,
        station_id: stationId,
        subscription_id: subscriptionId && subscriptionId !== 'null' && subscriptionId !== 'undefined' ? subscriptionId : '',
        battery_taken_id: '',
        battery_returned_id: batteryReturnedId || '',
    });

    // Fetch vehicle data to get current battery_id
    useEffect(() => {
        const fetchVehicleData = async () => {
            try {
                setLoading(true);
                const vehicle = await vehicleService.getVehicleById(vehicleId);
                setVehicleData(vehicle);

                // Auto-fill battery_returned_id with vehicle's current battery
                if (vehicle.battery_id) {
                    setFormData(prev => ({
                        ...prev,
                        battery_returned_id: vehicle.battery_id.toString()
                    }));
                }
            } catch (error) {
                console.error('Error fetching vehicle data:', error);
                alert('Failed to fetch vehicle data');
            } finally {
                setLoading(false);
            }
        };

        if (vehicleId) {
            fetchVehicleData();
        }
    }, [vehicleId]);

    // Filter batteries that are full and at station 1
    const availableBatteries = batteries.filter(
        b => b.status === 'full' && b.station_id === 1
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
            const swapData = {
                user_id: parseInt(formData.user_id),
                vehicle_id: parseInt(formData.vehicle_id),
                station_id: parseInt(formData.station_id),
                battery_taken_id: parseInt(formData.battery_taken_id),
                battery_returned_id: formData.battery_returned_id ? parseInt(formData.battery_returned_id) : null,
                subscription_id: parseInt(formData.subscription_id),
                status: 'completed',
            };

            console.log('Creating swap transaction:', swapData);
            console.log('Request payload (stringified):', JSON.stringify(swapData, null, 2));

            // Call real API to create swap transaction
            const transaction = await swapService.createSwapTransaction(swapData);
            console.log('Swap transaction created via API:', transaction);

            // Update battery_returned status from 'in_use' to 'charging'
            await batteryService.updateBatteryById(formData.battery_returned_id, {
                status: 'charging',
                station_id: parseInt(formData.station_id)
            });
            console.log(`Battery ${formData.battery_returned_id} status updated to 'charging'`);

            // Update battery_taken status from 'full' to 'in_use'
            await batteryService.updateBatteryById(formData.battery_taken_id, {
                status: 'in_use',
                station_id: null // Battery is now with vehicle
            });
            console.log(`Battery ${formData.battery_taken_id} status updated to 'in_use'`);

            // Update vehicle's current battery_id to the new battery
            await vehicleService.updateVehicle(formData.vehicle_id, {
                battery_id: parseInt(formData.battery_taken_id)
            });
            console.log(`Vehicle ${formData.vehicle_id} battery updated to ${formData.battery_taken_id}`);

            // Update reservation status to 'completed'
            if (reservationId) {
                await reservationService.updateReservationStatus(
                    parseInt(reservationId),
                    parseInt(userId),
                    'completed'
                );
                console.log(`Reservation ${reservationId} status updated to 'completed'`);
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
                                    readOnly
                                />
                            </div>
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
