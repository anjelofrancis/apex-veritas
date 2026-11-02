import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { Reveal, SpotlightCard, Stagger, StaggerItem } from '../components/motion';
import { SOLUTIONS } from '../data/solutions';

export default function Solutions() {
  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        eyebrow="Solutions"
        title="Eight systems that make up a compliance department"
        intro="Take the whole department or the parts you are missing. Each system works on its own and shares one record of your operation."
      />
      <section className="mx-auto max-w-[1280px] px-6 py-24">
        <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {SOLUTIONS.map((solution, i) => (
            <StaggerItem key={solution.name}>
              <SpotlightCard className="h-full p-8">
                <span className="font-mono text-sm font-medium text-amber">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="mt-4 font-display text-xl font-bold">{solution.name}</h2>
                <p className="mb-8 mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{solution.body}</p>
                <div className="border-t border-divider pt-5">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">Key deliverables</p>
                  <ul className="space-y-2">
                    {solution.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-text-primary">
                        <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-16 flex flex-wrap justify-center gap-5">
          <Link to="/pricing" className="btn-primary">See how it is priced</Link>
          <Link to="/industries" className="btn-secondary">How this applies to your sector</Link>
        </Reveal>
      </section>
    </main>
  );
}
