/**
 * Client-side validation rules and password strength scoring.
 * Kept framework-agnostic so pages and components stay thin.
 */

const RULES = {
  username: (value) => {
    const v = (value ?? '').trim();
    if (!v) return 'Username is required';
    if (v.length < 3) return 'Username must be at least 3 characters';
    if (v.length > 50) return 'Username must not exceed 50 characters';
    return '';
  },

  email: (value) => {
    const v = (value ?? '').trim();
    if (!v) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address';
    return '';
  },

  password: (value) => {
    const v = value ?? '';
    if (!v) return 'Password is required';
    if (v.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(v)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(v)) return 'Password must contain a lowercase letter';
    if (!/\d/.test(v)) return 'Password must contain a number';
    return '';
  },

  confirmPassword: (value, password) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return '';
  },
};

/**
 * @param {string} field
 * @param {*} value
 * @param {object} [allValues] Optional sibling values (used by confirmPassword).
 * @returns {string} Error message or empty string when valid.
 */
export function validateField(field, value, allValues = {}) {
  return RULES[field] ? RULES[field](value, allValues[field]) : '';
}

/**
 * Validate a whole form model. Returns an errors map keyed by field.
 * @param {object} values
 * @param {string[]} fields
 */
export function validateForm(values, fields) {
  const errors = {};
  fields.forEach((field) => {
    const message = validateField(field, values[field], values);
    if (message) errors[field] = message;
  });
  return errors;
}

/* ---------- Password strength ---------- */

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

/**
 * @param {string} password
 * @returns {{ score: number, label: string }} score is 0..4.
 */
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: STRENGTH_LABELS[0] };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;

  // Short but non-empty — keep the bar visible at "Weak"
  if (score === 0) score = 1;

  return { score, label: STRENGTH_LABELS[score] };
}
