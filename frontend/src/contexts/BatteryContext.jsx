import { createContext, useState, useEffect } from "react";
import { batteryService } from "../services/batteryService";
import { useNavigate } from "react-router-dom";

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
            setBatteries(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    //Function để đếm toàn bộ pin có trạng thái 'full' by stationId
    const countAvailableBatteriesByStation = (stationId) => {
    if (!stationId || !batteries.length) return 0;
    
    return batteries.filter(
      (battery) => 
        battery.station_id === stationId && 
        (battery.status === "full" || battery.status === "charging")
    ).length;
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





