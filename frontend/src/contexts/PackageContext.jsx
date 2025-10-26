import { createContext, useState, useEffect } from "react";
import { packageService } from "../services/packageService";

const { getAllPackages: getAllPackagesService } = packageService;

export const PackageContext = createContext();

export const PackageProvider = ({ children }) => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch all packages and update state
    const getAllPackages = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllPackagesService();
            setPackages(response);
            return response;
        } catch (err) {
            setError("Failed to fetch packages");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch a single package by id. Return the package but do NOT force state updates here
    // (avoids setState on unmounted components). Caller may choose to add it to packages if needed.
    const getPackageById = async (packageId) => {
        try {
            const response = await packageService.getPackageById(packageId);
            return response;
        } catch (err) {
            setError("Failed to fetch package");
            throw err;
        }
    };

    // Load packages on mount. Use mounted flag to avoid state updates after unmount.
    useEffect(() => {
        let mounted = true;

        const fetchPackages = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAllPackagesService();
                if (mounted) setPackages(response);
            } catch (err) {
                if (mounted) setError("Failed to fetch packages");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchPackages();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <PackageContext.Provider value={{ packages, loading, error, getAllPackages, getPackageById }}>
            {children}
        </PackageContext.Provider>
    );
};

