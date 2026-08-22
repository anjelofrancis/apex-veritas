import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

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
  const [gridRef, , gridClass] = useScrollAnimation({ threshold: 0.1 });

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        eyebrow="Industries"
        title="Compliance shaped to the risks you actually carry"
        intro="The obligations that matter differ by sector. We start from the hazards on your sites and the regulators who inspect them."
        docRef="AV-IND-01"
      />

      <section className="relative py-24 overflow-hidden">
        <div className="absolute -left-64 top-1/4 w-[500px] h-[500px] bg-teal-DEFAULT/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -right-64 bottom-1/4 w-[500px] h-[500px] bg-amber-DEFAULT/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="mx-auto max-w-[1280px] px-6 relative z-10" ref={gridRef}>
          <div className={`grid gap-8 md:grid-cols-2 lg:grid-cols-3 ${gridClass}`}>
            {INDUSTRIES.map((industry, i) => (
              <article 
                key={industry.name} 
                className="glass-card p-8 flex flex-col group hover:-translate-y-2 hover:border-white/30 transition-all duration-500"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="w-12 h-1 bg-gradient-to-r from-teal-DEFAULT to-amber-DEFAULT rounded-full mb-6"></div>
                <h2 className="font-display text-2xl font-bold text-text-primary mb-3 group-hover:text-teal-DEFAULT transition-colors duration-300">{industry.name}</h2>
                <p className="text-text-secondary text-sm leading-relaxed mb-8 flex-1">{industry.pressures}</p>
                
                <div className="mt-auto pt-6 border-t border-divider">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-3">
                    Typical framework
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {industry.regs.map((reg) => (
                      <li
                        key={reg}
                        className="bg-white/5 border border-divider px-3 py-1.5 rounded text-xs font-mono text-text-primary"
                      >
                        {reg}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-20 glass-card p-8 text-center max-w-3xl mx-auto border-divider">
            <p className="text-text-secondary mb-6">
              Operating in a sector not listed here? The underlying systems are the same — the legal
              register and risk profile are what get rebuilt.
            </p>
            <Link to="/contact" className="btn-primary">
              Tell us about your operation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
