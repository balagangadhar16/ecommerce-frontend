/**
 * Minimal JWT helpers — no external dependency.
 * Decodes the payload to surface `exp` so we can schedule logout
 * before the server actually rejects the token.
 */

function base64UrlDecode(input) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const decoded = window.atob(padded);
  return decodeURIComponent(
    decoded
      .split('')
      .map((char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
}

/**
 * @param {string} token
 * @returns {object|null} Decoded JWT payload, or null when invalid.
 */
export function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
}

/**
 * @param {string} token
 * @returns {number} Milliseconds until the token expires (negative when expired).
 */
export function getMsUntilExpiry(token) {
  const payload = decodeToken(token);
  if (!payload?.exp) return 0;
  return payload.exp * 1000 - Date.now();
}

/**
 * @param {string} token
 * @returns {boolean} True when the token is missing or already expired.
 */
export function isTokenExpired(token) {
  return getMsUntilExpiry(token) <= 0;
}
