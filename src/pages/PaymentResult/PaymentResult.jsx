import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, XCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import styles from './PaymentResult.module.css';

export default function PaymentResult() {
  const location = useLocation();
  const state = location.state ?? {};

  const success = state.status === 'success';
  const orderNumber = state.orderNumber;
  const paymentId = state.paymentId;
  const amountPaid = state.amountPaid;
  const errorMessage = state.message || 'Payment failed. Please try again.';

  return (
    <div className={styles.page}>
      <div className={`${styles.card} animate-scale-in`}>
        {success ? (
          <>
            <div className={`${styles.iconWrap} ${styles.success}`}>
              <CheckCircle2 size={64} aria-hidden="true" />
            </div>
            <h1 className={styles.title}>Payment Successful</h1>
            <p className={`${styles.subtitle} ${styles.successText}`}>
              Your order has been placed successfully.
            </p>

            <div className={styles.details}>
              <div className={styles.row}>
                <span>Order Number</span>
                <strong>{orderNumber}</strong>
              </div>
              <div className={styles.row}>
                <span>Payment ID</span>
                <strong className={styles.mono}>{paymentId}</strong>
              </div>
              <div className={styles.row}>
                <span>Amount Paid</span>
                <strong className={styles.amount}>{formatCurrency(amountPaid)}</strong>
              </div>
            </div>

            <Link to="/products" className={styles.action}>
              <span className={styles.actionInner}>
                <ShoppingBag size={18} />
                Continue Shopping
              </span>
            </Link>
          </>
        ) : (
          <>
            <div className={`${styles.iconWrap} ${styles.failed}`}>
              <XCircle size={64} aria-hidden="true" />
            </div>
            <h1 className={styles.title}>Payment Failed</h1>
            <p className={`${styles.subtitle} ${styles.failedText}`}>
              {errorMessage}
            </p>

            <div className={styles.actionRow}>
              <Link to="/cart" className={`${styles.action} ${styles.primary}`}>
                Retry Payment
              </Link>
              <Link to="/cart" className={`${styles.action} ${styles.ghost}`}>
                Back to Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}