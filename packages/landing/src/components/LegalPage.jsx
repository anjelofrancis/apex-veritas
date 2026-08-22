import { Link } from 'react-router-dom';

export default function LegalPage({ eyebrow, title, updated, children }) {
  return (
    <main className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-DEFAULT/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="mx-auto max-w-4xl px-6 relative z-10">
        <p className="font-mono text-sm uppercase tracking-widest text-teal-DEFAULT mb-4">{eyebrow}</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-8">{title}</h1>
        
        <div className="title-block bg-white/5 border-divider mb-12">
          <dt>Status</dt>
          <dd className="text-amber-DEFAULT">Draft</dd>
          <dt>Rev</dt>
          <dd className="text-text-primary">{updated}</dd>
        </div>

        <div className="glass-card p-6 border-amber-DEFAULT/40 bg-amber-DEFAULT/5 mb-12 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-DEFAULT"></div>
          <p className="text-sm text-text-secondary leading-relaxed">
            This document is a working draft pending review by counsel. It describes how the
            platform currently operates, but it is not yet a binding notice.{' '}
            <Link to="/contact" className="text-text-primary hover:text-amber-DEFAULT underline underline-offset-4 transition-colors">
              Contact us
            </Link>{' '}
            with any question about data handling in the meantime.
          </p>
        </div>

        <div className="glass-card p-8 sm:p-12 border-divider space-y-10">
          {children}
        </div>
      </div>
    </main>
  );
}

export function Clause({ heading, children }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-text-primary mb-4">{heading}</h2>
      <div className="space-y-4 text-text-secondary leading-relaxed">{children}</div>
    </section>
  );
}
