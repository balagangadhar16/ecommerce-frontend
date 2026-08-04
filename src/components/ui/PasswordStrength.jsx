import { getPasswordStrength } from '../../utils/validators';
import styles from './PasswordStrength.module.css';

/**
 * Segmented password-strength bar with a live label.
 * Uses the rules from utils/validators (length, cases, digits, symbols).
 */
export default function PasswordStrength({ password }) {
  const { score, label } = getPasswordStrength(password);
  const levels = [1, 2, 3, 4];

  return (
    <div className={styles.wrapper} aria-live="polite">
      <div className={styles.bar} aria-hidden="true">
        {levels.map((level) => (
          <span
            key={level}
            className={`${styles.segment} ${level <= score ? styles[`level${score}`] : ''}`}
          />
        ))}
      </div>
      <span className={`${styles.label} ${score > 0 ? styles[`level${score}`] : ''}`}>
        {password ? label : 'Password strength'}
      </span>
    </div>
  );
}
