import { createContext, useState } from "react";
import { reservationService } from "../services/reservationService";

const { getAllReservations: getAllReservationsService,
    createReservation: createReservationService,
    getReservationById: getReservationByIdService
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
    const fetchAllReservations = async () => {
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

    // Removed auto-fetch on mount - call fetchAllReservations manually when needed
    // useEffect(() => {
    //     fetchAllReservations();
    // }, []);

    return (
        <ReservationContext.Provider
            value={{
                reservations,
                loading,
                error,
                createReservation,
                fetchAllReservations,
                getReservationById,
            }}
        >
            {children}
        </ReservationContext.Provider>
    );
};