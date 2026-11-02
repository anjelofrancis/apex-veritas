import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { Reveal, SpotlightCard, Stagger, StaggerItem } from '../components/motion';

const PRINCIPLES = [
  ['Evidence over assertion', 'A compliance claim is only worth the record behind it. Everything we run leaves a dated, attributable trail.'],
  ['Systems, not binders', 'A management system that lives in a shelf of folders fails its first surprise inspection. Ours lives where the work happens.'],
  ['Named accountability', 'You get a consultant with a name and a number, not a ticket queue.'],
];

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        eyebrow="About"
        title="A compliance department you do not have to build"
        intro="Apex Veritas exists because most operations need a full HSEQ function and can only justify a fraction of one."
      />
      <section className="mx-auto grid max-w-[1280px] items-start gap-16 px-6 py-24 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="space-y-6 text-lg leading-relaxed text-text-secondary">
          <h2 className="mb-8 font-display text-4xl font-bold">Our mission</h2>
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
        </Reveal>

        <div>
          <Reveal>
            <h2 className="mb-6 font-mono text-sm font-medium uppercase tracking-widest text-amber">
              Operating principles
            </h2>
          </Reveal>
          <Stagger className="space-y-5">
            {PRINCIPLES.map(([title, body]) => (
              <StaggerItem key={title}>
                <SpotlightCard className="p-6">
                  <h3 className="mb-3 font-display text-xl font-bold">{title}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{body}</p>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <Reveal className="flex flex-wrap justify-center gap-5 px-6 pb-16">
        <Link to="/contact" className="btn-primary">Book Free Consultation</Link>
        <Link to="/solutions" className="btn-secondary">See what we run</Link>
      </Reveal>
    </main>
  );
}
