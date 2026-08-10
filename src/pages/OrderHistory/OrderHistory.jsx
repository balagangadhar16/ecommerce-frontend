import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, PackageSearch } from 'lucide-react';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { orderService } from '../../services/orderService';
import { getApiError } from '../../utils/errorParser';
import { formatCurrency } from '../../utils/formatters';
import styles from './OrderHistory.module.css';

const STATUS_TONES = {
  PENDING: styles.pending,
  CONFIRMED: styles.confirmed,
  PROCESSING: styles.processing,
  SHIPPED: styles.shipped,
  DELIVERED: styles.delivered,
  CANCELLED: styles.cancelled,
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    orderService
      .getOrderHistory()
      .then((data) => {
        const products = data?.orders?.products;
        setOrders(Array.isArray(products) ? products : []);
      })
      .catch((e) => {
        setError(getApiError(e).message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.center}>
        <div className={styles.emptyState}>
          <PackageSearch size={44} />
          <h1>Could not load your orders</h1>
          <p>{error}</p>
          <div className={styles.emptyActions}>
            <Button variant="primary" onClick={loadOrders}>
              Try again
            </Button>
            <Link to="/products">
              <Button variant="ghost">Browse products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1>Your Orders</h1>
          <p>Track everything you have purchased.</p>
        </div>
        <div className={styles.center}>
          <div className={styles.emptyState}>
            <PackageSearch size={44} />
            <h2>No orders yet</h2>
            <p>When you complete a purchase, your order history will appear here.</p>
            <Link to="/products">
              <Button variant="primary">Start shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Group product rows by order, preserving newest-first and line order.
  const grouped = orders.reduce((groups, item) => {
    if (!groups.has(item.orderId)) {
      groups.set(item.orderId, []);
    }
    groups.get(item.orderId).push(item);
    return groups;
  }, new Map());

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Your Orders</h1>
        <p>Track everything you have purchased.</p>
      </div>

      <div className={styles.list}>
        {[...grouped.entries()].map(([orderId, items]) => {
          const first = items[0];
          return (
            <article key={orderId} className={styles.orderCard}>
              <header className={styles.orderHeader}>
                <div className={styles.orderMeta}>
                  <span className={styles.orderNumber}>{first.orderNumber}</span>
                  <span
                    className={`${styles.statusBadge} ${STATUS_TONES[first.orderStatus] ?? styles.confirmed}`}
                  >
                    {first.orderStatus}
                  </span>
                </div>
                <span className={styles.orderDate}>
                  <CalendarDays size={15} />
                  {formatDate(first.orderDate)}
                </span>
              </header>

              <ul className={styles.items}>
                {items.map((item) => (
                  <li key={`${item.orderId}-${item.productId}`} className={styles.item}>
                    <div className={styles.imageWrap}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className={styles.image} />
                      ) : (
                        <div className={styles.imageFallback}>
                          <PackageSearch size={22} />
                        </div>
                      )}
                    </div>

                    <div className={styles.itemInfo}>
                      <h3>{item.name}</h3>
                      <p className={styles.description}>{item.description || '—'}</p>
                      {item.category && <span className={styles.category}>{item.category}</span>}
                    </div>

                    <dl className={styles.itemNumbers}>
                      <div>
                        <dt>Qty</dt>
                        <dd>{item.quantity}</dd>
                      </div>
                      <div>
                        <dt>Unit price</dt>
                        <dd>{formatCurrency(item.pricePerUnit)}</dd>
                      </div>
                      <div>
                        <dt>Total</dt>
                        <dd className={styles.itemTotal}>{formatCurrency(item.totalPrice)}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}