import { createContext, useState, useEffect } from "react";
import { batteryService } from "../services/batteryService";

const { getAllBatteries: getAllBatteriesService } = batteryService;

export const BatteryContext = createContext();

export const BatteryProvider = ({ children }) => {
    const [batteries, setBatteries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //function to fetch all batteries
    const fetchAllBatteries = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllBatteriesService();
            // service might return an array directly, or { data: [...] }, or { data: { data: [...] } }
            let payload = response;
            if (response && typeof response === 'object') {
                if (Array.isArray(response)) payload = response;
                else if (Array.isArray(response.data)) payload = response.data;
                else if (response.data && Array.isArray(response.data.data)) payload = response.data.data;
            }
            if (!Array.isArray(payload)) {
                console.warn('BatteryService returned unexpected shape for batteries:', response);
                payload = [];
            }
            setBatteries(payload);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to count available batteries with status "full" by station ID
    const countAvailableBatteriesByStation = (stationIdOrObj) => {
        // accept either station id or station object
        const stationId = typeof stationIdOrObj === 'object' && stationIdOrObj !== null
            ? (stationIdOrObj.station_id ?? stationIdOrObj.stationId ?? stationIdOrObj.id)
            : stationIdOrObj;

        if (!Array.isArray(batteries)) return 0;

        return batteries.reduce((count, battery) => {
            if (!battery) return count;
            const bStationId = battery.station_id ?? battery.stationId ?? battery.station ?? battery.stationId ?? battery.station_id ?? battery.station?.id;
            const status = (battery.status || '').toString().toLowerCase();
            if (String(bStationId) === String(stationId) && status === 'full') return count + 1;
            return count;
        }, 0);
    };

    // Fetch all batteries on mount
    // Fetch mà không được thì ra chuỗi rỗng
    useEffect(() => {
        fetchAllBatteries();
    }, []);

    return (
        <BatteryContext.Provider value={{ batteries, loading, error, countAvailableBatteriesByStation }}>
            {children}
        </BatteryContext.Provider>
    );
};





