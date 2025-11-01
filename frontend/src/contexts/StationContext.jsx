import { createContext, useState, useEffect } from "react";
import { stationService } from "../services/stationService";

const { getAllStations: getAllStationsService, getStationById: getStationByIdService } = stationService;

export const StationContext = createContext();

export const StationProvider = ({ children }) => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [initialized, setInitialized] = useState(false);

    // Function to fetch all stations
    const fetchAllStations = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllStationsService();
            setStations(data);
            setInitialized(true);
            console.log("Stations data fetched successfully", data);
        } catch (error) {
            setError(error);
            console.error("Error fetching stations:", error);
        } finally {
            setLoading(false);
        }
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

    // Check for token to avoid 401 errors (backend requires auth for stations endpoint)
    useEffect(() => {
        // Wait a bit for token to be set if user is already logged in
        const checkAndFetch = () => {
            const token = localStorage.getItem('token');

            console.log('StationContext mount:', {
                hasToken: !!token,
                initialized,
                loading,
                stationsCount: stations.length
            });

            if (!token) {
                console.log('No token found - stations endpoint requires auth');
                return;
            }

            // Fetch if not already initialized and not currently loading
            if (!initialized && !loading) {
                console.log('Fetching stations...');
                fetchAllStations().catch(err => {
                    console.error('Failed to fetch stations:', err);
                });
            }
        };

        // Check immediately
        checkAndFetch();

        // Also check after a short delay (in case token is set during login)
        const timer = setTimeout(checkAndFetch, 100);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    // Re-fetch when user logs in (listen for custom event from AuthContext)
    useEffect(() => {
        const handleLogin = () => {
            if (!initialized && !loading) {
                console.log('User logged in - fetching stations');
                fetchAllStations().catch(err => {
                    console.error('Failed to fetch stations after login:', err);
                });
            }
        };

        window.addEventListener('userLoggedIn', handleLogin);
        return () => window.removeEventListener('userLoggedIn', handleLogin);
    }, [initialized, loading]);

    return (
        <StationContext.Provider value={{ stations, loading, error, initialized, fetchAllStations, getStationById }}>
            {children}
        </StationContext.Provider>
    );
};
