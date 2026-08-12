import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Mail, Search, ShieldCheck, User as UserIcon } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import { getApiError } from '../../utils/errorParser';
import styles from './AdminUserDetails.module.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function AdminUserDetails() {
  const navigate = useNavigate();
  const { notify } = useToast();

  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userId.trim()) {
      notify('error', 'Please enter a user ID');
      return;
    }

    setLoading(true);
    setUser(null);
    setNotFound(false);
    try {
      const data = await adminService.getUser(Number(userId));
      setUser(data);
    } catch (e) {
      setUser(null);
      setNotFound(getApiError(e).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <AdminHeader />

      <main className={styles.main}>
        <button type="button" className={styles.backLink} onClick={() => navigate('/admin/dashboard')}>
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        <section className={styles.intro}>
          <h1>View User Details</h1>
          <p>Fetch and display details of a specific user.</p>
        </section>

        <div className={styles.panel}>
          <form onSubmit={handleSubmit} className={styles.lookupRow}>
            <Input
              id="userId"
              label="User ID"
              type="number"
              min="1"
              placeholder="e.g. 7"
              icon={Search}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <div className={styles.lookupAction}>
              <Button type="submit" variant="primary" loading={loading}>
                View details
              </Button>
            </div>
          </form>

          {loading && (
            <div className={styles.center}>
              <Spinner size={36} />
            </div>
          )}

          {!loading && notFound && (
            <div className={styles.notFound} role="alert">
              {notFound}
            </div>
          )}

          {!loading && user && (
            <div className={styles.details}>
              <div className={styles.identity}>
                <span className={styles.avatar}>
                  {user.username?.charAt(0)?.toUpperCase() ?? 'U'}
                </span>
                <div>
                  <h2>{user.username}</h2>
                  <span className={`${styles.roleBadge} ${user.role === 'ADMIN' ? styles.admin : styles.customer}`}>
                    <ShieldCheck size={13} />
                    {user.role}
                  </span>
                </div>
              </div>

              <dl className={styles.info}>
                <div>
                  <dt>User ID</dt>
                  <dd>{user.id}</dd>
                </div>
                <div>
                  <dt>
                    <UserIcon size={14} />
                    Username
                  </dt>
                  <dd>{user.username}</dd>
                </div>
                <div>
                  <dt>
                    <Mail size={14} />
                    Email
                  </dt>
                  <dd>{user.email}</dd>
                </div>
                <div>
                  <dt>
                    <CalendarDays size={14} />
                    Member since
                  </dt>
                  <dd>{formatDate(user.createdAt)}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
