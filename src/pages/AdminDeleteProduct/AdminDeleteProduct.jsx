import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PackageSearch, RefreshCw, Trash2, X } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import { getApiError } from '../../utils/errorParser';
import { formatCurrency, getStockStatus } from '../../utils/formatters';
import styles from './AdminDeleteProduct.module.css';

export default function AdminDeleteProduct() {
  const navigate = useNavigate();
  const { notify } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    adminService
      .getProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((e) => setError(getApiError(e).message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (product) => {
    setDeletingId(product.productId);
    setConfirmId(null);
    try {
      await adminService.deleteProduct(product.productId);
      notify('success', `Product "${product.name}" deleted`);
      loadProducts();
    } catch (e) {
      const apiError = getApiError(e);
      if (Object.keys(apiError.fieldErrors).length > 0) {
        notify('error', Object.values(apiError.fieldErrors)[0]);
      } else {
        notify('error', apiError.message);
      }
    } finally {
      setDeletingId(null);
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
          <h1>Delete Product</h1>
          <p>Remove products from inventory. Deleting is permanent.</p>
        </section>

        {loading ? (
          <div className={styles.center}>
            <Spinner size={40} />
          </div>
        ) : error ? (
          <div className={styles.state}>
            <PackageSearch size={44} />
            <h2>Could not load products</h2>
            <p>{error}</p>
            <Button variant="primary" onClick={loadProducts}>
              <RefreshCw size={16} />
              Retry
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className={styles.state}>
            <PackageSearch size={44} />
            <h2>No products yet</h2>
            <p>There are no products to delete right now.</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {products.map((product) => {
              const stock = getStockStatus(product.stock);
              const isConfirming = confirmId === product.productId;
              const isDeleting = deletingId === product.productId;
              return (
                <li key={product.productId} className={styles.card}>
                  <div className={styles.imageWrap}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className={styles.image} />
                    ) : (
                      <div className={styles.imageFallback}>
                        <PackageSearch size={22} />
                      </div>
                    )}
                  </div>

                  <div className={styles.info}>
                    <h2>{product.name}</h2>
                    <p className={styles.description}>{product.description || '—'}</p>
                    <div className={styles.meta}>
                      {product.category && <span className={styles.category}>{product.category}</span>}
                      <span className={`${styles.stock} ${styles[stock.tone]}`}>{stock.label}</span>
                    </div>
                  </div>

                  <div className={styles.price}>{formatCurrency(product.price)}</div>

                  <div className={styles.actions}>
                    {isConfirming ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={isDeleting}
                          onClick={() => handleDelete(product)}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmId(null)}
                          disabled={isDeleting}
                        >
                          <X size={14} />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={styles.deleteButton}
                        onClick={() => setConfirmId(product.productId)}
                      >
                        <Trash2 size={15} />
                        Delete
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
