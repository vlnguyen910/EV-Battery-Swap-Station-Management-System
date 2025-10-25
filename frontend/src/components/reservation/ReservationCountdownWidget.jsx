import { useState, useEffect, useCallback } from 'react';
import { Battery, MapPin, Clock, X, Zap, UserCog } from 'lucide-react';
import { useReservation, useAuth } from '../../hooks/useContext';

export default function ReservationCountdownWidget() {
    const { activeReservation, updateReservationStatus, clearActiveReservation } = useReservation();
    const { user } = useAuth();
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);

    // Calculate initial time remaining
    useEffect(() => {
        if (activeReservation?.scheduled_time) {
            const scheduledTime = new Date(activeReservation.scheduled_time);
            const now = new Date();
            const diff = Math.floor((scheduledTime.getTime() - now.getTime()) / 1000);
            setTimeRemaining(Math.max(0, diff + 3600)); // 1 hour from scheduled time
        }
    }, [activeReservation]);

    const handleTimeExpired = useCallback(async () => {
        if (!activeReservation || !user) return;

        try {
            // Auto-cancel when time expires (scheduled → cancelled)
            await updateReservationStatus(Number(activeReservation.reservation_id), Number(user.id ?? user.user_id), 'cancelled');
            clearActiveReservation();
            alert('Your reservation has expired and been cancelled');
        } catch (error) {
            console.error('Failed to cancel expired reservation:', error);
        }
    }, [activeReservation, user, updateReservationStatus, clearActiveReservation]);

    // Countdown timer
    useEffect(() => {
        if (!activeReservation || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    // Time expired - cancel reservation
                    handleTimeExpired();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [activeReservation, timeRemaining, handleTimeExpired]);

    const handleManualSwap = async () => {
        if (!activeReservation || !user) {
            alert('Missing required information for swap');
            return;
        }

        console.log('Active reservation:', activeReservation);
        console.log('Attempting to update reservation_id:', activeReservation.reservation_id);

        try {
            // Mark reservation as completed (scheduled → completed)
            // This reservation is already the "swap request" in the new system
            await updateReservationStatus(Number(activeReservation.reservation_id), Number(user.id ?? user.user_id), 'completed');

            clearActiveReservation();
            alert('Reservation completed! Manual swap request is now visible to staff.');
        } catch (error) {
            console.error('Failed to process manual swap:', error);
            alert('Failed to process swap request');
        }
    };

    const handleCancelBooking = async () => {
        if (!activeReservation) return;

        const confirm = window.confirm('Are you sure you want to cancel this reservation?');
        if (!confirm) return;

        try {
            // Cancel reservation (scheduled → cancelled)
            await updateReservationStatus(Number(activeReservation.reservation_id), Number(user.id ?? user.user_id), 'cancelled');
            clearActiveReservation();
        } catch (error) {
            console.error('Failed to cancel reservation:', error);
            alert('Failed to cancel reservation');
        }
    };

    const handleCancel = async () => {
        if (!activeReservation) return;

        const confirm = window.confirm('Are you sure you want to cancel this reservation?');
        if (!confirm) return;

        try {
            // Cancel reservation (scheduled → cancelled)
            await updateReservationStatus(Number(activeReservation.reservation_id), Number(user.id ?? user.user_id), 'cancelled');
            clearActiveReservation();
        } catch (error) {
            console.error('Failed to cancel reservation:', error);
            alert('Failed to cancel reservation');
        }
    };

    const handleToggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    if (!activeReservation) return null;

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
