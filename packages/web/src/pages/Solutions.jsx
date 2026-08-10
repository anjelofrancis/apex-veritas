import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const SOLUTIONS = [
  {
    name: 'Virtual HSEQ Manager',
    body: 'A named consultant embedded in your operation — running the management system, chairing safety committees, and answering the regulator on your behalf.',
    deliverables: ['Monthly management review', 'Regulator correspondence', 'Board-level HSEQ report'],
    accent: 'amber'
  },
  {
    name: 'Regulatory Compliance & Alerts',
    body: 'A live legal register for every jurisdiction you operate in, with the obligation, the evidence required, and the date it falls due.',
    deliverables: ['Jurisdiction legal register', 'Change alerts', 'Evidence pack per obligation'],
    accent: 'teal'
  },
  {
    name: 'ISO Management Systems',
    body: 'Documented systems built to ISO 45001, 14001 and 9001, taken from gap analysis through to certification audit.',
    deliverables: ['Gap analysis', 'Full documentation set', 'Certification audit support'],
    accent: 'amber'
  },
  {
    name: 'Audit & Inspection Management',
    body: 'Scheduled internal audits and site inspections with digital checklists, findings tracked to closure through CAPA.',
    deliverables: ['Audit programme', 'Digital checklists', 'Findings and CAPA register'],
    accent: 'teal'
  },
  {
    name: 'Risk & Incident Management',
    body: 'Incident capture from any device, structured 5-why and fishbone investigation, and corrective actions with owners and due dates.',
    deliverables: ['Risk assessments', 'Investigation records', 'CAPA tracking to closure'],
    accent: 'amber'
  },
  {
    name: 'Document Control System',
    body: 'Version-controlled procedures with approval workflow and expiry alerts, so the copy on site is always the current one.',
    deliverables: ['Controlled document library', 'Approval workflow', 'Expiry notifications'],
    accent: 'teal'
  },
  {
    name: 'Digital Training & Competency',
    body: 'A training matrix that knows who is qualified for what, and tells you before a certification lapses.',
    deliverables: ['Competency matrix', 'Course records', 'Expiry alerts'],
    accent: 'amber'
  },
  {
    name: 'Tender & Contractor Compliance',
    body: 'Prequalification packs and contractor assurance, assembled to the standard your clients audit against.',
    deliverables: ['Prequalification packs', 'Contractor assurance', 'Tender documentation'],
    accent: 'teal'
  },
];

export default function Solutions() {
  const [gridRef, , gridClass] = useScrollAnimation({ threshold: 0.1 });

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        eyebrow="Solutions"
        title="Eight systems that make up a compliance department"
        intro="Take the whole department or the parts you are missing. Each system works on its own and shares one record of your operation."
        docRef="AV-SOL-01"
      />

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none"></div>
        
        <div className="mx-auto max-w-[1280px] px-6 relative z-10" ref={gridRef}>
          <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}>
            {SOLUTIONS.map((solution, i) => (
              <article 
                key={solution.name} 
                className={`glass-card p-8 flex flex-col group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  solution.accent === 'amber' ? 'hover:border-amber-DEFAULT/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'hover:border-teal-DEFAULT/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]'
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500 ${
                  solution.accent === 'amber' ? 'bg-amber-DEFAULT/10 group-hover:bg-amber-DEFAULT text-amber-DEFAULT group-hover:text-white' : 'bg-teal-DEFAULT/10 group-hover:bg-teal-DEFAULT text-teal-DEFAULT group-hover:text-white'
                }`}>
                  <span className="font-mono text-lg font-bold">{String(i + 1).padStart(2, '0')}</span>
                </div>
                
                <h2 className="font-display text-xl font-bold text-text-primary mb-3">{solution.name}</h2>
                <p className="text-text-secondary text-sm leading-relaxed mb-8 flex-1">{solution.body}</p>
                
                <div className="mt-auto pt-6 border-t border-divider">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-3">Key Deliverables</p>
                  <ul className="space-y-2">
                    {solution.deliverables.map((item) => (
                      <li key={item} className="flex gap-2.5 items-start text-sm text-text-primary">
                        <span aria-hidden="true" className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${solution.accent === 'amber' ? 'bg-amber-DEFAULT' : 'bg-teal-DEFAULT'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-6">
            <Link to="/pricing" className="btn-primary">
              See how it is priced
            </Link>
            <Link to="/industries" className="btn-secondary">
              How this applies to your sector
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
