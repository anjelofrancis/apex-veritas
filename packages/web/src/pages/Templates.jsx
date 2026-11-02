import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { EASE, Reveal } from '../components/motion';

const money = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
});

const ALL = 'All templates';

function Skeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading templates" role="status">
      {[0, 1, 2].map((i) => (
        <div key={i} className="glass-card h-56 animate-pulse p-6">
          <div className="h-3 w-20 rounded bg-divider" />
          <div className="mt-5 h-5 w-3/4 rounded bg-divider" />
          <div className="mt-12 h-8 w-1/2 rounded bg-divider" />
        </div>
      ))}
    </div>
  );
}

export default function Templates() {
  const [state, setState] = useState({ status: 'loading', templates: [], error: null });
  const [category, setCategory] = useState(ALL);

  useEffect(() => {
    let cancelled = false;
    const API_BASE = import.meta.env.VITE_API_URL || '/api';
    fetch(`${API_BASE}/public/templates`)
      .then((res) => {
        if (!res.ok) throw new Error(`Catalogue unavailable (${res.status})`);
        return res.json();
      })
      .then((body) => {
        if (!cancelled) setState({ status: 'ready', templates: body.data ?? [], error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ status: 'error', templates: [], error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = [ALL, ...new Set(state.templates.map((t) => t.category))];
  const visible = state.templates.filter((t) => category === ALL || t.category === category);

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        eyebrow="Templates Store"
        title="Ready-made documentation, drafted by working consultants"
        intro="Buy the pack outright and adapt it yourself, or have us implement it as part of a managed engagement."
        cta={false}
      />
      <section className="mx-auto max-w-[1280px] px-6 py-24">
        {state.status === 'loading' && <Skeleton />}

        {state.status === 'error' && (
          <div role="alert" className="glass-card mx-auto max-w-xl border-oxide/50 p-8 text-center">
            <p className="mb-2 font-mono text-sm uppercase tracking-widest text-oxide">Catalogue unavailable</p>
            <p className="text-text-secondary">
              We could not load the packs just now. They are still available directly —{' '}
              <Link to="/contact" className="text-text-primary underline underline-offset-4">ask us for a copy</Link>.
            </p>
          </div>
        )}

        {state.status === 'ready' && state.templates.length === 0 && (
          <div className="glass-card mx-auto max-w-2xl p-10 text-center">
            <p className="text-lg text-text-secondary">
              No packs are listed yet.{' '}
              <Link to="/contact" className="text-text-primary underline underline-offset-4">Tell us what you need</Link>{' '}
              and we will draft it.
            </p>
          </div>
        )}

        {state.status === 'ready' && state.templates.length > 0 && (
          <>
            <Reveal y={12}>
              <div className="mb-12 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                {categories.map((name) => (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={category === name}
                    onClick={() => setCategory(name)}
                    className="relative rounded-full border border-divider px-5 py-2.5 text-sm"
                  >
                    {category === name && (
                      <motion.span
                        layoutId="template-filter"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-amber/15 ring-1 ring-amber/50"
                        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                      />
                    )}
                    <span className="relative text-text-primary">{name}</span>
                  </button>
                ))}
              </div>
            </Reveal>

            <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false}>
                {visible.map((template) => (
                  <motion.article
                    key={template.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="glass-card flex flex-col p-7"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-widest text-teal">{template.category}</p>
                    <h2 className="mt-3 font-display text-xl font-bold">{template.name}</h2>
                    <p className="mb-8 mt-8 font-display text-3xl font-bold text-amber">
                      {money.format(template.priceCents / 100)}
                      {template.isSubscription && (
                        <span className="ml-1 font-mono text-sm font-normal text-text-muted">/yr</span>
                      )}
                    </p>
                    <Link
                      to={`/contact?pack=${encodeURIComponent(template.name)}`}
                      className="btn-secondary mt-auto w-full"
                    >
                      Request this pack
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </section>
    </main>
  );
}
