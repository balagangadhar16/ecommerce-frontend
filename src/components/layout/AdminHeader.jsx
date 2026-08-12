import { Link } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import styles from './AdminHeader.module.css';

/**
 * Standalone admin header: brand, admin indicator, identity and logout.
 * Shared by the admin dashboard and every admin sub-page.
 */
export default function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link to="/admin/dashboard" aria-label="Back to admin dashboard">
          <Logo />
        </Link>
        <span className={styles.adminIndicator}>
          <ShieldCheck size={15} />
          Admin Dashboard
        </span>
      </div>

      <div className={styles.session}>
        <span className={styles.adminUser}>{user?.username}</span>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  );
}
