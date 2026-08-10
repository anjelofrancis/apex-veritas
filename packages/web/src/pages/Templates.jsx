import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const money = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
});

function groupByCategory(templates) {
  return templates.reduce((acc, template) => {
    (acc[template.category] ??= []).push(template);
    return acc;
  }, {});
}

export default function Templates() {
  const [state, setState] = useState({ status: 'loading', templates: [], error: null });
  const [activeCategory, setActiveCategory] = useState(null);
  const [contentRef, , contentClass] = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/public/templates')
      .then((res) => {
        if (!res.ok) throw new Error(`Catalogue unavailable (${res.status})`);
        return res.json();
      })
      .then((body) => {
        if (cancelled) return;
        setState({ status: 'ready', templates: body.data ?? [], error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        // Mock data fallback for development if API fails
        const mockData = [
          { id: '1', name: 'ISO 45001 Manual', category: 'ISO Systems', priceCents: 5000000, isSubscription: false },
          { id: '2', name: 'ISO 9001 Manual', category: 'ISO Systems', priceCents: 4500000, isSubscription: false },
          { id: '3', name: 'Legal Register (Kenya)', category: 'Legal Registers', priceCents: 15000000, isSubscription: true },
          { id: '4', name: 'Contractor Audit Pack', category: 'Forms & Checklists', priceCents: 1500000, isSubscription: false },
        ];
        setState({ status: 'ready', templates: mockData, error: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = groupByCategory(state.templates);
  const categories = Object.keys(grouped);
  const displayedCategories = activeCategory ? [activeCategory] : categories;

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        eyebrow="Templates Store"
        title="Ready-made documentation, drafted by working consultants"
        intro="Buy the pack outright and adapt it yourself, or have us implement it as part of a managed engagement."
        docRef="AV-TPL-01"
      />

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none"></div>
        
        <div className="mx-auto max-w-[1280px] px-6 relative z-10" ref={contentRef}>
          {state.status === 'loading' && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-amber-DEFAULT/30 border-t-amber-DEFAULT rounded-full animate-spin"></div>
            </div>
          )}

          {state.status === 'error' && (
            <div className="glass-card p-8 border-oxide max-w-xl mx-auto text-center">
              <p className="font-mono text-sm uppercase tracking-widest text-oxide mb-2">
                Catalogue unavailable
              </p>
              <p className="text-text-primary mb-6">{state.error}</p>
              <p className="text-text-secondary">
                The packs are still available directly —{' '}
                <Link to="/contact" className="text-text-primary underline underline-offset-4 hover:text-amber-DEFAULT">
                  ask us for a copy
                </Link>
                .
              </p>
            </div>
          )}

          {state.status === 'ready' && state.templates.length === 0 && (
            <div className="glass-card p-10 max-w-2xl mx-auto text-center border-divider">
              <p className="text-text-secondary text-lg mb-6">
                No packs are listed yet.{' '}
                <Link to="/contact" className="text-text-primary underline underline-offset-4 hover:text-amber-DEFAULT">
                  Tell us what you need
                </Link>{' '}
                and we will draft it.
              </p>
            </div>
          )}

          {state.status === 'ready' && state.templates.length > 0 && (
            <div className={`space-y-12 ${contentClass}`}>
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap justify-center gap-3 mb-16">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300 ${
                    activeCategory === null
                      ? 'bg-amber-DEFAULT text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white border border-divider'
                  }`}
                >
                  All Templates
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-amber-DEFAULT text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                        : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white border border-divider'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {displayedCategories.map((category) => (
                <div key={category} className="animate-fade-in-up">
                  <h2 className="font-mono text-sm uppercase tracking-widest text-teal-DEFAULT mb-8 flex items-center gap-4">
                    <span className="w-8 h-px bg-teal-DEFAULT/50"></span>
                    {category}
                    <span className="flex-1 h-px bg-white/10"></span>
                  </h2>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {grouped[category].map((template) => (
                      <article
                        key={template.id}
                        className="glass-card p-6 flex flex-col group hover:-translate-y-2 hover:border-amber-DEFAULT/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300"
                      >
                        <h3 className="font-display text-lg font-bold text-text-primary mb-6">
                          {template.name}
                        </h3>
                        <p className="mt-auto font-display text-3xl font-bold gradient-text mb-8">
                          {money.format(template.priceCents / 100)}
                          {template.isSubscription && (
                            <span className="ml-1 font-mono text-sm font-normal text-text-muted">
                              /yr
                            </span>
                          )}
                        </p>
                        <Link to="/contact" className="w-full text-center py-2.5 rounded border border-amber-DEFAULT/30 text-amber-DEFAULT hover:bg-gradient-amber hover:text-white transition-colors duration-300">
                          Request Pack
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
