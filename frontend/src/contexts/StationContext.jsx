import { createContext, useState, useEffect } from "react";
import { stationService } from "../services/stationService";

const { getAllStations: getAllStationsService, getStationById: getStationByIdService } = stationService;

export const StationContext = createContext();

export const StationProvider = ({ children }) => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch all stations
    const fetchAllStations = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllStationsService();
            setStations(data);
            console.log("Stations data fetched successfully", data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
        console.log("Fetched stations:", stations);
    };
    // Function to fetch station by ID 
    const getStationById = async (id) => {
        try {
            // use the destructured service function
            const station = await getStationByIdService(id);
            return station;
        } catch (error) {
            console.error("Error fetching station by ID:", error);
            throw error;
        }
    };

    // Fetch all stations on mount - ONLY if user is logged in
    useEffect(() => {
        // Check if user has token before fetching
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found - skipping station fetch on mount');
            return;
        }

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllStationsService();
                setStations(data);
                console.log("Stations data fetched successfully", data);
            } catch (err) {
                console.error("Error fetching stations on mount:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <StationContext.Provider value={{ stations, loading, error, fetchAllStations, getStationById }}>
            {children}
        </StationContext.Provider>
    );
};
