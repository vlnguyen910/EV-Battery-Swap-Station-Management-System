import { createContext, useState, useEffect, use } from "react";
import { packageService } from "../services/packageService";
import { fi } from "zod/v4/locales";

const { getAllPackages: getAllPackagesService } = packageService;

export const PackageContext = createContext();

export const PackageProvider = ({ children }) => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch all packages
    const fetchPackages = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllPackagesService();
            setPackages(response);
        } catch (error) {
            setError("Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    };

    fetchPackages();

    useEffect(() => {
        fetchPackages();
    }, []);

    return (
        <PackageContext.Provider value={{ packages, loading, error }}>
            {children}
        </PackageContext.Provider>
    );

};

