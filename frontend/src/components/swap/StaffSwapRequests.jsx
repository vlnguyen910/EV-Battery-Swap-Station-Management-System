import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationService } from '../../services/reservationService';
import { useAuth } from '../../hooks/useContext';
import { vehicleService } from '../../services/vehicleService';
import { useSubscription } from '../../hooks/useContext';

export default function StaffSwapRequests() {
    const { getSubscriptionsByUserId } = useSubscription();
    const navigate = useNavigate();
    const [scheduledReservations, setScheduledReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Fetch scheduled reservations for the staff's assigned station
    useEffect(() => {
        const fetchScheduledReservations = async () => {
            try {
                setLoading(true);

                // Debug: log entire user object
                console.log('Current logged-in user:', user);
                console.log('User station_id:', user?.station_id);

                const stationId = user?.station_id ? parseInt(user.station_id) : null;
                console.log('Parsed stationId:', stationId);

                // If staff isn't assigned to a station, show none
                if (!stationId) {
                    console.warn('Staff has no station_id assigned - showing empty list');
                    setScheduledReservations([]);
                    setError(null);
                    setLoading(false);
                    return;
                }

                console.log('Calling API: GET /reservations/station/' + stationId);
                // Backend endpoint already filters by station_id AND status='scheduled'
                const reservations = await reservationService.getReservationsByStationId(stationId);
                console.log('API Response - Fetched scheduled reservations for station', stationId, ':', reservations);
                console.log('Number of reservations:', reservations?.length || 0);

                setScheduledReservations(reservations || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching scheduled reservations:', err);
                console.error('Error details:', err.response?.data || err.message);
                setError('Failed to load swap requests');
                setScheduledReservations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchScheduledReservations();
    }, [user]);

    const handleProcessRequest = async (reservation) => {
        try {
            console.log('Processing reservation:', reservation);

            // Fetch vehicle info to get VIN and current battery
            const vehicle = await vehicleService.getVehicleById(reservation.vehicle_id);
            console.log('Vehicle info:', vehicle);

            // Fetch active subscription for this user
            const subscription = await getSubscriptionsByUserId(reservation.user_id);
            console.log('Subscription info:', subscription);

            // Navigate to manual swap transaction form with all data
            const params = new URLSearchParams({
                reservationId: reservation.reservation_id,
                userId: reservation.user_id,
                vehicleId: reservation.vehicle_id,
                vin: vehicle.vin || 'N/A',
                stationId: reservation.station_id,
                batteryReturnedId: vehicle.battery_id || '',
                subscriptionId: subscription?.subscription_id || '',
                subscriptionName: subscription?.package?.package_name || 'No active subscription',
            });

            console.log('URL Params being sent:', params.toString());
            navigate(`/staff/manual-swap?${params.toString()}`);
        } catch (error) {
            console.error('Error processing request:', error);
            alert('Failed to process request: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading swap requests...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <span className="material-icons text-red-500 text-6xl mb-4">error</span>
                    <p className="text-red-600 text-lg font-semibold">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Yêu cầu đổi pin</h1>
                <p className="text-gray-600">Các booking đã được xác nhận và đang chờ xử lý</p>
            </div>

            {scheduledReservations.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <span className="material-icons text-gray-300 text-6xl mb-4">inbox</span>
                    <p className="text-gray-500 text-lg">Không có yêu cầu đổi pin nào</p>
                    <p className="text-gray-400 text-sm mt-2">Các booking đã được xác nhận sẽ hiển thị ở đây</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {scheduledReservations.map((reservation) => (
                        <div
                            key={reservation.reservation_id}
                            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-icons text-blue-500">event</span>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Reservation #{reservation.reservation_id}
                                        </h3>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                            Scheduled
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">User ID</p>
                                            <p className="font-medium text-gray-900">{reservation.user_id}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Vehicle ID</p>
                                            <p className="font-medium text-gray-900">{reservation.vehicle_id}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Station ID</p>
                                            <p className="font-medium text-gray-900">{reservation.station_id}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Battery ID</p>
                                            <p className="font-medium text-gray-900">{reservation.battery_id || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Scheduled Time</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(reservation.scheduled_time).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Status</p>
                                            <p className="font-medium text-gray-900">{reservation.status}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-4">
                                    <button
                                        onClick={() => handleProcessRequest(reservation)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        <span className="material-icons">build</span>
                                        Process Swap
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
