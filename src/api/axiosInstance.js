/* global process */
import axios from 'axios';

// Utilisez import.meta.env pour récupérer la base URL
const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem('jwt_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Ajoute automatiquement le JWT dans les headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour renouveler le token en cas de 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          return Promise.reject(error);
        }
        const refreshResponse = await axios.post(
          `${API_URL}/api/token/refresh`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const { token: newToken, refresh_token: newRefreshToken } = refreshResponse.data;
        localStorage.setItem('jwt_token', newToken);
        localStorage.setItem('refresh_token', newRefreshToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('refresh_token');
        window.location.reload(); // ou redirigez vers une page de login/erreur
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
