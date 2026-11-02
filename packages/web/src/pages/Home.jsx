import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import LiveRegister from '../components/LiveRegister';
import { Aurora, EASE, Marquee, Reveal, SplitHeadline } from '../components/motion';
import { SOLUTIONS } from '../data/solutions';

const PORTAL_URL = import.meta.env.VITE_PORTAL_URL || 'http://localhost:5173';

const FRAMEWORKS = [
  'OSHA 2007', 'WIBA 2007', 'EMCA 1999', 'Factories Act Cap 514', 'ISO 45001',
  'ISO 14001', 'ISO 9001', 'ISO 22000', 'UAE Federal OSH', 'OSHAD-SF',
];

const STEPS = [
  ['Onboarding & Assessment', 'We map your sites, activities and jurisdictions against the obligations that apply.'],
  ['System Setup & Document Migration', 'Your register, procedures and records move into one controlled system.'],
  ['Daily Compliance Operations', 'A named consultant runs the system alongside your team.'],
  ['Continuous Monitoring & Alerts', 'Due dates, expiries and regulatory changes surface before they become findings.'],
  ['Reporting, Audits & Improvement', 'Reviews and audits feed corrective actions, and the system keeps improving.'],
];

function SolutionExplorer() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const reduced = useReducedMotion();
  const solution = SOLUTIONS[active];

  useEffect(() => {
    if (touched || reduced) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % SOLUTIONS.length), 4500);
    return () => clearInterval(id);
  }, [touched, reduced]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
      <div role="tablist" aria-label="Solutions" aria-orientation="vertical" className="flex flex-col">
        {SOLUTIONS.map((item, i) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            id={`solution-tab-${i}`}
            aria-selected={i === active}
            aria-controls="solution-panel"
            onClick={() => { setTouched(true); setActive(i); }}
            onMouseEnter={() => { setTouched(true); setActive(i); }}
            className="relative flex items-center gap-4 border-b border-divider px-4 py-4 text-left"
          >
            {i === active && (
              <motion.span
                layoutId="solution-highlight"
                aria-hidden="true"
                className="absolute inset-0 rounded-lg bg-amber/10"
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />
            )}
            <span className={`relative font-mono text-xs ${i === active ? 'text-amber' : 'text-text-muted'}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={`relative font-display text-lg font-semibold transition-colors ${i === active ? 'text-text-primary' : 'text-text-secondary'}`}>
              {item.name}
            </span>
          </button>
        ))}
      </div>

      <div
        id="solution-panel"
        role="tabpanel"
        aria-labelledby={`solution-tab-${active}`}
        className="glass-card relative min-h-[420px] overflow-hidden p-8 sm:p-12 lg:sticky lg:top-28 lg:self-start"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={solution.name}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <p aria-hidden="true" className="font-display text-7xl font-bold text-amber/20 sm:text-8xl">
              {String(active + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-4 font-display text-3xl font-bold">{solution.name}</h3>
            <p className="mt-4 text-lg leading-relaxed text-text-secondary">{solution.body}</p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {solution.deliverables.map((d, i) => (
                <motion.li
                  key={d}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.12 + i * 0.07 }}
                  className="rounded-full border border-divider bg-background px-4 py-2 text-sm text-text-primary"
                >
                  {d}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });

  return (
    <div ref={ref} className="relative mx-auto max-w-3xl">
      <div aria-hidden="true" className="absolute bottom-3 left-[23px] top-3 w-0.5 bg-divider" />
      <motion.div
        aria-hidden="true"
        style={{ scaleY: scrollYProgress }}
        className="absolute bottom-3 left-[23px] top-3 w-0.5 origin-top bg-gradient-to-b from-amber to-teal"
      />
      <ol className="space-y-12">
        {STEPS.map(([title, body], i) => (
          <li key={title}>
            <Reveal className="relative flex gap-6">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-divider bg-surface font-mono text-sm font-medium text-text-primary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-1">
                <h3 className="font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-text-secondary">{body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Home() {
  const { scrollY } = useScroll();
  const panelY = useTransform(scrollY, [0, 700], [0, -70]);
  const copyY = useTransform(scrollY, [0, 700], [0, 50]);

  return (
    <main className="overflow-hidden bg-background">
      <section className="dark relative flex min-h-screen items-center bg-background pb-20 pt-32">
        <Aurora />
        <div className="relative z-10 mx-auto grid w-full max-w-[1280px] items-center gap-14 px-6 lg:grid-cols-[1.15fr_1fr]">
          <motion.div style={{ y: copyY }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6 font-mono text-sm uppercase tracking-widest text-amber"
            >
              Health · Safety · Environment · Quality
            </motion.p>
            <SplitHeadline
              text="Your Virtual HSEQ & Compliance Department"
              className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl xl:text-7xl"
            />
            <Reveal delay={0.5} y={16}>
              <p className="mt-7 max-w-xl text-xl leading-relaxed text-text-secondary">
                Cloud-based HSEQ management, regulatory intelligence, and expert virtual support
                in one platform.
              </p>
            </Reveal>
            <Reveal delay={0.65} y={16}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/contact" className="btn-primary">Book Free Consultation</Link>
                <Link to="/compliance-hub" className="btn-secondary">See what applies to you</Link>
                <a href={PORTAL_URL} className="btn-tertiary">Client Portal →</a>
              </div>
            </Reveal>
          </motion.div>

          <motion.div
            style={{ y: panelY }}
            initial={{ opacity: 0, scale: 0.95, rotate: 1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
          >
            <LiveRegister />
          </motion.div>
        </div>
      </section>

      <section className="border-y border-divider bg-surface py-6">
        <Marquee items={FRAMEWORKS} />
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-28">
        <Reveal className="mb-14 max-w-3xl">
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-teal">Core solutions</p>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">Eight systems, one department</h2>
          <p className="mt-5 text-lg text-text-secondary">
            Take the whole department or just the parts you are missing.
          </p>
        </Reveal>
        <Reveal><SolutionExplorer /></Reveal>
      </section>

      <section className="border-y border-divider bg-surface py-28">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 font-mono text-sm uppercase tracking-widest text-amber">How it works</p>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">
              From onboarding to continuous improvement
            </h2>
          </Reveal>
          <Timeline />
        </div>
      </section>

      <section className="dark relative overflow-hidden bg-background py-36">
        <Aurora />
        <Reveal className="relative z-10 mx-auto max-w-[1280px] px-6 text-center">
          <h2 className="mx-auto max-w-4xl font-display text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Stay audit-ready, <span className="gradient-text">every day of the year.</span>
          </h2>
          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <Link to="/contact" className="btn-primary !px-10 !py-4 text-base">Book Free Consultation</Link>
            <Link to="/pricing" className="btn-secondary !px-10 !py-4 text-base">See Pricing</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
