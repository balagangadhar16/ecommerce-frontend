import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, PackagePlus, Save } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { adminService } from '../../services/adminService';
import { catalogService } from '../../services/catalogService';
import { useToast } from '../../hooks/useToast';
import { getApiError } from '../../utils/errorParser';
import styles from './AdminAddProduct.module.css';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
  imageUrl: '',
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Product name is required';
  if (form.price === '' || form.price === null) {
    errors.price = 'Price is required';
  } else if (Number(form.price) <= 0) {
    errors.price = 'Price must be greater than zero';
  }
  if (form.stock === '' || form.stock === null) {
    errors.stock = 'Stock is required';
  } else if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
    errors.stock = 'Stock must be a whole number of 0 or more';
  }
  if (!form.categoryId) errors.categoryId = 'Category is required';
  return errors;
}

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const { notify } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = useCallback(() => {
    setLoadingCategories(true);
    catalogService
      .getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((e) => notify('error', getApiError(e).message))
      .finally(() => setLoadingCategories(false));
  }, [notify]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
        imageUrl: form.imageUrl.trim() || null,
      };
      const created = await adminService.addProduct(payload);
      notify('success', `Product "${created.name}" created successfully`);
      navigate('/admin/dashboard');
    } catch (error) {
      const apiError = getApiError(error);
      if (Object.keys(apiError.fieldErrors).length > 0) {
        setErrors(apiError.fieldErrors);
      } else {
        notify('error', apiError.message);
      }
    } finally {
      setSubmitting(false);
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
          <h1>Add Product</h1>
          <p>Create and manage new product listings.</p>
        </section>

        <div className={styles.panel}>
          {loadingCategories ? (
            <div className={styles.center}>
              <Spinner size={36} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <Input
                id="name"
                label="Product name"
                placeholder="e.g. Classic White Shirt"
                icon={PackagePlus}
                value={form.name}
                onChange={handleChange('name')}
                error={errors.name}
              />

              <div className={styles.field}>
                <label className={styles.label} htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  className={styles.textarea}
                  rows={3}
                  placeholder="Short description of the product"
                  value={form.description}
                  onChange={handleChange('description')}
                />
              </div>

              <div className={styles.row}>
                <Input
                  id="price"
                  label="Price (₹)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange('price')}
                  error={errors.price}
                />

                <Input
                  id="stock"
                  label="Stock"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="0"
                  value={form.stock}
                  onChange={handleChange('stock')}
                  error={errors.stock}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="categoryId">
                  Category
                </label>
                <select
                  id="categoryId"
                  className={`${styles.select} ${errors.categoryId ? styles.selectInvalid : ''}`}
                  value={form.categoryId}
                  onChange={handleChange('categoryId')}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className={styles.fieldError} role="alert">
                    {errors.categoryId}
                  </p>
                )}
              </div>

              <Input
                id="imageUrl"
                label="Image URL (optional)"
                placeholder="https://example.com/image.jpg"
                icon={Image}
                value={form.imageUrl}
                onChange={handleChange('imageUrl')}
                error={errors.imageUrl}
              />

              <div className={styles.actions}>
                <Button type="button" variant="ghost" onClick={() => navigate('/admin/dashboard')}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={submitting}>
                  <Save size={16} />
                  Add product
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
