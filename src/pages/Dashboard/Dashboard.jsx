import { useEffect, useState } from 'react';
import { CalendarDays, LogOut, Mail, ShieldCheck, Sparkles, User as UserIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout, refreshProfile } = useAuth();
  const { notify } = useToast();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    refreshProfile()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch(() => {
        // 401s are handled globally by the Axios interceptor (redirect to login).
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshProfile]);

  const handleLogout = () => {
    notify('info', 'You have been signed out.');
    logout();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spinner size={40} />
      </div>
    );
  }

  const joined = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} animate-slide-up`}>
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={styles.heroInfo}>
          <span className={styles.badge}>
            <Sparkles size={15} />
            Customer dashboard
          </span>
          <h1>
            Welcome, <span className={styles.gradient}>{profile?.username}</span>
          </h1>
          <p>Here is a quick look at your account.</p>
        </div>

        <div className={styles.heroAvatar} aria-hidden="true">
          {profile?.username?.charAt(0)?.toUpperCase() ?? 'U'}
        </div>
      </section>

      <div className={styles.grid}>
        {/* Profile card */}
        <section className={`${styles.card} animate-slide-up`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>
              <UserIcon size={20} />
            </span>
            <h2>Profile</h2>
          </div>

          <dl className={styles.profileList}>
            <div className={styles.profileRow}>
              <dt>
                <UserIcon size={16} />
                Username
              </dt>
              <dd>{profile?.username}</dd>
            </div>
            <div className={styles.profileRow}>
              <dt>
                <Mail size={16} />
                Email
              </dt>
              <dd>{profile?.email}</dd>
            </div>
            <div className={styles.profileRow}>
              <dt>
                <ShieldCheck size={16} />
                Role
              </dt>
              <dd>
                <span className={`${styles.roleBadge} ${profile?.role === 'ADMIN' ? styles.admin : ''}`}>
                  {profile?.role}
                </span>
              </dd>
            </div>
            <div className={styles.profileRow}>
              <dt>
                <CalendarDays size={16} />
                Member since
              </dt>
              <dd>{joined}</dd>
            </div>
          </dl>
        </section>

        {/* Session card */}
        <section className={`${styles.card} ${styles.sessionCard} animate-slide-up`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>
              <ShieldCheck size={20} />
            </span>
            <h2>Your session</h2>
          </div>
          <p className={styles.sessionText}>
            You are signed in and your account is protected. Sign out when you are done, especially
            on shared devices.
          </p>
          <Button variant="primary" size="md" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </Button>
        </section>
      </div>
    </div>
  );
}
