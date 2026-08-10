import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ImageIcon, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { paymentService } from '../../services/paymentService';
import { getApiError } from '../../utils/errorParser';
import { loadScript, RAZORPAY_CHECKOUT_SRC, RAZORPAY_SCRIPT_ID } from '../../utils/loadScript';
import { formatCurrency } from '../../utils/formatters';
import styles from './Cart.module.css';

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_FEE = 49;

function CartItemView({ item, onUpdate, onRemove }) {
  const [busy, setBusy] = useState(false);

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className={styles.item}>
      <div className={styles.itemImageWrap}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className={styles.itemImage} loading="lazy" />
        ) : (
          <div className={styles.itemImageFallback}>
            <ImageIcon size={28} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className={styles.itemBody}>
        <Link
          to={`/products/${item.productId}`}
          className={styles.itemName}
        >
          {item.name}
        </Link>
        {item.category && <span className={styles.itemCategory}>{item.category}</span>}
        <p className={styles.itemDescription}>{item.description || 'No description available.'}</p>

        <div className={styles.itemRow}>
          <div className={styles.stepper} role="group" aria-label={`Quantity for ${item.name}`}>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={() => run(() => onUpdate(item.cartItemId, item.quantity - 1))}
              disabled={busy || item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={15} aria-hidden="true" />
            </button>
            <span className={styles.quantity}>{item.quantity}</span>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={() => run(() => onUpdate(item.cartItemId, item.quantity + 1))}
              disabled={busy}
              aria-label="Increase quantity"
            >
              <Plus size={15} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.itemPrices}>
            <span className={styles.itemTotal}>{formatCurrency(item.totalPrice)}</span>
            <span className={styles.itemUnit}>{formatCurrency(item.price)} each</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.removeBtn}
        onClick={() => run(() => onRemove(item.cartItemId))}
        disabled={busy}
        aria-label={`Remove ${item.name} from cart`}
      >
        <Trash2 size={16} aria-hidden="true" />
        Remove
      </button>
    </li>
  );
}

export default function Cart() {
  const { items, grandTotal, totalQuantity, loaded, fetchCart, updateQuantity, removeItem } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [checkingOut, setCheckingOut] = useState(false);

  const shipping = grandTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotalWithShipping = grandTotal + shipping;
  const remainingForFree = grandTotal >= FREE_SHIPPING_THRESHOLD ? 0 : FREE_SHIPPING_THRESHOLD - grandTotal;

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const order = await paymentService.createOrder();

      await loadScript(RAZORPAY_CHECKOUT_SRC, RAZORPAY_SCRIPT_ID);

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'E-Commerce Store',
        description: 'Your order from E-Commerce Store',
        order_id: order.orderId,
        handler: async (response) => {
          try {
            const result = await paymentService.verifyPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (result.success) {
              setCheckingOut(false);
              await fetchCart();
              navigate('/payment/result', {
                replace: true,
                state: {
                  status: 'success',
                  orderNumber: result.orderNumber,
                  paymentId: result.paymentId,
                  amountPaid: result.amountPaid,
                },
              });
            } else {
              setCheckingOut(false);
              navigate('/payment/result', {
                replace: true,
                state: {
                  status: 'failed',
                  message: result.message || 'Payment verification failed.',
                },
              });
            }
          } catch (e) {
            setCheckingOut(false);
            notify('error', getApiError(e).message);
          }
        },
        modal: {
          ondismiss: () => setCheckingOut(false),
          escape: true,
        },
      });

      razorpay.on('payment.failed', (response) => {
        setCheckingOut(false);
        navigate('/payment/result', {
          replace: true,
          state: {
            status: 'failed',
            message: response?.error?.description || 'Payment failed. Please try again.',
          },
        });
      });

      razorpay.open();
    } catch (e) {
      notify('error', getApiError(e).message);
      setCheckingOut(false);
    }
  };

  if (!loaded) {
    return (
      <div className={styles.center}>
        <Spinner size={40} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.center}>
        <div className={styles.empty}>
          <ShoppingBag size={52} />
          <h1>Your cart is empty</h1>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products">
            <Button variant="primary" size="lg">
              Browse products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Shopping cart</h1>
        <p>
          {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your cart
        </p>
      </header>

      <div className={styles.layout}>
        <section className={styles.itemsSection}>
          <ul className={styles.items}>
            {items.map((item) => (
              <CartItemView
                key={item.cartItemId}
                item={item}
                onUpdate={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </ul>
        </section>

        {/* Order summary */}
        <aside className={styles.summary}>
          <h2>Order summary</h2>

          <div className={styles.freeShip}>
            <Truck size={18} aria-hidden="true" />
            {remainingForFree > 0 ? (
              <span>Add {formatCurrency(remainingForFree)} more for free shipping</span>
            ) : (
              <span>You've unlocked free shipping!</span>
            )}
          </div>

          <dl className={styles.lines}>
            <div className={styles.line}>
              <dt>Subtotal</dt>
              <dd>{formatCurrency(grandTotal)}</dd>
            </div>
            <div className={styles.line}>
              <dt>Shipping</dt>
              <dd>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</dd>
            </div>
            <div className={`${styles.line} ${styles.totalLine}`}>
              <dt>Grand total</dt>
              <dd>{formatCurrency(grandTotalWithShipping)}</dd>
            </div>
          </dl>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleCheckout}
            loading={checkingOut}
          >
            Proceed to Checkout
          </Button>
          <p className={styles.note}>Pay securely with Razorpay.</p>
        </aside>
      </div>
    </div>
  );
}