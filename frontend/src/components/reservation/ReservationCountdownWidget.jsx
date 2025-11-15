import { useState, useEffect, useCallback, useRef } from 'react';
import { Battery, MapPin, Clock, X, Zap, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { useReservation, useAuth } from '../../hooks/useContext';
import { useNavigate } from 'react-router-dom';
import BookingSuccessHeader from '../booking/BookingSuccessHeader';
import { reservationService } from '../../services/reservationService';

export default function ReservationCountdownWidget() {
    const { activeReservation, updateReservationStatus, clearActiveReservation } = useReservation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);
    const [reservationStatus, setReservationStatus] = useState(null);

    // confirmation modal state
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showCancelledScreen, setShowCancelledScreen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    // Real-time polling state
    const pollingIntervalRef = useRef(null);
    const countdownIntervalRef = useRef(null);
    const [isPolling, setIsPolling] = useState(false);

    // Fetch latest reservation status from backend (every 2 seconds)
    const fetchReservationStatus = useCallback(async () => {
        if (!activeReservation?.reservation_id || !user) return;

        try {
            setIsPolling(true);
            const response = await reservationService.getReservationById(activeReservation.reservation_id);
            const latestReservation = response.data || response;

            setReservationStatus(latestReservation.status);

            // Check if reservation is completed
            if (latestReservation.status === 'completed') {
                clearActiveReservation();
                setShowCancelledScreen(false);
                toast.success('Battery swapped successfully! 🎉');
                // Optionally navigate or show success message
                return;
            }

            // Check if reservation is already cancelled from another source
            if (latestReservation.status === 'cancelled') {
                clearActiveReservation();
                toast.info('Reservation has been cancelled');
                return;
            }

        } catch (error) {
            console.error('Error fetching reservation status:', error);
        } finally {
            setIsPolling(false);
        }
    }, [activeReservation?.reservation_id, user, clearActiveReservation]);

    // Calculate initial time remaining (30 minutes from scheduled time)
    useEffect(() => {
        if (activeReservation?.scheduled_time) {
            const scheduledTime = new Date(activeReservation.scheduled_time);
            const now = new Date();
            const diff = Math.floor((scheduledTime.getTime() - now.getTime()) / 1000);
            // 30 minutes = 1800 seconds
            setTimeRemaining(Math.max(0, diff + 1800));
            setReservationStatus(activeReservation.status);
        }
    }, [activeReservation]);

    // Handle time expired - auto cancel reservation
    const handleTimeExpired = useCallback(async () => {
        if (!activeReservation || !user) return;

        try {
            await updateReservationStatus(
                Number(activeReservation.reservation_id),
                Number(user.id ?? user.user_id),
                'cancelled'
            );
            clearActiveReservation();
            toast.info('Your reservation has expired and been cancelled');
        } catch (error) {
            console.error('Failed to cancel expired reservation:', error);
            toast.error('Failed to cancel expired reservation');
        }
    }, [activeReservation, user, updateReservationStatus, clearActiveReservation]);

    // Real-time polling every 2 seconds
    useEffect(() => {
        if (!activeReservation) {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
            return;
        }

        // Initial fetch
        fetchReservationStatus();

        // Set up polling interval (2 seconds)
        pollingIntervalRef.current = setInterval(() => {
            fetchReservationStatus();
        }, 2000);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [activeReservation, fetchReservationStatus]);

    // Countdown timer (1 second)
    useEffect(() => {
        if (!activeReservation || timeRemaining <= 0) return;

        countdownIntervalRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleTimeExpired();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, [activeReservation, timeRemaining, handleTimeExpired]);

    const handleCancelBooking = async () => {
        setShowCancelDialog(true);
    };

    const handleCancel = async () => {
        setShowCancelDialog(true);
    };

    const performCancelReservation = useCallback(async () => {
        if (!activeReservation || !user) return;
        console.debug('performCancelReservation: start', {
            reservationId: activeReservation?.reservation_id,
            userId: user?.id ?? user?.user_id
        });

        setShowCancelDialog(false);
        setShowCancelledScreen(true);
        setIsCancelling(true);

        try {
            const updated = await updateReservationStatus(
                Number(activeReservation.reservation_id),
                Number(user.id ?? user.user_id),
                'cancelled'
            );
            console.debug('performCancelReservation: api success', updated);
            clearActiveReservation();
        } catch (error) {
            console.error('Failed to cancel reservation (api):', error);
            setShowCancelledScreen(false);
            toast.error('Failed to cancel reservation. Please try again.');
        } finally {
            setIsCancelling(false);
        }
    }, [activeReservation, user, updateReservationStatus, clearActiveReservation]);

    const handleToggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    if (!activeReservation && !showCancelledScreen) return null;

    if (showCancelledScreen) {
        return (
            <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/20">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 text-center">
                    <BookingSuccessHeader
                        title="Appointment canceled"
                        subtitle="Hope to see you again soon 💫"
                        variant="cancel"
                    />
                    <div className="flex justify-center">
                        <button
                            onClick={() => {
                                setShowCancelledScreen(false);
                                clearActiveReservation();
                                navigate('/driver/map');
                            }}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                        >
                            Back to map
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show completion message when status changes to completed
    if (reservationStatus === 'completed') {
        return (
            <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/20">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 text-center">
                    <BookingSuccessHeader
                        title="Battery swapped successfully!"
                        subtitle="Thank you for using our service 🔋"
                        variant="success"
                    />
                    <div className="flex justify-center">
                        <button
                            onClick={() => {
                                clearActiveReservation();
                                navigate('/driver/map');
                            }}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                        >
                            Back to map
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-96'}`}>
            <div className="bg-slate-700 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-gray-500/30">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-white" />
                        <span className="text-white font-semibold">Active Reservation</span>
                        {isPolling && (
                            <span className="ml-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleToggleMinimize}
                            className="text-white hover:bg-white/20 rounded p-1 transition-colors"
                        >
                            {isMinimized ? (
                                <span className="material-icons text-lg">expand_less</span>
                            ) : (
                                <span className="material-icons text-lg">expand_more</span>
                            )}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="text-white hover:bg-red-500/50 rounded p-1 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {!isMinimized && (
                    <div className="p-4 space-y-4">
                        {/* Countdown Timer */}
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-white/80 text-sm mb-1">Time Remaining</div>
                            <div className="text-4xl font-bold text-white tabular-nums">
                                {formatTime(timeRemaining)}
                            </div>
                            <div className="text-white/60 text-xs mt-2">
                                30 minutes to complete battery swap
                            </div>
                        </div>

                        {/* Reservation Status */}
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                            <div className="text-white/80 text-xs">Status: <span className="font-semibold capitalize">{reservationStatus || 'Loading...'}</span></div>
                        </div>

                        {/* Station Info */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white/90">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">
                                    Station {activeReservation.station_id}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-white/90">
                                <Battery className="w-4 h-4" />
                                <span className="text-sm">
                                    Scheduled: {new Date(activeReservation.scheduled_time).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>

                        {/* Swap Buttons */}
                        <div className="grid p-4">
                            <button
                                onClick={handleCancelBooking}
                                className="bg-white/20 hover:bg-red-500/50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                <span>Cancel Booking</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Confirmation modal */}
                {showCancelDialog && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-40" />
                        <div className="relative bg-white rounded-lg p-6 z-[100000] max-w-sm w-full shadow-xl">
                            <h3 className="text-lg font-bold mb-2">Confirm Cancellation</h3>
                            <p className="text-gray-600 mb-4">Are you sure you want to cancel this reservation?</p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowCancelDialog(false)}
                                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                                >
                                    No
                                </button>
                                <button
                                    onClick={performCancelReservation}
                                    disabled={isCancelling}
                                    className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ${isCancelling ? 'opacity-60 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Minimized View */}
                {isMinimized && (
                    <div className="p-3 flex items-center justify-between">
                        <div className="text-2xl font-bold text-white tabular-nums">
                            {formatTime(timeRemaining)}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancelBooking}
                                className="bg-white/20 hover:bg-red-500 text-white p-2 rounded transition-colors"
                                title="Cancel Booking"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}