import { useCallback, useEffect, useMemo, useState } from 'react';
import { PackageSearch, RefreshCw } from 'lucide-react';
import CategorySidebar from '../../components/product/CategorySidebar';
import CatalogToolbar from '../../components/product/CatalogToolbar';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/ui/Button';
import { catalogService } from '../../services/catalogService';
import { useToast } from '../../hooks/useToast';
import { useCart } from '../../hooks/useCart';
import { getApiError } from '../../utils/errorParser';
import styles from './Products.module.css';

export default function Products() {
  const { notify } = useToast();
  const { addToCart } = useCart();

  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const loadProducts = useCallback(
    async (categoryId) => {
      setLoading(true);
      setError(false);
      try {
        const data =
          categoryId == null
            ? await catalogService.getProducts()
            : await catalogService.getProductsByCategory(categoryId);
        setProducts(data);
      } catch (e) {
        setError(true);
        notify('error', getApiError(e).message);
      } finally {
        setLoading(false);
      }
    },
    [notify],
  );

  useEffect(() => {
    catalogService
      .getCategories()
      .then(setCategories)
      .catch((e) => notify('error', getApiError(e).message));
    loadProducts(null);
  }, [loadProducts, notify]);

  const handleSelectCategory = (categoryId) => {
    setActiveCategoryId(categoryId);
    loadProducts(categoryId);
  };

  const handleAddToCart = (product) => {
    addToCart(product.productId, 1);
  };

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = term ? products.filter((p) => p.name.toLowerCase().includes(term)) : [...products];

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'name-az':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        list.sort(
          (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
        );
    }
    return list;
  }, [products, query, sortBy]);

  const empty = !loading && !error && visibleProducts.length === 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Products</h1>
        <p>Browse our full catalog across every category.</p>
      </header>

      <div className={styles.layout}>
        <CategorySidebar
          categories={categories}
          activeId={activeCategoryId}
          onSelect={handleSelectCategory}
        />

        <section className={styles.main}>
          <CatalogToolbar
            query={query}
            onQueryChange={setQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className={styles.skeleton} aria-hidden="true" />
              ))}
            </div>
          ) : error ? (
            <div className={styles.state}>
              <PackageSearch size={44} />
              <h2>Could not load products</h2>
              <p>Something went wrong while fetching the catalog.</p>
              <Button variant="primary" onClick={() => loadProducts(activeCategoryId)}>
                <RefreshCw size={16} />
                Retry
              </Button>
            </div>
          ) : empty ? (
            <div className={styles.state}>
              <PackageSearch size={44} />
              <h2>No products found</h2>
              <p>Try a different search term or category.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {visibleProducts.map((product) => (
                <ProductCard key={product.productId} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
