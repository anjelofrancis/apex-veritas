import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../store/auth';
import { useTheme } from '../components/ThemeProvider';

const NAV_ITEMS = [
  { to: '/portal', label: 'Dashboard', end: true },
  { to: '/portal/compliance', label: 'Compliance' },
  { to: '/portal/documents', label: 'Documents' },
  { to: '/portal/audits', label: 'Audits' },
  { to: '/portal/incidents', label: 'Incidents' },
  { to: '/portal/training', label: 'Training' },
  { to: '/portal/tasks', label: 'Tasks' },
  { to: '/portal/reports', label: 'Reports' },
  { to: '/portal/messages', label: 'Messages' },
  { to: '/portal/settings', label: 'Settings' },
];

function initials(user) {
  const letters = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.trim();
  return letters || user?.email?.[0]?.toUpperCase() || 'U';
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function handleLogout() {
    setOpen(false);
    logout();
    queryClient.clear();
    navigate('/login', { replace: true });
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="h-8 w-8 rounded-full bg-surface border border-divider text-text-primary flex items-center justify-center font-mono text-xs uppercase hover:border-amber transition-colors"
      >
        {initials(user)}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-60 glass-card bg-surface border border-divider shadow-xl overflow-hidden"
        >
          <div className="border-b border-divider px-4 py-3">
            <p className="text-sm font-medium text-text-primary truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="font-mono text-[10px] text-text-secondary truncate">{user?.email}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mt-1">
              {user?.role?.replace(/_/g, ' ')}
            </p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-left text-sm text-oxide hover:bg-white/5 transition-colors"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function PortalLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-56 shrink-0 border-r border-divider bg-surface/50 backdrop-blur-md">
        <div className="border-b border-divider px-5 py-5 flex items-center gap-3">
          <img src="/logo.jpg" alt="Apex Veritas Logo" className="w-8 h-8 rounded-md object-cover" />
          <div>
            <p className="font-display text-sm font-bold gradient-text tracking-tight">APEX VERITAS</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary mt-0.5">Client Portal</p>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-body rounded-lg transition-all duration-300 relative ${
                  isActive
                    ? 'text-amber font-medium shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: 'color-mix(in srgb, var(--color-amber) 10%, transparent)' } : undefined}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b border-divider bg-surface/30 backdrop-blur-md px-6 py-3">
          <p className="font-mono text-xs text-text-muted uppercase tracking-widest">
            {NAV_ITEMS.find((i) => (i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)))?.label || 'Overview'}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="h-8 w-8 rounded-full bg-surface border border-divider text-text-secondary flex items-center justify-center hover:border-amber transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 p-6 relative overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
