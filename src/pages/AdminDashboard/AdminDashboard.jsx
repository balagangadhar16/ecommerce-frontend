import { Link } from 'react-router-dom';
import {
  BarChart3,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  ChevronRight,
  PackagePlus,
  Trash2,
  UserCog,
  Users,
} from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import styles from './AdminDashboard.module.css';

const OPTIONS = [
  {
    title: 'Add Product',
    description: 'Create and manage new product listings',
    category: 'Catalog',
    icon: PackagePlus,
    to: '/admin/add-product',
  },
  {
    title: 'Delete Product',
    description: 'Remove products from inventory',
    category: 'Catalog',
    icon: Trash2,
    to: '/admin/delete-product',
  },
  {
    title: 'Modify User',
    description: 'Update user details and manage roles',
    category: 'Users',
    icon: UserCog,
    to: '/admin/modify-user',
  },
  {
    title: 'View User Details',
    description: 'Fetch and display details of a specific user',
    category: 'Users',
    icon: Users,
    to: '/admin/user-details',
  },
  {
    title: 'Monthly Business',
    description: 'View revenue metrics for a specific month',
    category: 'Business',
    icon: CalendarDays,
    to: '/admin/analytics/month',
  },
  {
    title: 'Day Business',
    description: 'Track daily revenue and transactions',
    category: 'Business',
    icon: CalendarClock,
    to: '/admin/analytics/day',
  },
  {
    title: 'Yearly Business',
    description: 'Analyze annual revenue performance',
    category: 'Business',
    icon: CalendarRange,
    to: '/admin/analytics/year',
  },
  {
    title: 'Overall Business',
    description: 'View total revenue since inception',
    category: 'Business',
    icon: BarChart3,
    to: '/admin/analytics/overall',
  },
];

export default function AdminDashboard() {
  return (
    <div className={styles.page}>
      <AdminHeader />

      <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Dashboard</h1>
          <p>Manage your catalog, users and business insights — all in one place.</p>
        </section>

        {/* Two-column card layout */}
        <div className={styles.grid}>
          {OPTIONS.map(({ title, description, category, icon: Icon, to }) => (
            <Link key={title} to={to} className={`${styles.card} animate-slide-up`}>
              <div className={styles.cardTop}>
                <span className={styles.icon}>
                  <Icon size={22} />
                </span>
                <span className={styles.category}>{category}</span>
              </div>
              <h2>{title}</h2>
              <p>{description}</p>
              <span className={styles.cta}>
                Open <ChevronRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
