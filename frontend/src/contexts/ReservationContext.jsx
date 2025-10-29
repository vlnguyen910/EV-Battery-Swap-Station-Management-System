import { createContext, useState, useCallback, useMemo } from "react";
import { reservationService } from "../services/reservationService";

const {
    getReservationsByStationId: getReservationsByStationIdService,
    createReservation: createReservationService,
    getReservationById: getReservationByIdService,
    updateReservationStatus: updateReservationStatusService,
    getReservationsByUserId: getReservationsByUserIdService
} = reservationService;

export const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
    const [reservations, setReservations] = useState([]);
    const [activeReservation, setActiveReservation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createReservation = useCallback(async (reservationData) => {
        setLoading(true);
        setError(null);
        try {
            const created = await createReservationService(reservationData);
            // created is the reservation entity (normalized in service). If backend shape changes, fallback
            const reservationEntity = created?.reservation_id ? created : (created?.reservation ?? created);
            setReservations((prev) => [...prev, reservationEntity]);
            setActiveReservation(reservationEntity);
            return reservationEntity;
        } catch (err) {
            console.error('createReservation error', err);
            setError("Failed to create reservation");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllReservationsByStationId = useCallback(async (stationId) => {
        setLoading(true);
        setError(null);
        try {
            const allReservations = await getReservationsByStationIdService(stationId);
            setReservations(allReservations);
            return allReservations;
        } catch (err) {
            console.error('fetchAllReservations error', err);
            setError("Failed to fetch reservations");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getReservationById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const reservation = await getReservationByIdService(id);
            return reservation;
        } catch (err) {
            console.error('getReservationById error', err);
            setError("Failed to fetch reservation");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // NOTE: accepts optional { signal } so caller can abort
    const getReservationsByUserId = useCallback(async (userId, options = {}) => {
        const { signal } = options;
        setLoading(true);
        setError(null);
        try {
            const userReservations = await getReservationsByUserIdService(userId, { signal });
            setReservations(userReservations);

            const activeRes = userReservations.find(r => r.status === 'scheduled');
            if (activeRes) setActiveReservation(activeRes);
            return userReservations;
        } catch (err) {
            // ignore abort/cancel errors
            const isCanceled = err?.name === 'CanceledError' || err?.message === 'canceled' || err?.code === 'ERR_CANCELED';
            if (isCanceled) return;
            console.error('getReservationsByUserId error', err);
            setError("Failed to fetch user reservations");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateReservationStatus = useCallback(async (reservationId, userId, status) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await updateReservationStatusService(reservationId, userId, status);
            setReservations(prev =>
                prev.map(r => r.reservation_id === reservationId ? updated : r)
            );
            if (activeReservation?.reservation_id === reservationId) {
                if (status === 'completed' || status === 'cancelled') {
                    setActiveReservation(null);
                } else {
                    setActiveReservation(updated);
                }
            }
            return updated;
        } catch (err) {
            console.error('updateReservationStatus error', err);
            setError("Failed to update reservation status");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [activeReservation]);

    const clearActiveReservation = useCallback(() => {
        setActiveReservation(null);
    }, []);

    // stable context value to avoid re-renders in consumers
    const contextValue = useMemo(() => ({
        reservations,
        activeReservation,
        loading,
        error,
        createReservation,
        getAllReservationsByStationId,
        getReservationById,
        getReservationsByUserId,
        updateReservationStatus,
        clearActiveReservation,
    }), [
        reservations,
        activeReservation,
        loading,
        error,
        createReservation,
        getAllReservationsByStationId,
        getReservationById,
        getReservationsByUserId,
        updateReservationStatus,
        clearActiveReservation
    ]);

    return (
        <ReservationContext.Provider value={contextValue}>
            {children}
        </ReservationContext.Provider>
    );
};