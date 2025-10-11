// Constants
export const API_BASE_URL = "http://localhost:8080/api/v1";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    // REFRESH: "/auth/refresh-token",
  },
  USER: {
    GET_PROFILE: "/users/{id}",
    UPDATE_PROFILE: "/users/update",
  },
  // STATION: {
  //   LIST: "/stations",
  //   DETAIL: (id) => `/stations/${id}`, // dynamic endpoint
  // },
  // BATTERY: {
  //   LIST: "/batteries",
  //   DETAIL: (id) => `/batteries/${id}`,
  // },
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
