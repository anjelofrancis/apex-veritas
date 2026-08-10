import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth';

/**
 * Gate for every /portal route. While the boot-time /auth/me check is in
 * flight we render a placeholder rather than redirecting — bouncing to /login
 * first would throw a signed-in user out on every hard refresh.
 */
export default function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blueprint-grid bg-grid">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40">
          Verifying session…
        </p>
      </div>
    );
  }

  if (status !== 'authenticated') {
    // `from` lets the login form send the user back where they were heading.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
