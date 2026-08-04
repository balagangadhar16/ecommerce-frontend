import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { AUTH_EXPIRED_EVENT } from '../services/httpClient';
import {
  clearAuthStorage,
  getActiveToken,
  getActiveUser,
  tokenStorage,
  userStorage,
} from '../utils/storage';
import { getMsUntilExpiry } from '../utils/jwt';
import { useToast } from './useToast';

const AuthContext = createContext(null);

/**
 * Owns the authentication state for the whole app:
 * token + cached user, auto-logout on expiry, login/register/logout flows.
 * Must be rendered inside <BrowserRouter>.
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const { notify } = useToast();

  const [token, setToken] = useState(() => getActiveToken());
  const [user, setUser] = useState(() => getActiveUser());

  const handleSessionExpired = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
    notify('error', 'Your session has expired. Please sign in again.');
    navigate('/login', { replace: true });
  }, [navigate, notify]);

  // Auto-logout when the token expires.
  useEffect(() => {
    if (!token) return undefined;
    const ms = getMsUntilExpiry(token);
    if (ms <= 0) {
      handleSessionExpired();
      return undefined;
    }
    const id = setTimeout(handleSessionExpired, ms);
    return () => clearTimeout(id);
  }, [token, handleSessionExpired]);

  // React to 401s raised by the Axios response interceptor.
  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleSessionExpired);
  }, [handleSessionExpired]);

  const login = useCallback(
    async (email, password, remember = true) => {
      const data = await authService.login({ email, password });
      const profile = { username: data.username, email: data.email, role: data.role };

      tokenStorage.set(data.token, remember);
      userStorage.set(profile, remember);

      setToken(data.token);
      setUser(profile);
      return data;
    },
    [],
  );

  const register = useCallback(async (payload) => {
    return authService.register(payload);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    navigate('/', { replace: true });
  }, [navigate]);

  const refreshProfile = useCallback(async () => {
    const data = await authService.profile();
    const profile = { username: data.username, email: data.email, role: data.role };
    setUser(profile);
    // Keep the cached copy in sync with whichever storage is active.
    if (getActiveToken()) {
      userStorage.set(profile, Boolean(tokenStorage.get(true)));
    }
    return data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, token, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
