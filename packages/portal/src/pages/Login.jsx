import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../store/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, status } = useAuth();

  // Whatever RequireAuth was guarding when it bounced the user here.
  const from = location.state?.from?.pathname || '/portal';

  // Covers the case where an already-signed-in user opens /login directly.
  useEffect(() => {
    if (status === 'authenticated') navigate(from, { replace: true });
  }, [status, from, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.mfaRequired) {
        navigate('/mfa-verify', { state: { userId: data.userId, from } });
        return;
      }
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blueprint-grid bg-grid">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-divider bg-background p-8">
        <p className="font-display text-sm font-bold text-text-primary tracking-tight">APEX VERITAS</p>
        <h1 className="mt-1 text-xl font-bold text-text-primary">Client Portal</h1>
        {error && (
          <p className="mt-4 status-tag status-tag--critical">{error}</p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full mt-6" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
