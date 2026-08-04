import { ShieldCheck, Sparkles, Truck } from 'lucide-react';
import Logo from '../ui/Logo';
import styles from './AuthLayout.module.css';

const FEATURES = [
  { icon: ShieldCheck, text: 'Secure & encrypted payments' },
  { icon: Truck, text: 'Fast, tracked delivery' },
  { icon: Sparkles, text: 'Hand-picked products' },
];

const STATS = [
  { value: '50K+', label: 'Happy customers' },
  { value: '4.9', label: 'Average rating' },
  { value: '24/7', label: 'Support' },
];

/**
 * Split-screen shell for auth pages: gradient brand panel + form card.
 * Collapses to a single column on mobile.
 */
export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.brand}>
        <div className={styles.glowOne} aria-hidden="true" />
        <div className={styles.glowTwo} aria-hidden="true" />

        <Logo variant="light" />

        <div className={styles.brandBody}>
          <h1 className={styles.headline}>
            Shop smarter,
            <br />
            live better.
          </h1>
          <p className={styles.tagline}>
            Discover premium products curated for modern living — with a checkout experience
            that feels effortless.
          </p>

          <ul className={styles.features}>
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className={styles.feature}>
                <span className={styles.featureIcon}>
                  <Icon size={18} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.stats} aria-hidden="true">
          {STATS.map(({ value, label }) => (
            <div key={label} className={styles.statCard}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </aside>

      <main className={styles.formSide}>
        <div className={`${styles.formCard} animate-slide-up`}>
          <div className={styles.formHeader}>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>

          {children}

          {footer && <div className={styles.formFooter}>{footer}</div>}
        </div>
      </main>
    </div>
  );
}
