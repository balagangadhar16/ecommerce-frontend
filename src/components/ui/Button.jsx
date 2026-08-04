import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

/**
 * Primary interactive control with a material-style ripple effect.
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  ...rest
}) {
  const handleClick = (event) => {
    if (loading || disabled) return;
    spawnRipple(event);
    onClick?.(event);
  };

  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-busy={loading}
      {...rest}
    >
      {loading && <Loader2 className={styles.spinner} size={18} aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}

function spawnRipple(event) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  const ripple = document.createElement('span');
  ripple.className = 'ripple-ink';
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

  target.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 650);
}
