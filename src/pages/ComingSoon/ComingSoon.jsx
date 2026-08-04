import { Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import styles from './ComingSoon.module.css';

/**
 * Placeholder for modules that are not built yet (products, cart, ...).
 * Keeps navigation functional without shipping unfinished features.
 */
export default function ComingSoon() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.icon}>
          <Construction size={40} />
        </span>
        <h1>Coming soon</h1>
        <p>This section is under construction. Check back shortly!</p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
