import { createContext, useState, useEffect } from "react";

export const SwapRequestContext = createContext();

export const SwapRequestProvider = ({ children }) => {
    // Load from localStorage on mount
    const [swapRequests, setSwapRequests] = useState(() => {
        const saved = localStorage.getItem('swapRequests');
        return saved ? JSON.parse(saved) : [];
    });
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('swapNotifications');
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage whenever swapRequests changes
    useEffect(() => {
        localStorage.setItem('swapRequests', JSON.stringify(swapRequests));
    }, [swapRequests]);

    // Save to localStorage whenever notifications changes
    useEffect(() => {
        localStorage.setItem('swapNotifications', JSON.stringify(notifications));
    }, [notifications]);

    // Create a new manual swap request
    // Hardcoded: Staff OK (user_id=17) works at Station 1
    const createSwapRequest = (driverData) => {
        const newRequest = {
            request_id: Date.now(),
            user_id: driverData.user_id, // Real user from login
            user_name: driverData.user_name, // Real user name
            vehicle_id: driverData.vehicle_id, // Real vehicle from user
            vin: driverData.vin, // Real VIN from user
            subscription_id: driverData.subscription_id, // Real subscription
            subscription_name: driverData.subscription_name, // Real subscription name
            created_at: new Date().toISOString(),
            status: 'pending', // pending, processing, completed
            staff_id: 17, // Hardcode: Staff OK (user_id=17)
            station_id: 1, // Hardcode: Station 1
        };

        setSwapRequests(prev => [...prev, newRequest]);
        return newRequest;
    };

    // Get pending requests for a specific staff
    const getPendingRequestsForStaff = (staffId) => {
        return swapRequests.filter(req => req.staff_id === staffId && req.status === 'pending');
    };

    // Update request status
    const updateRequestStatus = (requestId, status) => {
        setSwapRequests(prev =>
            prev.map(req => req.request_id === requestId ? { ...req, status } : req)
        );
    };

    // Add notification for driver
    const addNotification = (userId, message, type = 'info') => {
        const newNotification = {
            notification_id: Date.now(),
            user_id: userId,
            message,
            type, // info, success, warning, error
            created_at: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => [...prev, newNotification]);
    };

    // Get notifications for user
    const getNotificationsForUser = (userId) => {
        return notifications.filter(notif => notif.user_id === userId);
    };

    // Mark notification as read
    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notif => notif.notification_id === notificationId ? { ...notif, read: true } : notif)
        );
    };

    return (
        <SwapRequestContext.Provider
            value={{
                swapRequests,
                notifications,
                createSwapRequest,
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
