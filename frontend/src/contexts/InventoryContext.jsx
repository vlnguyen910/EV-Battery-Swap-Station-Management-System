import { createContext, useState, useEffect } from "react";
import { stationService } from "../services/stationService";
import { batteryService } from "../services/batteryService";

const { getAllStations: getAllStationsService, getStationById: getStationByIdService } = stationService;
const { getAllBatteries: getAllBatteriesService, getBatteryById: getBatteryByIdService, updateBatteryById: updateBatteryByIdService } = batteryService;

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    // ============ STATION STATE (from StationContext) ============
    const [stations, setStations] = useState([]);
    const [stationLoading, setStationLoading] = useState(false);
    const [stationError, setStationError] = useState(null);
    const [initialized, setInitialized] = useState(false);

    // ============ BATTERY STATE (from BatteryContext) ============
    const [batteries, setBatteries] = useState([]);
    const [batteryLoading, setBatteryLoading] = useState(false);
    const [batteryError, setBatteryError] = useState(null);

    // ============ STATION METHODS ============
    const fetchAllStations = async () => {
        setStationLoading(true);
        setStationError(null);
        try {
            const data = await getAllStationsService();
            setStations(data);
            setInitialized(true);
            console.log("Stations data fetched successfully", data);
        } catch (error) {
            setStationError(error);
            console.error("Error fetching stations:", error);
        } finally {
            setStationLoading(false);
        }
    };

    const getStationById = async (id) => {
        try {
            const station = await getStationByIdService(id);
            return station;
        } catch (error) {
            console.error("Error fetching station by ID:", error);
            throw error;
        }
    };

    // ============ BATTERY METHODS ============
    const getAllBatteries = async () => {
        setBatteryLoading(true);
        setBatteryError(null);
        try {
            const response = await getAllBatteriesService();

            let batteryPayload = response;

            if (typeof response === 'object' && response !== null) {
                if (Array.isArray(response.data)) {
                    batteryPayload = response.data;
                } else if (Array.isArray(response.data?.data)) {
                    batteryPayload = response.data.data;
                }
            }

            if (!Array.isArray(batteryPayload)) {
                console.warn('BatteryService returned unexpected shape for batteries:', response);
                batteryPayload = [];
            }

            setBatteries(batteryPayload);
        } catch (err) {
            setBatteryError(err instanceof Error ? err.message : String(err));
        } finally {
            setBatteryLoading(false);
        }
    };

    const getBatteryById = async (id) => {
        setBatteryLoading(true);
        setBatteryError(null);
        try {
            const battery = await getBatteryByIdService(id);
            return battery;
        } catch (err) {
            setBatteryError(err instanceof Error ? err.message : String(err));
        } finally {
            setBatteryLoading(false);
        }
    };

    const countAvailableBatteriesByStation = (stationId) => {
        if (!stationId || !Array.isArray(batteries)) return 0;

        return batteries.reduce((count, b) => {
            if (!b) return count;
            if (String(b.station_id) === String(stationId) && String((b.status || '')).toLowerCase() === 'full') {
                return count + 1;
            }
            return count;
        }, 0);
    };

    // ============ EFFECTS ============
    // Station: Check for token to avoid 401 errors
    useEffect(() => {
        const checkAndFetch = () => {
            const token = localStorage.getItem('token');

            console.log('InventoryContext mount (stations):', {
                hasToken: !!token,
                initialized,
                loading: stationLoading,
                stationsCount: stations.length
            });

            if (!token) {
                console.log('No token found - stations endpoint requires auth');
                return;
            }

            if (!initialized && !stationLoading) {
                console.log('Fetching stations...');
                fetchAllStations().catch(err => {
                    console.error('Failed to fetch stations:', err);
                });
            }
        };

        checkAndFetch();
        const timer = setTimeout(checkAndFetch, 100);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Station: Re-fetch when user logs in
    useEffect(() => {
        const handleLogin = () => {
            if (!initialized && !stationLoading) {
                console.log('User logged in - fetching stations');
                fetchAllStations().catch(err => {
                    console.error('Failed to fetch stations after login:', err);
                });
            }
        };

        window.addEventListener('userLoggedIn', handleLogin);
        return () => window.removeEventListener('userLoggedIn', handleLogin);
    }, [initialized, stationLoading]);

    // Battery: Fetch on mount if logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found - skipping battery fetch on mount');
            return;
        }
        getAllBatteries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Combined loading/error for backward compatibility
    const loading = stationLoading || batteryLoading;
    const error = stationError || batteryError;

    return (
        <InventoryContext.Provider value={{
            // Station data & methods
            stations,
            initialized,
            fetchAllStations,
            getStationById,

            // Battery data & methods
            batteries,
            getAllBatteries,
            getBatteryById,
            countAvailableBatteriesByStation,

            // Combined status
            loading,
            error,

            // Individual status (for advanced use)
            stationLoading,
            stationError,
            batteryLoading,
            batteryError,
        }}>
            {children}
        </InventoryContext.Provider>
    );
};
