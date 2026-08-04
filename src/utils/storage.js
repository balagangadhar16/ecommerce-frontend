const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

function getStorage(persistent) {
  return persistent ? window.localStorage : window.sessionStorage;
}

export const tokenStorage = {
  get(persistent = true) {
    return getStorage(persistent).getItem(TOKEN_KEY);
  },
  set(token, persistent = true) {
    getStorage(persistent).setItem(TOKEN_KEY, token);
  },
  remove(persistent = true) {
    getStorage(persistent).removeItem(TOKEN_KEY);
  },
};

export const userStorage = {
  get(persistent = true) {
    try {
      const raw = getStorage(persistent).getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(user, persistent = true) {
    getStorage(persistent).setItem(USER_KEY, JSON.stringify(user));
  },
  remove(persistent = true) {
    getStorage(persistent).removeItem(USER_KEY);
  },
};

/**
 * Removes auth data from both storages. Use on logout / session expiry.
 */
export function clearAuthStorage() {
  tokenStorage.remove(true);
  tokenStorage.remove(false);
  userStorage.remove(true);
  userStorage.remove(false);
}

/**
 * Read the token regardless of which storage it lives in.
 */
export function getActiveToken() {
  return tokenStorage.get(true) ?? tokenStorage.get(false);
}

/**
 * Read the cached user regardless of which storage it lives in.
 */
export function getActiveUser() {
  return userStorage.get(true) ?? userStorage.get(false);
}
