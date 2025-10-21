import { createContext, useState, useEffect } from "react";
import { batteryService } from "../services/batteryService";

const { getAllBatteries: getAllBatteriesService,
        getBatteryById: getBatteryByIdService,
        updateBatteryById: updateBatteryByIdService
 } = batteryService;

export const BatteryContext = createContext();

export const BatteryProvider = ({ children }) => {
    const [batteries, setBatteries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch all batteries
    const getAllBatteries = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllBatteriesService();

            // 1. Define a robust way to extract the array, checking common nested structures
            let batteryPayload = response;

            if (typeof response === 'object' && response !== null) {
                // Check for { data: [...] } or { data: { data: [...] } }
                if (Array.isArray(response.data)) {
                    batteryPayload = response.data;
                } else if (Array.isArray(response.data?.data)) {
                    batteryPayload = response.data.data;
                }
                // If it's a plain array, it was already assigned to batteryPayload
            }

            // 2. Ensure the final result is an array, logging a warning if not
            if (!Array.isArray(batteryPayload)) {
                console.warn('BatteryService returned unexpected shape for batteries:', response);
                batteryPayload = [];
            }

            setBatteries(batteryPayload);
        } catch (err) {
            // Use err.message if it exists, otherwise use the error object itself
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    const getBatteryById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const battery = await getBatteryByIdService(id);
            return battery;
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    // Function to count available batteries with status "full" by station ID
    const countAvailableBatteriesByStation = (stationId) => {
        if (!stationId || !Array.isArray(batteries)) return 0;

        return batteries.reduce((count, b) => {
            if (!b) return count;
            // dùng đúng trường station_id từ DB
            if (String(b.station_id) === String(stationId) && String((b.status || '')).toLowerCase() === 'full') {
                return count + 1;
            }
            return count;
        }, 0);
    };

    // Fetch all batteries on mount
    // Fetch mà không được thì ra chuỗi rỗng
    useEffect(() => {
        getAllBatteries();
    }, []);

    return (
        <BatteryContext.Provider value={{ batteries, loading, error, countAvailableBatteriesByStation, getAllBatteries, getBatteryById }}>
            {children}
        </BatteryContext.Provider>
    );
};





