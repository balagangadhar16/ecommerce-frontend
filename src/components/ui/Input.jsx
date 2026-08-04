import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

/**
 * Labeled input with optional leading icon and password visibility toggle.
 */
export default function Input({
  label,
  type = 'text',
  icon: Icon,
  error,
  id,
  className = '',
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const classes = [styles.field, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}

      <div className={`${styles.control} ${error ? styles.invalid : ''}`}>
        {Icon && <Icon className={styles.icon} size={18} aria-hidden="true" />}
        <input id={id} type={resolvedType} className={styles.input} {...rest} />

        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
