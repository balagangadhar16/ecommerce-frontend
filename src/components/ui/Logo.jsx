import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

/**
 * Brand mark used in the navbar and auth screens.
 */
export default function Logo({ variant = 'dark' }) {
  return (
    <Link to="/" className={`${styles.logo} ${styles[variant]}`} aria-label="Shoply home">
      <span className={styles.mark}>
        <ShoppingBag size={20} strokeWidth={2.4} />
      </span>
      <span className={styles.word}>Shoply</span>
    </Link>
  );
}
