import { createContext, useState, useEffect } from "react";
import { swapService } from "../services/swapService";
import { useNavigate } from "react-router-dom";

const { createSwapHistory: createSwapHistoryService,
    getAllSwapHistories: getAllSwapHistoriesService }
    = swapService;

export const SwapContext = createContext();

export const SwapProvider = ({ children }) => {
    const navigate = useNavigate();
    const [swapHistories, setSwapHistories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to create a new swap transaction
    const createSwapTransaction = async (swapData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await createSwapHistoryService(swapData);
            setSwapHistories((prev) => [...prev, response]);
            return response;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    // Function to fetch all swap transaction histories
    const fetchAllSwapHistories = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getAllSwapHistoriesService();
            setSwapHistories(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllSwapHistories();
    }, []);

    return (
        <SwapContext.Provider
            value={{
                swapHistories,
                loading,
                error,
                createSwapTransaction,
            }}
        >
            {children}
        </SwapContext.Provider>
    );
};
