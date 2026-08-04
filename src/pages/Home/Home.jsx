import { Link } from 'react-router-dom';
import { ArrowRight, Headset, PackageSearch, ShieldCheck, Truck } from 'lucide-react';

import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

import styles from './Home.module.css';

const PERKS = [
  { icon: Truck, title: 'Free shipping', text: 'On all orders over $50' },
  { icon: ShieldCheck, title: 'Buyer protection', text: 'Shop with total confidence' },
  { icon: Headset, title: '24/7 support', text: 'We are here whenever you need' },
];

const CATEGORIES = [
  { label: 'Electronics', gradient: 'linear-gradient(135deg,#1e3a8a,#4f46e5)' },
  { label: 'Fashion', gradient: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
  { label: 'Home & Living', gradient: 'linear-gradient(135deg,#0f766e,#14b8a6)' },
  { label: 'Accessories', gradient: 'linear-gradient(135deg,#b45309,#f59e0b)' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <PackageSearch size={15} />
            New season collection is live
          </span>
          <h1 className={styles.title}>
            Everything you love,
            <br />
            <span className={styles.gradient}>delivered to you.</span>
          </h1>
          <p className={styles.subtitle}>
            Explore a curated catalog of premium products with effortless checkout, secure
            payments, and lightning-fast delivery.
          </p>
          <div className={styles.ctaRow}>
            <Link to="/products">
              <Button variant="primary" size="lg">
                Shop now
                <ArrowRight size={18} />
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/register">
                <Button variant="ghost" size="lg">
                  Create account
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Floating mock card */}
        <div className={styles.heroArt} aria-hidden="true">
          <div className={styles.mockCard}>
            <div className={styles.mockTop} />
            <div className={styles.mockBody}>
              <div className={styles.mockLineWide} />
              <div className={styles.mockLine} />
              <div className={styles.mockCta} />
            </div>
            <div className={styles.mockBadge}>
              <strong>4.9</strong>
              <span>★ rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className={styles.perks}>
        {PERKS.map(({ icon: Icon, title, text }) => (
          <div key={title} className={styles.perk}>
            <span className={styles.perkIcon}>
              <Icon size={22} />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Category preview */}
      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>Shop by category</h2>
        <div className={styles.categoryGrid}>
          {CATEGORIES.map(({ label, gradient }) => (
            <div key={label} className={styles.categoryCard} style={{ background: gradient }}>
              <span>{label}</span>
              <ArrowRight size={20} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
