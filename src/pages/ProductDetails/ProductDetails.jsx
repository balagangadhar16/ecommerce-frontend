import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, PackageSearch, ShoppingCart, Truck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { catalogService } from '../../services/catalogService';
import { useCart } from '../../hooks/useCart';
import { getApiError } from '../../utils/errorParser';
import { formatCurrency, getStockStatus } from '../../utils/formatters';
import styles from './ProductDetails.module.css';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setProduct(null);
    setImageFailed(false);

    catalogService
      .getProduct(id)
      .then((data) => {
        if (active) setProduct(data);
      })
      .catch((e) => {
        if (active) setError(getApiError(e).message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner size={40} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.center}>
        <div className={styles.notFound}>
          <PackageSearch size={44} />
          <h1>Product unavailable</h1>
          <p>{error ?? 'This product could not be found.'}</p>
          <Link to="/products">
            <Button variant="primary">
              <ArrowLeft size={16} />
              Back to products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const stock = getStockStatus(product.stock);
  const outOfStock = stock.tone === 'out';

  const handleAddToCart = () => {
    addToCart(product.productId, 1);
  };

  return (
    <div className={styles.page}>
      <Link to="/products" className={styles.back}>
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <div className={styles.layout}>
        {/* Image */}
        <div className={styles.imageCard}>
          {product.imageUrl && !imageFailed ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className={styles.image}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className={styles.imageFallback}>
              <PackageSearch size={56} />
            </div>
          )}
        </div>

        {/* Details */}
        <div className={styles.details}>
          {product.category && (
            <span className={styles.category}>{product.category}</span>
          )}

          <h1 className={styles.name}>{product.name}</h1>

          <p className={styles.price}>{formatCurrency(product.price)}</p>

          <p className={styles.stockLine}>
            <span className={`${styles.stockDot} ${styles[stock.tone]}`} aria-hidden="true" />
            {stock.label}
          </p>

          <p className={styles.description}>
            {product.description || 'No description available for this product.'}
          </p>

          <div className={styles.delivery}>
            <Truck size={18} />
            <span>Free delivery on orders over ₹499</span>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            <ShoppingCart size={18} />
            {outOfStock ? 'Out of stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
