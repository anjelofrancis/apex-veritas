import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const GUIDES = [
  {
    title: 'Preparing for an ISO 45001 certification audit',
    kind: 'Guide',
    summary: 'What the certification body asks for, in the order they ask for it, and the evidence that satisfies each clause.',
  },
  {
    title: 'Building a legal register that survives inspection',
    kind: 'Guide',
    summary: 'Structuring obligations so an inspector can trace a statute to the evidence in under a minute.',
  },
  {
    title: 'Incident investigation: 5-why without the guesswork',
    kind: 'Method',
    summary: 'Running a root-cause session that lands on a system failure rather than stopping at operator error.',
  },
  {
    title: 'Contractor prequalification for East African tenders',
    kind: 'Checklist',
    summary: 'The HSEQ documentation package most operators require before a contractor gets on site.',
  },
];

export default function Resources() {
  const [gridRef, , gridClass] = useScrollAnimation({ threshold: 0.1 });

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        eyebrow="Resources"
        title="Guides, methods and regulatory notes"
        intro="Practical material written by the consultants who run these systems day to day."
        docRef="AV-RES-01"
      />

      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-DEFAULT/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="mx-auto max-w-[1280px] px-6 relative z-10" ref={gridRef}>
          <div className={`grid gap-6 md:grid-cols-2 ${gridClass}`}>
            {GUIDES.map((guide, i) => (
              <article key={guide.title} className="glass-card p-8 sm:p-10 flex flex-col group relative overflow-hidden" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <span className="font-mono text-sm uppercase tracking-widest text-amber-DEFAULT bg-background/80 px-4 py-2 rounded border border-amber-DEFAULT/30 shadow-lg">In Preparation</span>
                </div>
                
                <div className="relative z-0">
                  <p className="inline-block px-3 py-1 rounded bg-teal-DEFAULT/10 border border-teal-DEFAULT/20 font-mono text-[10px] uppercase tracking-widest text-teal-DEFAULT mb-6">
                    {guide.kind}
                  </p>
                  <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
                    {guide.title}
                  </h2>
                  <p className="text-text-secondary text-sm leading-relaxed mb-6">{guide.summary}</p>
                  
                  <div className="w-12 h-1 bg-gradient-to-r from-teal-DEFAULT/30 to-transparent rounded-full mt-auto"></div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 glass-card p-8 sm:p-10 border-divider text-center max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
              The library is being written
            </h2>
            <p className="max-w-2xl mx-auto text-text-secondary leading-relaxed mb-8">
              These pieces are in preparation and will publish here as they are finished. In the
              meantime our consultants answer the same questions directly — usually faster than
              reading the guide would have been.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-primary">
                Ask a consultant
              </Link>
              <Link to="/templates" className="btn-secondary">
                Browse ready-made templates
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
