import { createContext, useState, useEffect, useContext } from "react";
import { stationService } from "../services/stationService";
import { batteryService } from "../services/batteryService";
import { vehicleService } from "../services/vehicleService";
import { AuthContext } from "./AuthContext";

const { getAllStations: getAllStationsService, getStationById: getStationByIdService, getAvailableStations: getAvailableStationsService } = stationService;
const { getAllBatteries: getAllBatteriesService, getBatteryById: getBatteryByIdService, updateBatteryById: updateBatteryByIdService } = batteryService;
//Fetch vehicle
const { getVehicleByUserId: getVehicleByUserIdService } = vehicleService;

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    // Get user from AuthContext
    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    // ============ STATION STATE (from StationContext) ============
    const [stations, setStations] = useState([]);
    const [stationLoading, setStationLoading] = useState(false);
    const [stationError, setStationError] = useState(null);
    const [initialized, setInitialized] = useState(false);

    // Geolocation state
    const [userLocation, setUserLocation] = useState(null);

    // ============ BATTERY STATE (from BatteryContext) ============
    const [batteries, setBatteries] = useState([]);
    const [batteryLoading, setBatteryLoading] = useState(false);
    const [batteryError, setBatteryError] = useState(null);

    // ============ VEHICLE STATE ============
    const [cachedVehicles, setCachedVehicles] = useState([]);
    const [vehiclesFetched, setVehiclesFetched] = useState(false);

    // ============ STATION METHODS ============
    // Get user's current location
    const getUserLocation = () => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.warn('Geolocation is not supported by this browser');
                resolve(null);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    console.log('User location obtained:', location);
                    setUserLocation(location);
                    resolve(location);
                },
                (error) => {
                    console.warn('Geolocation error:', error.message);
                    resolve(null);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 300000 // Cache for 5 minutes
                }
            );
        });
    };

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

    const getAvailableStations = async (longitude = null, latitude = null) => {
        setStationLoading(true);
        setStationError(null);

        try {
            // Get user_id from user object
            const userId = user?.user_id || user?.id;

            if (!userId) {
                console.warn('No user_id found, cannot fetch available stations');
                setStations([]);
                return;
            }

            // Lấy vehicleId từ cached vehicles của user hiện tại
            let vehicleId = null;

            // Chỉ fetch vehicles nếu chưa fetch cho user này
            if (!vehiclesFetched) {
                try {
                    const vehiclesResponse = await getVehicleByUserIdService(userId);
                    console.log('Vehicles response:', vehiclesResponse);

                    // Handle different response formats
                    const vehicles = Array.isArray(vehiclesResponse)
                        ? vehiclesResponse
                        : (vehiclesResponse?.data || []);

                    // Cache vehicles cho user này
                    setCachedVehicles(vehicles);
                    setVehiclesFetched(true);

                    // Get first vehicle's ID if exists
                    if (vehicles.length > 0) {
                        vehicleId = vehicles[0]?.vehicle_id || vehicles[0]?.id;
                        console.log('Using vehicle_id:', vehicleId);
                    } else {
                        console.warn('No vehicles found for user');
                    }
                } catch (vehicleError) {
                    console.error('Error fetching vehicles:', vehicleError);
                    setVehiclesFetched(true); // Đánh dấu đã fetch để không thử lại
                }
            } else {
                // Dùng cached vehicles
                if (cachedVehicles.length > 0) {
                    vehicleId = cachedVehicles[0]?.vehicle_id || cachedVehicles[0]?.id;
                    console.log('Using cached vehicle_id:', vehicleId);
                } else {
                    console.log('No cached vehicles for this user');
                }
            }

            // Get coordinates: use provided > user location > browser geolocation > default HCM
            let finalLongitude = longitude;
            let finalLatitude = latitude;

            if (finalLongitude === null || finalLatitude === null) {
                // Try to use cached user location
                if (userLocation) {
                    finalLongitude = userLocation.longitude;
                    finalLatitude = userLocation.latitude;
                    console.log('Using cached user location');
                } else {
                    // Try to get current location
                    const location = await getUserLocation();
                    if (location) {
                        finalLongitude = location.longitude;
                        finalLatitude = location.latitude;
                        console.log('Using fresh geolocation');
                    } else {
                        // Fallback to HCM coordinates
                        finalLongitude = 106.6297;
                        finalLatitude = 10.8231;
                        console.log('Using default HCM coordinates');
                    }
                }
            }

            // Call API - only pass vehicle_id if found
            const data = await getAvailableStationsService(
                userId,
                vehicleId, // null if no vehicle found - service will handle
                finalLongitude,
                finalLatitude
            );

            setStations(data);
            setInitialized(true);
            console.log("Available stations fetched successfully", data);
        } catch (error) {
            setStationError(error);
            console.error("Error fetching available stations:", error);
        } finally {
            setStationLoading(false);
        }
    }

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
    // Clear cached data when user changes (logout/login)
    useEffect(() => {
        const userId = user?.user_id || user?.id;

        if (!userId) {
            // User logged out - clear everything
            console.log('User logged out - clearing cached data');
            setCachedVehicles([]);
            setVehiclesFetched(false);
            setStations([]);
            setInitialized(false);
            return;
        }

        // User changed - reset vehicle cache for new user
        console.log('User changed - resetting vehicle cache for user:', userId);
        setCachedVehicles([]);
        setVehiclesFetched(false);
        setInitialized(false);

    }, [user?.user_id, user?.id]);

    // Station: Check for token to avoid 401 errors
    useEffect(() => {
        const checkAndFetch = () => {
            const token = localStorage.getItem('token');

            console.log('InventoryContext mount (stations):', {
                hasToken: !!token,
                hasUser: !!user,
                userId: user?.user_id || user?.id,
                initialized,
                loading: stationLoading,
                stationsCount: stations.length
            });

            if (!token || !user) {
                console.log('No token or user found - cannot fetch stations');
                return;
            }

            if (!initialized && !stationLoading) {
                console.log('Fetching available stations...');
                getAvailableStations().catch(err => {
                    console.error('Failed to fetch stations:', err);
                });
            }
        };

        checkAndFetch();
        const timer = setTimeout(checkAndFetch, 100);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Station: Re-fetch when user logs in
    useEffect(() => {
        const handleLogin = () => {
            if (!initialized && !stationLoading && user) {
                console.log('User logged in - fetching available stations');
                getAvailableStations().catch(err => {
                    console.error('Failed to fetch stations after login:', err);
                });
            }
        };

        window.addEventListener('userLoggedIn', handleLogin);
        return () => window.removeEventListener('userLoggedIn', handleLogin);
    }, [initialized, stationLoading, user]);

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
            fetchAllStations: getAvailableStations, // User chỉ cần available stations
            getStationById,
            getAvailableStations,

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
