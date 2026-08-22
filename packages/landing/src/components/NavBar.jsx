import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from './ThemeProvider';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/industries', label: 'Industries' },
  { to: '/compliance-hub', label: 'Compliance Hub' },
  { to: '/resources', label: 'Resources' },
  { to: '/templates', label: 'Templates Store' },
  { to: '/pricing', label: 'Pricing' },
];

const PORTAL_URL = import.meta.env.VITE_PORTAL_URL || 'http://localhost:5173';

function linkClass({ isActive }) {
  return isActive
    ? 'text-text-primary font-medium relative after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-gradient-amber'
    : 'text-text-muted hover:text-text-primary transition-colors relative after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-gradient-amber after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300';
}

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl border-b border-divider py-3 shadow-md' : 'bg-transparent py-5'
      }`}
      style={scrolled ? { backgroundColor: 'color-mix(in srgb, var(--color-bg-background) 80%, transparent)' } : undefined}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 font-display text-xl font-bold tracking-tight gradient-text drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
          <img src="/logo.jpg" alt="Apex Veritas Logo" className="w-8 h-8 rounded-md object-cover" />
          APEX VERITAS
        </Link>

        <nav className="hidden gap-8 font-body text-sm lg:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden font-body text-sm font-medium text-text-secondary hover:text-text-primary transition-colors sm:inline"
          >
            Contact
          </Link>
          <a href={PORTAL_URL} className="glass-card px-5 py-2 text-xs font-semibold text-text-primary hover:border-amber-DEFAULT hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
            Client Portal
          </a>
          <button
            onClick={toggleTheme}
            className="glass-card p-2 text-text-primary hover:text-amber transition-colors border-white/20"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
            className="glass-card p-2.5 lg:hidden border-white/20"
          >
            <div className={`w-5 h-0.5 bg-text-primary transition-all duration-300 ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-text-primary mt-1 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-text-primary mt-1 transition-all duration-300 ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed inset-0 top-[60px] backdrop-blur-xl transition-all duration-500 ease-in-out ${
          open ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg-background) 95%, transparent)' }}
      >
        <nav
          id="mobile-nav"
          className="h-full px-6 py-8 flex flex-col gap-6"
        >
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `text-xl font-display ${isActive ? 'gradient-text' : 'text-text-primary'}`}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/contact" onClick={() => setOpen(false)} className="text-xl font-display text-text-primary mt-4 pt-4 border-t border-divider">
            Contact Us
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
