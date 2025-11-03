import { createContext, useState, useEffect, useCallback } from "react";
import { reservationService } from "../services/reservationService";

export const SwapRequestContext = createContext();

export const SwapRequestProvider = ({ children }) => {
    // Swap requests = reservations with status "scheduled" for staff's station
    const [swapRequests, setSwapRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('swapNotifications');
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage whenever notifications changes
    useEffect(() => {
        localStorage.setItem('swapNotifications', JSON.stringify(notifications));
    }, [notifications]);

    // Fetch scheduled reservations for a specific station (staff's station_id)
    const fetchSwapRequestsForStation = useCallback(async (stationId) => {
        if (!stationId) {
            console.warn('No station_id provided to fetch swap requests');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const allReservations = await reservationService.getReservationsByStationId(stationId);
            // Filter only "scheduled" reservations = swap requests for staff
            const scheduledReservations = allReservations.filter(res => res.status === 'scheduled');
            setSwapRequests(scheduledReservations);
        } catch (err) {
            console.error('Error fetching swap requests:', err);
            setError(err.message || 'Failed to fetch swap requests');
            setSwapRequests([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get pending requests for a specific staff based on their station
    const getPendingRequestsForStaff = useCallback((stationId) => {
        // Return scheduled reservations for staff's station
        return swapRequests.filter(req => req.station_id === stationId && req.status === 'scheduled');
    }, [swapRequests]);

    // Update request status (update reservation status via API)
    const updateRequestStatus = useCallback(async (reservationId, userId, status) => {
        try {
            const updatedReservation = await reservationService.updateReservationStatus(reservationId, userId, status);

            // Update local state
            setSwapRequests(prev =>
                prev.map(req => req.reservation_id === reservationId ? { ...req, status } : req)
            );

            return updatedReservation;
        } catch (err) {
            console.error('Error updating reservation status:', err);
            throw err;
        }
    }, []);

    // Add notification for driver
    const addNotification = useCallback((userId, message, type = 'info') => {
        const newNotification = {
            notification_id: Date.now(),
            user_id: userId,
            message,
            type, // info, success, warning, error
            created_at: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => [...prev, newNotification]);
    }, []);

    // Get notifications for user
    const getNotificationsForUser = useCallback((userId) => {
        return notifications.filter(notif => notif.user_id === userId);
    }, [notifications]);

    // Mark notification as read
    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.map(notif => notif.notification_id === notificationId ? { ...notif, read: true } : notif)
        );
    }, []);

    return (
        <SwapRequestContext.Provider
            value={{
                swapRequests,
                loading,
                error,
                notifications,
                fetchSwapRequestsForStation,
                getPendingRequestsForStaff,
                updateRequestStatus,
                addNotification,
                getNotificationsForUser,
                markAsRead,
            }}
        >
            {children}
        </SwapRequestContext.Provider>
    );
};
