import { useState, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../store/auth';

export default function MfaVerify() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const inputRefs = useRef([]);

  const state = location.state;
  if (!state || !state.userId) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const token = code.join('');
    if (token.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/mfa/verify', { userId: state.userId, token });
      await login(data);
      const from = state.from?.pathname || '/portal';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blueprint-grid bg-grid">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-divider bg-background p-8 text-center">
        <p className="font-display text-sm font-bold text-text-primary tracking-tight">APEX VERITAS</p>
        <h1 className="mt-1 text-xl font-bold text-text-primary">Two-Factor Authentication</h1>
        <p className="mt-2 text-sm text-text-secondary">Enter the 6-digit code from your authenticator app</p>
        {error && (
          <p className="mt-4 status-tag status-tag--critical block">{error}</p>
        )}
        <div className="mt-6 flex justify-center gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text"
              maxLength={1}
              className="w-10 h-12 text-center border border-divider bg-surface font-mono text-lg text-text-primary focus:outline-none focus:border-blueprint"
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              required
            />
          ))}
        </div>
        <button type="submit" className="btn-primary w-full mt-6" disabled={submitting}>
          {submitting ? 'Verifying…' : 'Verify'}
        </button>
      </form>
    </div>
  );
}
