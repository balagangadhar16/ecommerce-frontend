import httpClient from './httpClient';
import { clearAuthStorage } from '../utils/storage';

/**
 * Backend auth endpoints.
 * All methods return the resolved Axios response `.data` for convenience.
 */
export const authService = {
  async login({ email, password }) {
    const { data } = await httpClient.post('/api/auth/login', { email, password });
    return data; // { token, username, email, role }
  },

  async register(payload) {
    const { data } = await httpClient.post('/api/auth/register', payload);
    return data; // { id, username, email, role, createdAt }
  },

  async profile() {
    const { data } = await httpClient.get('/api/auth/profile');
    return data; // { id, username, email, role, createdAt }
  },

  /**
   * JWT auth is stateless on the backend, so logout is purely client-side:
   * drop the stored token + cached user.
   */
  logout() {
    clearAuthStorage();
  },
};
