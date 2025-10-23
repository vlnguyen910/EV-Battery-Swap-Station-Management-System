import { createContext, useState, useEffect } from "react";
import { swapService } from "../services/swapService";
import { useNavigate } from "react-router-dom";

const { createSwapTransaction: createSwapTransactionService,
    getAllSwapTransactions: getAllSwapTransactionsService,
    getSwapTransactionById: getSwapTransactionByIdService,
    updateSwapTransaction: updateSwapTransactionService
}
    = swapService;

export const SwapContext = createContext();

export const SwapProvider = ({ children }) => {
    const navigate = useNavigate();
    const [swapTransaction, setSwapTransaction] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to create a new swap transaction
    const createSwapTransaction = async (swapData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await createSwapTransactionService(swapData);
            return response;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    // Function to get a swap transaction by ID
    const getSwapTransactionById = async (transactionId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSwapTransactionByIdService(transactionId);
            return response;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Function to update a swap transaction
    const updateSwapTransaction = async (transactionId, updateData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await updateSwapTransactionService(transactionId, updateData);
            setSwapTransaction([...swapTransaction, response]);
            return response;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Function to get all swap transaction histories
    const getAllSwapHistories = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getAllSwapTransactionsService();
            return response;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllSwapHistories();
    }, []);

    return (
        <SwapContext.Provider
            value={{
                loading,
                error,
                createSwapTransaction,
                getSwapTransactionById,
                getAllSwapHistories,
                updateSwapTransaction,
            }}
        >
            {children}
        </SwapContext.Provider>
    );
};
