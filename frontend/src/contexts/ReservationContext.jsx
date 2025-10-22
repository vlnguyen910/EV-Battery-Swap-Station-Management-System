import { createContext, useState } from "react";
import { reservationService } from "../services/reservationService";

const {
    getAllReservations: getAllReservationsService,
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

    // Function to create a new reservation
    const createReservation = async (reservationData) => {
        setLoading(true);
        setError(null);
        try {
            const newReservation = await createReservationService(reservationData);
            setReservations((prev) => [...prev, newReservation]);

            // Set as active reservation (status will be 'scheduled' from backend)
            setActiveReservation(newReservation);

            return newReservation;
        } catch (err) {
            console.error('createReservation error', err);
            setError("Failed to create reservation");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to get all reservations
    const getAllReservations = async () => {
        setLoading(true);
        setError(null);
        try {
            const allReservations = await getAllReservationsService();
            setReservations(allReservations);
        } catch (err) {
            console.error('fetchAllReservations error', err);
            setError("Failed to fetch reservations");
        } finally {
            setLoading(false);
        }
    };

    // Function to get reservation by ID 
    const getReservationById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const reservation = await getReservationByIdService(id);
            return reservation;
        } catch (err) {
            console.error('getReservationById error', err);
            setError("Failed to fetch reservation");
        } finally {
            setLoading(false);
        }
    };

    // Function to get reservations by user ID
    const getReservationsByUserId = async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const userReservations = await getReservationsByUserIdService(userId);
            setReservations(userReservations);

            // Find active (scheduled) reservation
            const activeRes = userReservations.find(r => r.status === 'scheduled');
            if (activeRes) {
                setActiveReservation(activeRes);
            }

            return userReservations;
        } catch (err) {
            console.error('getReservationsByUserId error', err);
            setError("Failed to fetch user reservations");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to update reservation status
    // Status flow: scheduled → completed | cancelled
    const updateReservationStatus = async (reservationId, userId, status) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await updateReservationStatusService(reservationId, userId, status);

            // Update in reservations list
            setReservations(prev =>
                prev.map(r => r.reservation_id === reservationId ? updated : r)
            );

            // Update active reservation if it's the one being updated
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
    };

    // Function to clear active reservation
    const clearActiveReservation = () => {
        setActiveReservation(null);
    };

    // Removed auto-fetch on mount - call fetchAllReservations manually when needed
    // useEffect(() => {
    //     fetchAllReservations();
    // }, []);

    return (
        <ReservationContext.Provider
            value={{
                reservations,
                activeReservation,
                loading,
                error,
                createReservation,
                getAllReservations,
                getReservationById,
                getReservationsByUserId,
                updateReservationStatus,
                clearActiveReservation,
            }}
        >
            {children}
        </ReservationContext.Provider>
    );
};
