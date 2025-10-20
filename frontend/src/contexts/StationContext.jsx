import { createContext, useState, useEffect } from "react";
import { stationService } from "../services/stationService";
import { useNavigate } from "react-router-dom";

const { getAllStations: getAllStationsService , getStationById: getStationByIdService } = stationService;

export const StationContext = createContext();

export const StationProvider = ({ children }) => {
    const navigate = useNavigate();
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
            const station = await stationService.getStationByIdService(id);
            return station;
        } catch (error) {
            console.error("Error fetching station by ID:", error);
            throw error;
        }
    };

    // Fetch all stations on mount
    useEffect(() => {
        fetchAllStations();
    }, []);

    return (
        <StationContext.Provider value={{ stations, loading, error, fetchAllStations , getStationById }}>
            {children}
        </StationContext.Provider>
    );
};
