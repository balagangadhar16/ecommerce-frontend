import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Save, UserCog } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import { getApiError } from '../../utils/errorParser';
import { validateField } from '../../utils/validators';
import styles from './AdminModifyUser.module.css';

const ROLE_OPTIONS = ['CUSTOMER', 'ADMIN'];

export default function AdminModifyUser() {
  const navigate = useNavigate();
  const { notify } = useToast();

  const [userId, setUserId] = useState('');
  const [loadingUser, setLoadingUser] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [form, setForm] = useState({ username: '', email: '', role: 'CUSTOMER' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const loadUser = async (event) => {
    event?.preventDefault();
    if (!userId.trim()) {
      notify('error', 'Please enter a user ID');
      return;
    }

    setLoadingUser(true);
    setLoaded(false);
    setErrors({});
    try {
      const user = await adminService.getUser(Number(userId));
      setForm({
        username: user.username ?? '',
        email: user.email ?? '',
        role: user.role ?? 'CUSTOMER',
      });
      setLoaded(true);
    } catch (e) {
      notify('error', getApiError(e).message);
      setLoaded(false);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    for (const field of ['username', 'email']) {
      const message = validateField(field, form[field]);
      if (message) nextErrors[field] = message;
    }
    if (!form.role) nextErrors.role = 'Role is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const updated = await adminService.updateUser(Number(userId), form);
      notify('success', `User "${updated.username}" updated successfully`);
      setLoaded(true);
      setUserId(String(updated.id));
    } catch (error) {
      const apiError = getApiError(error);
      if (Object.keys(apiError.fieldErrors).length > 0) {
        setErrors(apiError.fieldErrors);
      } else {
        notify('error', apiError.message);
      }
    } finally {
      setSaving(false);
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
          <h1>Modify User</h1>
          <p>Update user details and manage roles.</p>
        </section>

        <div className={styles.panel}>
          <form onSubmit={loadUser} className={styles.lookupRow}>
            <Input
              id="userId"
              label="User ID"
              type="number"
              min="1"
              placeholder="e.g. 7"
              icon={Search}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <div className={styles.lookupAction}>
              <Button type="submit" variant="primary" loading={loadingUser}>
                Load user
              </Button>
            </div>
          </form>

          {loaded && (
            <form onSubmit={handleSubmit} noValidate className={styles.editForm}>
              <Input
                id="username"
                label="Username"
                placeholder="Username"
                icon={UserCog}
                value={form.username}
                onChange={handleChange('username')}
                error={errors.username}
              />

              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={handleChange('email')}
                error={errors.email}
              />

              <div className={styles.field}>
                <label className={styles.label} htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  className={`${styles.select} ${errors.role ? styles.selectInvalid : ''}`}
                  value={form.role}
                  onChange={handleChange('role')}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className={styles.fieldError} role="alert">
                    {errors.role}
                  </p>
                )}
              </div>

              <div className={styles.actions}>
                <Button type="submit" variant="primary" loading={saving}>
                  <Save size={16} />
                  Save changes
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
