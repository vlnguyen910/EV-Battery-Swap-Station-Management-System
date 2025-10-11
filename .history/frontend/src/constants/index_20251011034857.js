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
  },
  ADMIN: {
    GET_ALL_USERS: "/users",
    DELETE_USER: `/users/${(id) => id}`,
  },
  Vehicle: {
    CREATE_VEHICLE: "/vehicles",
    GET_ALL_VEHICLES: "/vehicles",
    GET_VEHICLE: `/vehicles/${(vin) => vin}`,
    UPDATE_VEHICLE: `/vehicles/${(id) => id}`,
    DELETE_VEHICLE: `/vehicles/${(id) => id}`,
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
