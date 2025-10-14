import { createContext, useContext, useState, useEffect } from 'react';
import batteryService from '../services/batteryService';


const BatteryContext = createContext();

export const BatteryProvider = ({ children }) => {
    const [batteries, setBatteries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Real-time battery updates every 5 seconds
    useEffect(() => {
        const updateBatteries = async () => {
            try {
                const response = await batteryService.getAllBatteries();
                setBatteries(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        // Initial load
        updateBatteries();

        // Update every 5 seconds for real-time charging simulation
        const interval = setInterval(updateBatteries, 5000);

        return () => clearInterval(interval);
    }, []);

    const value = {
        batteries,
        loading,
        error,
        setBatteries,
        setLoading,
        setError,
        refreshBatteries: async () => {
            setLoading(true);
            try {
                const response = await batteryService.getAllBatteries();
                setBatteries(response.data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <BatteryContext.Provider value={value}>
            {children}
        </BatteryContext.Provider>
    );
};

// Custom hook
export const useBattery = () => {
    const context = useContext(BatteryContext);
    if (!context) {
        throw new Error('useBattery must be used within BatteryProvider');
    }
    return context;
};