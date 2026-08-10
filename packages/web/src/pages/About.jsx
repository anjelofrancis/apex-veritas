import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const PRINCIPLES = [
  ['Evidence over assertion', 'A compliance claim is only worth the record behind it. Everything we run leaves a dated, attributable trail.'],
  ['Systems, not binders', 'A management system that lives in a shelf of folders fails its first surprise inspection. Ours lives where the work happens.'],
  ['Named accountability', 'You get a consultant with a name and a number, not a ticket queue.'],
];

export default function About() {
  const [contentRef, , contentClass] = useScrollAnimation({ threshold: 0.1 });

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        eyebrow="About"
        title="A compliance department you do not have to build"
        intro="Apex Veritas exists because most operations need a full HSEQ function and can only justify a fraction of one."
        docRef="AV-ABT-01"
      />

      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-DEFAULT/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="mx-auto max-w-[1280px] px-6 relative z-10" ref={contentRef}>
          <div className={`grid gap-16 lg:grid-cols-[1.5fr_1fr] items-start ${contentClass}`}>
            
            <div className="glass-card p-8 sm:p-12 border-divider space-y-6 text-lg text-text-secondary leading-relaxed shadow-2xl">
              <h2 className="text-3xl font-display font-bold text-text-primary mb-8">Our Mission</h2>
              <p>
                Regulators do not scale their expectations to the size of your safety team. A
                50-person plant carries broadly the same statutory duties as a 500-person one:
                the same registers, the same audits, the same evidence when an inspector arrives.
              </p>
              <p>
                We close that gap by running the department remotely. The platform holds the
                record — legal register, documents, audits, incidents, training, actions — and a
                consultant runs it alongside your team, on site when it matters and on the system
                every day in between.
              </p>
              <p>
                We work across Kenya, the UAE and the wider East African region, in manufacturing,
                construction, marine, energy, logistics and agro-processing.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="font-mono text-sm uppercase tracking-widest text-amber-DEFAULT mb-8 pl-2 border-l-2 border-amber-DEFAULT">
                Operating Principles
              </h3>
              
              {PRINCIPLES.map(([title, body], i) => (
                <div key={title} className="glass-card p-6 border-l-4 border-l-teal-DEFAULT hover:border-l-amber-DEFAULT transition-colors duration-300" style={{ animationDelay: `${i * 0.15}s` }}>
                  <p className="font-display text-xl font-bold text-text-primary mb-3">{title}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-24 text-center">
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-amber-DEFAULT to-teal-DEFAULT rounded-full mb-12"></div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/contact" className="btn-primary">
                Book Free Consultation
              </Link>
              <Link to="/solutions" className="btn-secondary">
                See what we run
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
