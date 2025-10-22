import { createContext, useState, useEffect } from "react";
//import service tùy theo dịch vụ
import { vehicleService } from "../services/vehicleService";
import { useNavigate } from "react-router-dom";

const { getAllVehicles: getAllVehiclesService,
    getVehicleById: getVehicleByIdService,
    getVehicleByVin: getVehicleByVinService
} = vehicleService;

export const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //function to fetch all vehicles
    const fetchAllVehicles = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllVehiclesService();
            setVehicles(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    

    //function to fetch vehicle by VIN
    const fetchVehicleByVin = async (vin) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getVehicleByVinService(vin);
            setVehicles([response.data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all vehicles on mount
    useEffect(() => {
        fetchAllVehicles();
    }, []);

    return (
        <VehicleContext.Provider value={{ vehicles, loading, error, fetchAllVehicles, fetchVehicleByVin }}>
            {children}
        </VehicleContext.Provider>
    );
};
