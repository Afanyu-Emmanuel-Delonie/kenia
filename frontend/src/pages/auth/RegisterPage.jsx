import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { register } from '../../api/services';
import {
  AuthLayout, AuthCard, AuthInput, AuthPasswordInput,
  AuthSubmitButton, SocialAuth, AuthDivider, AuthFieldError, AuthFooterLink,
} from '../../components/auth/AuthComponents';

const ROLES = ['ROLE_ADMIN'];

export default function RegisterPage() {
  const { signIn } = useAuth();
  const { success, error: showError } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'ROLE_ADMIN' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await register(form);
      signIn(data);
      success(`Account created successfully! Welcome, ${data.firstName || form.fullName}!`);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.detail ?? 'Registration failed. Please try again.';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard label="Create your account">
        <SocialAuth />
        <AuthDivider />
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <AuthInput label="Full Name" type="text" placeholder="Your full name"
            value={form.fullName} onChange={set('fullName')} required />
          <AuthInput label="Email" type="email" placeholder="your@email.com"
            value={form.email} onChange={set('email')} required />
          <AuthPasswordInput label="Password" placeholder="Min. 8 characters"
            value={form.password} onChange={set('password')} required minLength={8} />
          <AuthFieldError message={error} />
          <AuthSubmitButton loading={loading} label="Create Account" />
        </form>
      </AuthCard>
      <AuthFooterLink text="Already have access?" linkLabel="Sign in" to="/login" />
    </AuthLayout>
  );
}
