import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LogOut, Menu, ShoppingCart, X } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Logo />

        {/* Desktop links */}
        <ul className={styles.links}>
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                {Icon && <Icon size={17} aria-hidden="true" />}
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${styles.profile} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.avatar}>
                  {user?.username?.charAt(0)?.toUpperCase() ?? 'U'}
                </span>
                <span className={styles.profileName}>{user?.username}</span>
              </NavLink>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile panel */}
      {menuOpen && (
        <div className={styles.mobilePanel}>
          <ul className={styles.mobileLinks}>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} end={to === '/'} onClick={closeMenu} className={styles.mobileLink}>
                  {label}
                </NavLink>
              </li>
            ))}
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink to="/dashboard" onClick={closeMenu} className={styles.mobileLink}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    className={`${styles.mobileLink} ${styles.mobileLogout}`}
                    onClick={() => {
                      closeMenu();
                      logout();
                    }}
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className={styles.mobileAuth}>
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="ghost" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button variant="primary" fullWidth>
                    Register
                  </Button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
