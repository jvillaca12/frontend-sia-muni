import axios from 'axios';
import UserService from 'data/services/UserService';

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Cambia esto por la URL de tu backend
  // baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Interceptor para añadir el token a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    if (UserService.isAuthenticated()) {
      const token = sessionStorage.getItem('tokenJWT');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;