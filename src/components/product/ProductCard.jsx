import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, ShoppingCart } from 'lucide-react';
import Button from '../ui/Button';
import { formatCurrency, getStockStatus } from '../../utils/formatters';
import styles from './ProductCard.module.css';

/**
 * Responsive product card. Whole card navigates to /products/:id;
 * the Add to Cart button stops propagation so it never navigates.
 */
export default function ProductCard({ product, onAddToCart }) {
  const [imageFailed, setImageFailed] = useState(false);
  const stock = getStockStatus(product.stock);

  const handleAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onAddToCart?.(product);
  };

  return (
    <Link to={`/products/${product.productId}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {product.imageUrl && !imageFailed ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.image}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={styles.imageFallback}>
            <ImageIcon size={36} aria-hidden="true" />
          </div>
        )}
        {product.category && (
          <span className={styles.categoryBadge}>{product.category}</span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>
          {product.description || 'No description available.'}
        </p>

        <div className={styles.footer}>
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatCurrency(product.price)}</span>
            <span className={`${styles.stock} ${styles[stock.tone]}`}>{stock.label}</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={handleAdd}
            disabled={stock.tone === 'out'}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
}
