import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { login } from '../../api/services';
import {
  AuthLayout, AuthCard, AuthInput, AuthPasswordInput,
  AuthSubmitButton, SocialAuth, AuthDivider, AuthFieldError, AuthFooterLink,
} from '../../components/auth/AuthComponents';

export default function LoginPage() {
  const { signIn } = useAuth();
  const { success, error: showError } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login(form);
      signIn(data);
      success(`Welcome back, ${data.firstName || 'User'}!`);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout >
      <AuthCard label="Sign in to your account">
        <SocialAuth />
        <AuthDivider />
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <AuthInput label="Email" type="email" placeholder="your@email.com"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <AuthPasswordInput label="Password" placeholder="••••••••"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <AuthFieldError message={error} />
          <AuthSubmitButton loading={loading} label="Enter" />
        </form>
      </AuthCard>
      <AuthFooterLink text="New to the portal?" linkLabel="Request access" to="/register" />
    </AuthLayout>
  );
}
