import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { EASE, Reveal } from '../components/motion';

const INDUSTRIES = [
  {
    name: 'Manufacturing',
    pressures: 'Machinery guarding, pressure vessels, effluent discharge, shift-work fatigue.',
    regs: ['OSHA 2007', 'Factories Act Cap 514', 'EMCA 1999'],
  },
  {
    name: 'Construction',
    pressures: 'Work at height, lifting operations, subcontractor competency, site-by-site permits.',
    regs: ['OSHA 2007', 'ISO 45001', 'Client prequalification'],
  },
  {
    name: 'Marine & Offshore',
    pressures: 'Confined-space entry, dry-dock isolation, port state control, crew certification.',
    regs: ['UAE Federal OSH', 'ISM Code', 'ISO 14001'],
  },
  {
    name: 'Oil, Gas & Energy',
    pressures: 'Permit-to-work discipline, process safety, contractor assurance, emergency response.',
    regs: ['ISO 45001', 'Process safety standards', 'Environmental permits'],
  },
  {
    name: 'Logistics & Warehousing',
    pressures: 'Forklift and pedestrian separation, racking integrity, dangerous goods handling.',
    regs: ['OSHA 2007', 'ADR / IMDG', 'WIBA 2007'],
  },
  {
    name: 'Agriculture & Agro-processing',
    pressures: 'Agrochemical handling, seasonal labour induction, cold-chain hygiene.',
    regs: ['OSHA 2007', 'Pest Control Products Act', 'ISO 22000'],
  },
];

export default function Industries() {
  const [active, setActive] = useState(0);
  const industry = INDUSTRIES[active];

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        eyebrow="Industries"
        title="Compliance shaped to the risks you actually carry"
        intro="The obligations that matter differ by sector. We start from the hazards on your sites and the regulators who inspect them."
      />
      <section className="mx-auto max-w-[1280px] px-6 py-24">
        <Reveal className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div role="tablist" aria-label="Industries" aria-orientation="vertical" className="flex flex-col gap-1">
            {INDUSTRIES.map((item, i) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                id={`industry-tab-${i}`}
                aria-selected={i === active}
                aria-controls="industry-panel"
                onClick={() => setActive(i)}
                className="relative rounded-lg px-5 py-4 text-left"
              >
                {i === active && (
                  <motion.span
                    layoutId="industry-highlight"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-lg bg-teal/10 ring-1 ring-teal/30"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
                <span className={`relative font-display text-lg font-semibold ${i === active ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {item.name}
                </span>
              </button>
            ))}
          </div>

          <div
            id="industry-panel"
            role="tabpanel"
            aria-labelledby={`industry-tab-${active}`}
            className="glass-card min-h-[340px] p-8 sm:p-12"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <h2 className="font-display text-3xl font-bold sm:text-4xl">{industry.name}</h2>
                <p className="mt-5 text-lg leading-relaxed text-text-secondary">{industry.pressures}</p>
                <p className="mb-3 mt-10 font-mono text-[11px] uppercase tracking-widest text-text-muted">
                  Typical framework
                </p>
                <ul className="flex flex-wrap gap-2">
                  {industry.regs.map((reg, i) => (
                    <motion.li
                      key={reg}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.07 }}
                      className="rounded-full border border-divider bg-background px-4 py-2 font-mono text-xs text-text-primary"
                    >
                      {reg}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal className="glass-card mx-auto mt-20 max-w-3xl p-8 text-center">
          <p className="mb-6 text-text-secondary">
            Operating in a sector not listed here? The underlying systems are the same — the legal
            register and risk profile are what get rebuilt.
          </p>
          <Link to="/contact" className="btn-primary">Tell us about your operation</Link>
        </Reveal>
      </section>
    </main>
  );
}
