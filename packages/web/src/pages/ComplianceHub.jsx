import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { EASE, Reveal } from '../components/motion';

const JURISDICTIONS = [
  {
    name: 'Kenya',
    regulator: 'DOSHS · NEMA',
    items: [
      ['OSHA 2007', 'Occupational Safety and Health Act — the primary duty of care, registration of workplaces, safety committees.'],
      ['WIBA 2007', 'Work Injury Benefits Act — compulsory employee injury cover and reporting.'],
      ['EMCA 1999', 'Environmental Management and Co-ordination Act — EIA licensing, effluent and emissions permits.'],
      ['Factories Act Cap 514', 'Machinery, pressure vessel and lifting equipment examination regimes.'],
      ['NEMA Waste Regs 2006', 'Hazardous waste classification, transport licensing and manifests.'],
    ],
  },
  {
    name: 'United Arab Emirates',
    regulator: 'MOHRE · Local OSH authorities',
    items: [
      ['Federal Decree-Law 33 of 2021', 'Labour relations — working hours, heat stress, worker welfare.'],
      ['Ministerial Resolution on OSH', 'Employer OSH management system obligations and incident notification.'],
      ['Emirate OSH systems', 'Abu Dhabi OSHAD-SF and Dubai municipality requirements applied per emirate.'],
      ['Federal Law 24 of 1999', 'Environmental protection and development — permits and discharge limits.'],
    ],
  },
  {
    name: 'Management standards',
    regulator: 'ISO · Certification bodies',
    items: [
      ['ISO 45001:2018', 'Occupational health and safety management systems.'],
      ['ISO 14001:2015', 'Environmental management systems.'],
      ['ISO 9001:2015', 'Quality management systems.'],
      ['ISO 22000:2018', 'Food safety management, for agro-processing operations.'],
    ],
  },
];

const ALL = 'All';

export default function ComplianceHub() {
  const [filter, setFilter] = useState(ALL);
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return JURISDICTIONS.filter((j) => filter === ALL || j.name === filter).flatMap((j) =>
      j.items
        .filter(([ref, summary]) => !q || `${ref} ${summary}`.toLowerCase().includes(q))
        .map(([ref, summary]) => ({ ref, summary, jurisdiction: j.name, regulator: j.regulator })),
    );
  }, [filter, query]);

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        eyebrow="Compliance Hub"
        title="The statutes and standards we build registers from"
        intro="A plain-language index of the obligations that apply across Kenya, the UAE, and the ISO management standards. Your register is built from these, filtered to your sites."
      />
      <section className="mx-auto max-w-[1000px] px-6 py-24">
        <Reveal className="flex flex-col gap-5">
          <div>
            <label htmlFor="hub-search" className="field-label">Search the index</label>
            <input
              id="hub-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “waste”, “ISO 45001” or “injury”"
              className="field"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by jurisdiction">
            {[ALL, ...JURISDICTIONS.map((j) => j.name)].map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={filter === name}
                onClick={() => setFilter(name)}
                className="relative rounded-full border border-divider px-4 py-2 text-sm"
              >
                {filter === name && (
                  <motion.span
                    layoutId="hub-filter"
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

        <p aria-live="polite" className="mb-4 mt-8 font-mono text-xs uppercase tracking-widest text-text-muted">
          {rows.length} {rows.length === 1 ? 'entry' : 'entries'}
        </p>

        <motion.ul layout className="space-y-3">
          <AnimatePresence initial={false}>
            {rows.map((row) => (
              <motion.li
                key={row.ref}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="glass-card flex flex-col gap-3 p-5 sm:flex-row sm:gap-8 sm:p-6"
              >
                <div className="shrink-0 sm:w-56">
                  <p className="font-mono text-sm font-medium text-text-primary">{row.ref}</p>
                  <p className="mt-1 text-xs text-text-muted">{row.regulator}</p>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-text-secondary">{row.summary}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {rows.length === 0 && (
          <p className="glass-card p-8 text-center text-text-secondary">
            Nothing in the index matches that.{' '}
            <Link to="/contact" className="text-text-primary underline underline-offset-4">Ask a consultant</Link>.
          </p>
        )}

        <Reveal className="glass-card mt-14 border-amber/40 p-8">
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-amber">Not legal advice</p>
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
            This index is a working summary maintained by our consultants, not a legal
            interpretation. Obligations change and apply differently by site, headcount and activity.{' '}
            <Link to="/contact" className="text-text-primary underline underline-offset-4 hover:text-amber">
              Ask us to confirm what applies to you
            </Link>
            .
          </p>
        </Reveal>
      </section>
    </main>
  );
}
