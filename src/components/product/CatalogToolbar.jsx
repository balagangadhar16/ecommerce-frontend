import { ChevronDown, Search } from 'lucide-react';
import styles from './CatalogToolbar.module.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-az', label: 'Name: A to Z' },
];

/**
 * Shared search + sort controls for product list views.
 * Both are fully controlled by the parent.
 */
export default function CatalogToolbar({ query, onQueryChange, sortBy, onSortChange }) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.search}>
        <Search className={styles.searchIcon} size={18} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search by product name..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className={styles.searchInput}
          aria-label="Search products"
        />
      </div>

      <label className={styles.sort}>
        <span className={styles.sortLabel}>Sort</span>
        <span className={styles.selectWrap}>
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className={styles.select}
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
        </span>
      </label>
    </div>
  );
}