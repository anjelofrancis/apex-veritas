import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { Reveal, SpotlightCard, Stagger, StaggerItem } from '../components/motion';

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
  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        eyebrow="Resources"
        title="Guides, methods and regulatory notes"
        intro="Practical material written by the consultants who run these systems day to day."
      />
      <section className="mx-auto max-w-[1280px] px-6 py-24">
        <Stagger className="grid gap-6 md:grid-cols-2">
          {GUIDES.map((guide) => (
            <StaggerItem key={guide.title}>
              <SpotlightCard className="h-full p-8 sm:p-10">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-teal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-teal">
                    {guide.kind}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber">In preparation</span>
                </div>
                <h2 className="font-display text-2xl font-bold">{guide.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">{guide.summary}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="glass-card mx-auto mt-16 max-w-4xl p-8 text-center sm:p-10">
          <h2 className="mb-4 font-display text-2xl font-bold">The library is being written</h2>
          <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-text-secondary">
            These pieces are in preparation and will publish here as they are finished. In the
            meantime our consultants answer the same questions directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary">Ask a consultant</Link>
            <Link to="/templates" className="btn-secondary">Browse ready-made templates</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
