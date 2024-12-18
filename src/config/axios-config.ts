import axios from 'axios';
import UserService from 'data/services/UserService';

const axiosInstance = axios.create({
  baseURL: 'https://sia-muni-web-latest.onrender.com',
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
