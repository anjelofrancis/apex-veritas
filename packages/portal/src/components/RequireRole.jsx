import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/auth';

/**
 * Gate for routes that require a specific role (e.g. Admin Panel).
 * Placed inside <RequireAuth>, so we know `user` is present.
 *
 * `redirectTo` is where a user who fails the check is sent. It defaults to the
 * portal dashboard, but nested gates override it to land somewhere useful —
 * a consultant hitting the SUPER_ADMIN-only analytics page goes to the first
 * admin screen they can actually read, not out of the admin panel entirely.
 */
export default function RequireRole({ allowedRoles = [], redirectTo = '/portal' }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
