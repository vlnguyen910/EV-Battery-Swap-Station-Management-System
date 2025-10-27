// Constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout", // backend chưa có
    REFRESH: "/auth/refresh",
  },

  USER: {
    CREATE_USER: "/users",
    GET_ALL_USERS: "/users",
    GET_USER: (id) => `/users/${id}`,
    UPDATE_USER: (id) => `/users/${id}`,
    DELETE_USER: (id) => `/users/${id}`,
  },

  VEHICLE: {
    CREATE_VEHICLE: "/vehicles",
    GET_ALL_VEHICLES: "/vehicles",
    GET_VEHICLE_BY_VIN: (vin) => `/vehicles/vin/${vin}`,
    GET_VEHICLES_BY_USER: (userId) => `/vehicles/user/${userId}`,
    GET_VEHICLE: (id) => `/vehicles/${id}`,
    UPDATE_VEHICLE: (id) => `/vehicles/${id}`,
    DELETE_VEHICLE: (id) => `/vehicles/${id}`,
  },

  STATION: {
    CREATE_STATION: "/stations",
    GET_ALL_STATIONS: "/stations",
    GET_ACTIVE_STATIONS: "/stations/active",
    GET_AVAILABLE_STATIONS: "/stations/available",
    GET_SEARCH_STATIONS: "/stations/search",
    GET_STATION: (id) => `/stations/${id}`,
    UPDATE_STATION: (id) => `/stations/${id}`,
    DELETE_STATION: (id) => `/stations/${id}`,
  },

  BATTERY: {
    CREATE_BATTERY: "/batteries",
    GET_ALL_BATTERIES: "/batteries",
    GET_BEST_BATTERIES: "/batteries/best",
    GET_BATTERY: (id) => `/batteries/${id}`,
    DELETE_BATTERY: (id) => `/batteries/${id}`,
  },

  BATTERY_SERVICE_PACKAGE: {
    CREATE_PACKAGE: "/battery-service-packages",
    GET_ALL_PACKAGES: "/battery-service-packages",
    GET_ACTIVE_PACKAGES: "/battery-service-packages/active",
    GET_BY_PRICE_RANGE: "/battery-service-packages/price-range",
    GET_BY_DURATION: (days) => `/battery-service-packages/duration/${days}`,
    GET_BY_NAME: (name) => `/battery-service-packages/name/${name}`,
    GET_PACKAGE_BY_ID: (id) => `/battery-service-packages/${id}`,
    UPDATE_PACKAGE: (id) => `/battery-service-packages/${id}`,
    ACTIVATE_PACKAGE: (id) => `/battery-service-packages/${id}/activate`,
    DEACTIVATE_PACKAGE: (id) => `/battery-service-packages/${id}/deactivate`,
    DELETE_PACKAGE: (id) => `/battery-service-packages/${id}`,
  },

  RESERVATION: {
    GET_RESERVATION_BY_STATION_ID: (stationId) =>
      `/reservations/station/${stationId}`,
    CREATE_RESERVATION: "/reservations",
    GET_BY_USER: (userId) => `/reservations/user/${userId}`,
    GET_RESERVATION: (id) => `/reservations/${id}`,
    UPDATE_RESERVATION: (id) => `/reservations/${id}`,
    DELETE_RESERVATION: (id) => `/reservations/${id}`,
  },

  SUBSCRIPTION: {
    CREATE_SUBSCRIPTION: "/subscriptions",
    GET_ALL_SUBSCRIPTIONS: "/subscriptions",
    GET_SUBSCRIPTION: (id) => `/subscriptions/${id}`,
    GET_BY_USER: (userId) => `/subscriptions/user/${userId}`,
    GET_ACTIVE_BY_USER: (userId) => `/subscriptions/user/${userId}/active`,
    CHECK_EXPIRED: "/subscriptions/check-expired",
    UPDATE_SUBSCRIPTION: (id) => `/subscriptions/${id}`,
    CANCEL_SUBSCRIPTION: (id) => `/subscriptions/${id}/cancel`,
    INCREMENT_SWAP: (id) => `/subscriptions/${id}/increment-swap`,
    DELETE_SUBSCRIPTION: (id) => `/subscriptions/${id}`,
  },

  SWAP_TRANSACTION: {
    CREATE_TRANSACTION: "/swap-transactions",
    GET_ALL_TRANSACTIONS: "/swap-transactions",
    GET_BY_USER: (userId) => `/swap-transactions/user/${userId}`,
    GET_TRANSACTION_BY_ID: (id) => `/swap-transactions/transaction/${id}`,
    UPDATE_TRANSACTION: (id) => `/swap-transactions/${id}`,
    DELETE_TRANSACTION: (id) => `/swap-transactions/${id}`,
  },

  PAYMENT: {
    CREATE_VNPAY_URL: "/payments/create-vnpay-url",
    VNPAY_RETURN: "/payments/vnpay-return",
    VNPAY_IPN: "/payments/vnpay-ipn",
    GET_PAYMENT: (id) => `/payments/${id}`,
    GET_BY_TXN_REF: (vnpTxnRef) => `/payments/txn/${vnpTxnRef}`,
    GET_BY_USER: (userId) => `/payments/user/${userId}`,
    GET_ALL_PAYMENTS: "/payments",
    MOCK_PAYMENT: "/payments/mock-payment",
  },

  SWAPPING: {
    AUTOMATIC_SWAP: "/swapping/automatic-swap",
    INITIALIZE_BATTERY: "/swapping/initialize-battery",
  },

  SUPPORT: {
    CREATE_SUPPORT: "/supports",
    GET_ALL_SUPPORTS: "/supports",
    GET_STATISTICS: "/supports/statistics",
    GET_BY_USER: (userId) => `/supports/user/${userId}`,
    GET_BY_STATION: (stationId) => `/supports/station/${stationId}`,
    GET_BY_STATUS: (status) => `/supports/status/${status}`,
    GET_SUPPORT: (id) => `/supports/${id}`,
    UPDATE_SUPPORT: (id) => `/supports/${id}`,
    UPDATE_STATUS: (id) => `/supports/${id}/status`,
    UPDATE_RATING: (id) => `/supports/${id}/rating`,
    DELETE_SUPPORT: (id) => `/supports/${id}`,
  },
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  USER_PROFILE: "/user/profile",

  USER: "/user",
  ADMIN: "/admin",
  GUEST: "/guest",
  STAFF: "/staff",

  NOT_FOUND: "/404",
  UNAUTHORIZED: "/unauthorized",
};
