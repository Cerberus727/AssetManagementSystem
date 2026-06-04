import api from "./api";

/**
 * Login User
 */
export const login = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data;
};

/**
 * Register User
 */
export const register = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};

/**
 * Logout User
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Save Auth Data
 */
export const saveAuth = (data) => {
  localStorage.setItem(
    "token",
    data.token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );
};

/**
 * Get Current User
 */
export const getCurrentUser = () => {
  const user =
    localStorage.getItem("user");

  return user
    ? JSON.parse(user)
    : null;
};

/**
 * Get Token
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Check Login Status
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(
    "token"
  );
};