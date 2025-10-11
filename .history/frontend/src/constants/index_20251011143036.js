// Constants
export const API_BASE_URL = "http://localhost:8080/api/v1";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USER: {
    GET_PROFILE: (id) => `/users/${id}`,
    UPDATE_PROFILE: (id) => `/users/${id}`,
    // Admin and Staff only
    GET_ALL_USERS: "/users",
    DELETE_USER: (id) => `/users/${id}`,
  },
  VEHICLE: {
    CREATE_VEHICLE: "/vehicles",
    GET_ALL_VEHICLES: "/vehicles",
    GET_VEHICLE_BY_VIN: (vin) => `/vehicles/${vin}`,
    GET_VEHICLE: (id) => `/vehicles/${id}`,
    UPDATE_VEHICLE: (id) => `/vehicles/${id}`,
    DELETE_VEHICLE: (id) => `/vehicles/${id}`,
  },
  STATION: {
    CREATE_STATION: "/stations",
    GET_ALL_STATIONS: "/stations",
    GET_ACTIVE_STATION: `/stations/active`, // available stations có giống v kh ???
    GET_SEARCH_STATION: `/stations/search`,
    GET_STATION: (id) => `/stations/${id}`,
    UPDATE_STATION: (id) => `/stations/${id}`,
    DELETE_STATION: (id) => `/stations/${id}`,
  },
  BATTERY: {
    CREATE_BATTERY: "/batteries",
    GET_ALL_BATTERIES: "/batteries",
    GET_BEST_BATTERIES: `/batteries/best`,
    GET_BATTERY_BY_ID: (id) => `/batteries/${id}`,
    UPDATE_BATTERY: (id) => `/batteries/${id}`,
    DELETE_BATTERY: (id) => `/batteries/${id}`,
  },
  RESERVATION: {
    CREATE_RESERVATION: "/reservations",
    GET_ALL_RESERVATIONS: "/reservations",
    GET_RESERVATIONS: (id) => `/reservations/user/${id}`,
    UPDATE_RESERVATION: (id) => `/reservations/${id}`,
    DELETE_RESERVATION: (id) => `/reservations/${id}`,
  },
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  USER_PROFILE: "/user/profile",

  // Main role-based pages
  USER: "/user",
  ADMIN: "/admin",
  GUEST: "/guest",
  STAFF: "/staff",

  // Error / State pages
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/unauthorized",
};

//final commit
