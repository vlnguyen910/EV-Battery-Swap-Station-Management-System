import { createContext, useState, useEffect } from "react";
import { stationService } from "../services/stationService";
import { useNavigate } from "react-router-dom";

const { getAllStations: getAllStationsService } = stationService;

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
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all stations on mount
    useEffect(() => {
        fetchAllStations();
    }, []);

    return (
        <StationContext.Provider value={{ stations, loading, error }}>
            {children}
        </StationContext.Provider>
    );
};
