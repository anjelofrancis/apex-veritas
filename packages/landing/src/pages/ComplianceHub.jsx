import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

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

export default function ComplianceHub() {
  const [contentRef, , contentClass] = useScrollAnimation({ threshold: 0.05 });

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        eyebrow="Compliance Hub"
        title="The statutes and standards we build registers from"
        intro="A plain-language index of the obligations that apply across Kenya, the UAE, and the ISO management standards. Your register is built from these, filtered to your sites."
        docRef="AV-HUB-01"
      />

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-10 pointer-events-none"></div>
        
        <div className="mx-auto max-w-[1000px] px-6 relative z-10" ref={contentRef}>
          <div className={`space-y-16 ${contentClass}`}>
            {JURISDICTIONS.map((jurisdiction, i) => (
              <div key={jurisdiction.name} className="glass-card p-8 sm:p-10" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-divider pb-6 mb-8">
                  <h2 className="font-display text-3xl font-bold text-text-primary">
                    {jurisdiction.name}
                  </h2>
                  <p className="font-mono text-xs uppercase tracking-widest text-teal-DEFAULT bg-teal-DEFAULT/10 px-3 py-1.5 rounded">
                    {jurisdiction.regulator}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {jurisdiction.items.map(([ref, summary]) => (
                    <div key={ref} className="bg-white/5 border border-divider rounded-lg p-5 sm:p-6 hover:border-teal-DEFAULT/30 transition-colors flex flex-col sm:flex-row gap-4 sm:gap-8">
                      <dt className="font-mono text-sm font-bold text-text-primary shrink-0 sm:w-48 pt-1">
                        {ref}
                      </dt>
                      <dd className="text-sm text-text-secondary leading-relaxed flex-1">
                        {summary}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 glass-card p-8 border-amber-DEFAULT/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-DEFAULT/10 blur-[60px] pointer-events-none"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-amber-DEFAULT/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-amber-DEFAULT font-bold mb-2">
                  Not legal advice
                </p>
                <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
                  This index is a working summary maintained by our consultants, not a legal
                  interpretation. Obligations change and apply differently by site, headcount and
                  activity.{' '}
                  <Link to="/contact" className="text-text-primary hover:text-amber-DEFAULT underline underline-offset-4 transition-colors">
                    Ask us to confirm what applies to you
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
