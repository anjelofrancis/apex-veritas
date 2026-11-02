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
    <div className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <div aria-hidden="true" className="aurora">
        <span className="aurora-blob aurora-blob--amber" />
        <span className="aurora-blob aurora-blob--teal" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="page-enter relative z-10 w-full max-w-md rounded-2xl border border-divider bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
      >
        <div className="flex items-center gap-3">
          <img src="./logo.jpg" alt="" className="h-10 w-10 rounded-lg object-cover" />
          <p className="font-display text-sm font-bold tracking-tight text-text-primary">APEX VERITAS</p>
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-text-primary">Client Portal</h1>
        <p className="mt-2 text-sm text-text-secondary">Sign in to your compliance workspace.</p>
        {error && (
          <p role="alert" className="status-tag status-tag--critical mt-5 normal-case">{error}</p>
        )}
        <div className="mt-7 flex flex-col gap-5">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-text-primary">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-text-primary">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn-primary mt-7 w-full" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
