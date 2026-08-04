import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { validateField } from '../../utils/validators';
import { getApiError } from '../../utils/errorParser';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: location.state?.registeredEmail ?? '',
    password: '',
  });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    for (const field of ['email', 'password']) {
      const message = validateField(field, form[field]);
      if (message) nextErrors[field] = message;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const data = await login(form.email, form.password, remember);
      notify('success', `Welcome back, ${data.username}!`);
      navigate(location.state?.from ?? '/dashboard', { replace: true });
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
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your account."
      footer={
        <>
          <span>New to Shoply?</span>
          <Link to="/register">Create an account</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={Lock}
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className={styles.row}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className={styles.checkboxBox} aria-hidden="true" />
            Remember me
          </label>
          <Link to="#" className={styles.forgot} onClick={(e) => e.preventDefault()}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
