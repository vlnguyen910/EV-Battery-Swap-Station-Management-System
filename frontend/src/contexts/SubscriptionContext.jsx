import { createContext, useState, useCallback } from "react";
import { subscriptionService } from "../services/subscriptionService";

const {
  getAllSubscriptions: getAllSubscriptionsService,
  getSubscriptionById: getSubscriptionByIdService,
  getSubscriptionsByUserId: getSubscriptionsByUserIdService,
  getActiveSubscriptionByUserId: getActiveSubscriptionByUserIdService,
  createSubscription: createSubscriptionService,
  updateSubscription: updateSubscriptionService,
  cancelSubscription: cancelSubscriptionService,
  checkExpiredSubscriptions: checkExpiredSubscriptionsService,
  incrementSwapCount: incrementSwapCountService,
} = subscriptionService;

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all subscriptions
  const fetchAllSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllSubscriptionsService();
      setSubscriptions(data);
      return data;
    } catch (err) {
      console.error("fetchAllSubscriptions error", err);
      setError("Failed to fetch subscriptions");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get subscription by ID
  const getSubscriptionById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSubscriptionByIdService(id);
      return data;
    } catch (err) {
      console.error("getSubscriptionById error", err);
      setError("Failed to fetch subscription");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get subscriptions by user ID
  const getSubscriptionsByUserId = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSubscriptionsByUserIdService(userId);
      setSubscriptions(data);
      return data;
    } catch (err) {
      console.error("getSubscriptionsByUserId error", err);
      setError("Failed to fetch user subscriptions");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get active subscription by user ID
  const getActiveSubscription = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActiveSubscriptionByUserIdService(userId);
      setActiveSubscription(data);
      return data;
    } catch (err) {
      console.error("getActiveSubscription error", err);
      setError("Failed to fetch active subscription");
      setActiveSubscription(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create subscription
  const createSubscription = async (subscriptionData) => {
    setLoading(true);
    setError(null);
    try {
      const newSubscription = await createSubscriptionService(subscriptionData);
      setSubscriptions((prev) => [...prev, newSubscription]);
      return newSubscription;
    } catch (err) {
      console.error("createSubscription error", err);
      setError("Failed to create subscription");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update subscription
  const updateSubscription = async (id, subscriptionData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateSubscriptionService(id, subscriptionData);
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.subscription_id === id ? updated : sub))
      );
      if (activeSubscription?.subscription_id === id) {
        setActiveSubscription(updated);
      }
      return updated;
    } catch (err) {
      console.error("updateSubscription error", err);
      setError("Failed to update subscription");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const cancelled = await cancelSubscriptionService(id);
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.subscription_id === id ? cancelled : sub))
      );
      if (activeSubscription?.subscription_id === id) {
        setActiveSubscription(null);
      }
      return cancelled;
    } catch (err) {
      console.error("cancelSubscription error", err);
      setError("Failed to cancel subscription");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check expired subscriptions
  const checkExpiredSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await checkExpiredSubscriptionsService();
      return result;
    } catch (err) {
      console.error("checkExpiredSubscriptions error", err);
      setError("Failed to check expired subscriptions");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Increment swap count
  const incrementSwapCount = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await incrementSwapCountService(id);
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.subscription_id === id ? updated : sub))
      );
      if (activeSubscription?.subscription_id === id) {
        setActiveSubscription(updated);
      }
      return updated;
    } catch (err) {
      console.error("incrementSwapCount error", err);
      setError("Failed to increment swap count");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        activeSubscription,
        loading,
        error,
        fetchAllSubscriptions,
        getSubscriptionById,
        getSubscriptionsByUserId,
        getActiveSubscription,
        createSubscription,
        updateSubscription,
        cancelSubscription,
        checkExpiredSubscriptions,
        incrementSwapCount,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
