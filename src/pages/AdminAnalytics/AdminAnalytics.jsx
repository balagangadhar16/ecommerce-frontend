import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  PackageCheck,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import { getApiError } from '../../utils/errorParser';
import { formatCurrencyExact } from '../../utils/formatters';
import styles from './AdminAnalytics.module.css';

const MODES = {
  day: {
    title: 'Day Business',
    description: 'Track daily revenue and transactions.',
    icon: CalendarClock,
    param: 'date',
  },
  month: {
    title: 'Monthly Business',
    description: 'View revenue metrics for a specific month.',
    icon: CalendarDays,
    param: 'month',
  },
  year: {
    title: 'Yearly Business',
    description: 'Analyze annual revenue performance.',
    icon: CalendarRange,
    param: 'year',
  },
  overall: {
    title: 'Overall Business',
    description: 'View total revenue since inception.',
    icon: BarChart3,
    param: null,
  },
};

function todayISODate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function AdminAnalytics({ mode = 'day' }) {
  const navigate = useNavigate();
  const { notify } = useToast();
  const config = MODES[mode] ?? MODES.day;
  const Icon = config.icon;

  const [value, setValue] = useState(mode === 'day' ? todayISODate() : mode === 'month' ? currentMonth() : String(new Date().getFullYear()));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(mode === 'overall');
  const [error, setError] = useState(null);

  const load = useCallback(
    async (overrideValue) => {
      setLoading(true);
      setError(null);
      try {
        const selected = overrideValue ?? value;
        const data =
          mode === 'day'
            ? await adminService.getDayBusiness(selected)
            : mode === 'month'
              ? await adminService.getMonthBusiness(selected)
              : mode === 'year'
                ? await adminService.getYearBusiness(selected)
                : await adminService.getOverallBusiness();
        setResult(data);
      } catch (e) {
        setResult(null);
        setError(getApiError(e).message);
      } finally {
        setLoading(false);
      }
    },
    [mode, value],
  );

  useEffect(() => {
    if (mode === 'overall') {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleSubmit = (event) => {
    event.preventDefault();
    load();
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
          <span className={styles.icon}>
            <Icon size={22} />
          </span>
          <div>
            <h1>{config.title}</h1>
            <p>{config.description}</p>
          </div>
        </section>

        {mode !== 'overall' && (
          <form onSubmit={handleSubmit} className={styles.controls}>
            <div className={styles.controlField}>
              <label className={styles.label} htmlFor="period">
                {mode === 'day' ? 'Date' : mode === 'month' ? 'Month' : 'Year'}
              </label>
              <input
                id="period"
                type={mode === 'year' ? 'number' : mode === 'month' ? 'month' : 'date'}
                min={mode === 'year' ? '2000' : undefined}
                max={mode === 'year' ? String(new Date().getFullYear()) : undefined}
                className={styles.input}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className={styles.controlAction}>
              <Button type="submit" variant="primary" loading={loading}>
                <TrendingUp size={16} />
                View report
              </Button>
            </div>
          </form>
        )}

        {loading ? (
          <div className={styles.center}>
            <Spinner size={40} />
          </div>
        ) : error ? (
          <div className={styles.state}>
            <BarChart3 size={44} />
            <h2>Could not load report</h2>
            <p>{error}</p>
            <Button variant="primary" onClick={() => load()}>
              <RefreshCw size={16} />
              Retry
            </Button>
          </div>
        ) : result ? (
          <div className={styles.report}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>
                <CalendarRange size={20} />
              </span>
              <span className={styles.statLabel}>Period</span>
              <strong>{result.period}</strong>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statIcon}>
                <PackageCheck size={20} />
              </span>
              <span className={styles.statLabel}>Total Orders</span>
              <strong>{result.totalOrders}</strong>
            </div>

            <div className={`${styles.statCard} ${styles.revenue}`}>
              <span className={styles.statIcon}>
                <TrendingUp size={20} />
              </span>
              <span className={styles.statLabel}>Total Revenue</span>
              <strong>{formatCurrencyExact(result.totalRevenue)}</strong>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
