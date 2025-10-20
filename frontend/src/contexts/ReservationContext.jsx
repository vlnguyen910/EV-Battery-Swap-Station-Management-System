import { createContext, useState, useEffect } from "react";
import { reservationService } from "../services/reservationService";

const { getAllReservations: getAllReservationsService,
    createReservation: createReservationService,
    getReservationByUserId: getReservationByUserIdService
} = reservationService;

export const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to create a new reservation
    const createReservation = async (reservationData) => {
        setLoading(true);
        setError(null);
        try {
            const newReservation = await createReservationService(reservationData);
            setReservations((prev) => [...prev, newReservation]);
        } catch (error) {
            setError("Failed to create reservation");
        } finally {
            setLoading(false);
        }
    };

    // Function to get all reservations
    const fetchAllReservations = async () => {
        setLoading(true);
        setError(null);
        try {
            const allReservations = await getAllReservationsService();
            setReservations(allReservations);
        } catch (error) {
            setError("Failed to fetch reservations");
        } finally {
            setLoading(false);
        }
    };

    // Function to get reservation by user_id 
    const getReservationByUserId = async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const reservation = await getReservationByUserIdService(userId);
            return reservation;
        } catch (error) {
            setError("Failed to fetch reservation");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllReservations();
    }, []);

    return (
        <ReservationContext.Provider
            value={{
                reservations,
                loading,
                error,
                createReservation,
                fetchAllReservations,
                getReservationByUserId,
            }}
        >
            {children}
        </ReservationContext.Provider>
    );
};