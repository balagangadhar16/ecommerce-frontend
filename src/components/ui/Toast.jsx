import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

/**
 * Renders the toast stack (top-right). Dismissed automatically by
 * ToastProvider, or manually via the close button.
 */
export function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className={styles.viewport} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] ?? Info;
        return (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]}`}
            role="status"
          >
            <Icon className={styles.icon} size={20} aria-hidden="true" />
            <span className={styles.message}>{toast.message}</span>
            <button
              className={styles.close}
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
