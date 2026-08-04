import {
  Footprints,
  Headphones,
  Laptop,
  LayoutGrid,
  Package,
  Shirt,
  ShoppingBag,
  Smartphone,
  Watch,
} from 'lucide-react';
import styles from './CategorySidebar.module.css';

const CATEGORY_ICONS = {
  Shirts: Shirt,
  Pants: Package,
  Shoes: Footprints,
  Mobiles: Smartphone,
  Laptops: Laptop,
  Watches: Watch,
  Headphones: Headphones,
  Accessories: ShoppingBag,
};

/**
 * Sidebar of categories + "All". Clicking a category calls back with its id
 * (null for "All") so the parent can refetch products without a reload.
 */
export default function CategorySidebar({ categories, activeId, onSelect }) {
  return (
    <aside className={styles.sidebar} aria-label="Product categories">
      <h2 className={styles.title}>Categories</h2>

      <ul className={styles.list}>
        <li>
          <button
            type="button"
            className={`${styles.item} ${activeId == null ? styles.active : ''}`}
            onClick={() => onSelect(null)}
          >
            <span className={styles.itemIcon}>
              <LayoutGrid size={17} />
            </span>
            All
          </button>
        </li>

        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category.categoryName] ?? LayoutGrid;
          const isActive = activeId === category.categoryId;
          return (
            <li key={category.categoryId}>
              <button
                type="button"
                className={`${styles.item} ${isActive ? styles.active : ''}`}
                onClick={() => onSelect(category.categoryId)}
              >
                <span className={styles.itemIcon}>
                  <Icon size={17} />
                </span>
                {category.categoryName}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
