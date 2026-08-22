import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    heading: 'Platform',
    links: [
      { to: '/solutions', label: 'Solutions' },
      { to: '/industries', label: 'Industries' },
      { to: '/pricing', label: 'Pricing' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { to: '/compliance-hub', label: 'Compliance Hub' },
      { to: '/resources', label: 'Guides' },
      { to: '/templates', label: 'Templates Store' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
      { to: '/privacy', label: 'Privacy' },
      { to: '/terms', label: 'Terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-surface mt-20 pt-1">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-DEFAULT via-teal-DEFAULT to-amber-DEFAULT opacity-50"></div>
      
      <div className="mx-auto max-w-[1280px] px-6 pt-16 pb-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between mb-16">
          <div className="max-w-sm">
            <Link to="/" className="font-display text-2xl font-bold tracking-tight gradient-text">
              APEX VERITAS
            </Link>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Your virtual HSEQ &amp; compliance department, wherever your sites are. We make regulatory compliance seamless and premium.
            </p>
            <div className="title-block mt-8 w-fit glass-card bg-background/50">
              <dt>Doc</dt>
              <dd>AV-WEB-01</dd>
              <dt>Rev</dt>
              <dd>2.0</dd>
              <dt>Status</dt>
              <dd className="text-teal-DEFAULT drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]">Live</dd>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-16">
            {COLUMNS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-4">
                <h3 className="font-display font-semibold text-text-primary text-lg">
                  {column.heading}
                </h3>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-text-muted hover:text-amber-DEFAULT transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-divider flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Apex Veritas. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <span>Kenya</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>UAE</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>East Africa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
