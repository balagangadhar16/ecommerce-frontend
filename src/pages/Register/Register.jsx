import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PasswordStrength from '../../components/ui/PasswordStrength';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { validateField, validateForm } from '../../utils/validators';
import { getApiError } from '../../utils/errorParser';

const FIELDS = ['username', 'email', 'password', 'confirmPassword'];

export default function Register() {
  const { register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const next = { ...form, [field]: value };
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value, next) }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(form, FIELDS);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      notify('success', 'Account created successfully! Please sign in.');
      navigate('/login', { replace: true, state: { registeredEmail: form.email.trim() } });
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
      title="Create your account"
      subtitle="Join Shoply and start shopping smarter."
      footer={
        <>
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="username"
          label="Username"
          type="text"
          placeholder="johndoe"
          icon={User}
          value={form.username}
          onChange={handleChange('username')}
          error={errors.username}
          autoComplete="username"
        />

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
          placeholder="At least 8 characters"
          icon={Lock}
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
          autoComplete="new-password"
        />

        {form.password && <PasswordStrength password={form.password} />}

        <Input
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          icon={Lock}
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
