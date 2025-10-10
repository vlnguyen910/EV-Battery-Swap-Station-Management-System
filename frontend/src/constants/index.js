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
    GET_PROFILE: `/users/${(id) => id}`, // dynamic endpoint
    UPDATE_PROFILE: `/users/${(id) => id}`,
    // Admin and Staff only
    GET_ALL_USERS: "/users",
    DELETE_USER: `/users/${(id) => id}`,
  },
  VEHICLE: {
    CREATE_VEHICLE: "/vehicles",
    GET_ALL_VEHICLES: "/vehicles",
    GET_VEHICLE_BY_VIN: `/vehicles/${(vin) => vin}`,
    GET_VEHICLE: `/vehicles/${(id) => id}`,
    UPDATE_VEHICLE: `/vehicles/${(id) => id}`,
    DELETE_VEHICLE: `/vehicles/${(id) => id}`,
  },
  STATION: {
    CREATE_STATION: "/stations",
    GET_ALL_STATIONS: "/stations",
    GET_ACTIVE_STATION: `/stations/active`, // available stations có giống v kh ???
    GET_SEARCH_STATION: `/stations/search`,
    GET_STATION: `/stations/${(id) => id}`,
    UPDATE_STATION: `/stations/${(id) => id}`,
    DELETE_STATION: `/stations/${(id) => id}`,
  },
  BATTERY: {
    CREATE_BATTERY: "/batteries",
    GET_ALL_BATTERIES: "/batteries",
    GET_BEST_BATTERIES: `/batteries/best`,
    GET_BATTERY_BY_ID: `/batteries/${(id) => id}`,
    UPDATE_BATTERY: `/batteries/${(id) => id}`,
    DELETE_BATTERY: `/batteries/${(id) => id}`,
  },
  RESERVATION: {
    CREATE_RESERVATION: "/reservations",
    GET_ALL_RESERVATIONS: "/reservations",
    GET_RESERVATIONS: `/reservations/user/${(id) => id}`,
    UPDATE_RESERVATION: `/reservations/${(id) => id}`,
    DELETE_RESERVATION: `/reservations/${(id) => id}`,
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
