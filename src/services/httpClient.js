import axios from 'axios';
import { clearAuthStorage, getActiveToken } from '../utils/storage';

/**
 * Event fired when the backend rejects a token (expired / invalid).
 * The AuthProvider listens for it and redirects to /login.
 */
export const AUTH_EXPIRED_EVENT = 'auth:unauthorized';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT to every authenticated request.
httpClient.interceptors.request.use(
  (config) => {
    const token = getActiveToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle expired/invalid tokens globally: clear storage + notify the app.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const originalUrl = error.config?.url ?? '';
      // Ignore 401s raised by the login/register endpoints themselves.
      const isAuthCall = originalUrl.includes('/api/auth/login') || originalUrl.includes('/api/auth/register');
      if (!isAuthCall) {
        clearAuthStorage();
        window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
      }
    }
    return Promise.reject(error);
  },
);

export default httpClient;
