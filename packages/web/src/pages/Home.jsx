import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useCountUp } from '../hooks/useCountUp';

const PORTAL_URL = import.meta.env.VITE_PORTAL_URL || 'http://localhost:5173';

const SOLUTIONS = [
  { id: '01', title: 'Virtual HSEQ Manager', desc: 'Expert guidance on demand without the overhead.' },
  { id: '02', title: 'Regulatory Compliance & Alerts', desc: 'Stay ahead of changes in Kenya, UAE, and East Africa.' },
  { id: '03', title: 'ISO Management Systems', desc: 'Turnkey 9001, 14001, and 45001 implementation.' },
  { id: '04', title: 'Audit & Inspection Management', desc: 'Streamline your internal and external audits.' },
  { id: '05', title: 'Risk & Incident Management', desc: 'Proactive hazard identification and incident tracking.' },
  { id: '06', title: 'Document Control System', desc: 'Secure, version-controlled repository for all policies.' },
  { id: '07', title: 'Digital Training & Competency', desc: 'Track employee certifications and training matrices.' },
  { id: '08', title: 'Tender & Contractor Compliance', desc: 'Prequalify contractors and win more tenders.' },
];

const STEPS = [
  ['01', 'Onboarding & Assessment'],
  ['02', 'System Setup & Document Migration'],
  ['03', 'Daily Compliance Operations'],
  ['04', 'Continuous Monitoring & Alerts'],
  ['05', 'Reporting, Audits & Improvement'],
];

function StatCard({ label, value, suffix = '', delay = '0s' }) {
  const [ref, isVisible, className] = useScrollAnimation({ threshold: 0.5 });
  const [countRef, count] = useCountUp(value, 2500);

  return (
    <div ref={ref} className={`glass-card p-6 flex flex-col items-center justify-center border-amber-DEFAULT/30 ${className}`} style={{ animationDelay: delay }}>
      <div className="text-3xl font-display font-bold gradient-text" ref={countRef}>
        {count}{suffix}
      </div>
      <div className="text-xs font-mono uppercase tracking-wider text-text-muted mt-2 text-center">
        {label}
      </div>
    </div>
  );
}

export default function Home() {
  const [heroRef, , heroClass] = useScrollAnimation();
  const [trustedRef, , trustedClass] = useScrollAnimation();
  const [solutionsRef, , solutionsClass] = useScrollAnimation();
  const [stepsRef, , stepsClass] = useScrollAnimation();
  const [ctaRef, , ctaClass] = useScrollAnimation();

  return (
    <main className="bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 mix-blend-screen"></div>
        
        {/* Floating gradient shapes */}
        <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-amber-DEFAULT/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-teal-DEFAULT/20 rounded-full blur-[150px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative mx-auto max-w-[1280px] px-6 py-20 w-full grid lg:grid-cols-12 gap-12 items-center z-10" ref={heroRef}>
          <div className={`lg:col-span-7 ${heroClass}`}>
            <p className="font-mono text-sm uppercase tracking-widest text-amber-DEFAULT drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] mb-6 animate-fade-in-up">
              HSEQ &amp; Compliance — Platform Overview
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Your Virtual <span className="gradient-text">HSEQ &amp; Compliance</span> Department
            </h1>
            <p className="mt-6 max-w-xl text-text-secondary text-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Cloud-based HSEQ management, regulatory intelligence, and expert virtual
              support in one premium platform.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/contact" className="btn-primary">Book Free Consultation</Link>
              <Link to="/compliance-hub" className="btn-secondary">See what applies to you</Link>
            </div>
            <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <a href={PORTAL_URL} className="btn-tertiary">Login to Client Portal →</a>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative h-full min-h-[400px] flex items-center justify-center animate-float">
             <div className="absolute top-10 left-10 z-20">
                <StatCard label="Compliance Items Tracked" value="500" suffix="+" delay="0.5s" />
             </div>
             <div className="absolute bottom-10 right-10 z-20">
                <StatCard label="Uptime" value="99" suffix=".9%" delay="0.7s" />
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 scale-125">
                <div className="glass-card p-6 border-teal-DEFAULT/30 shadow-[0_0_50px_rgba(20,184,166,0.15)] flex flex-col items-center justify-center">
                   <div className="w-16 h-16 rounded-full bg-gradient-teal flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                   </div>
                   <div className="text-xl font-display font-bold text-text-primary text-center">24/7 Expert<br/>Support</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="relative z-10 -mt-10" ref={trustedRef}>
        <div className="mx-auto max-w-4xl px-6">
          <div className={`glass-card p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 border-t border-white/20 shadow-2xl ${trustedClass}`}>
            <span className="font-mono text-sm uppercase tracking-widest text-text-muted">Trusted in</span>
            <div className="flex items-center gap-4 text-text-primary font-medium">
              <span>Kenya</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-DEFAULT"></span>
              <span>UAE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-DEFAULT"></span>
              <span>East Africa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Solutions Section */}
      <section className="mx-auto max-w-[1280px] px-6 py-32" ref={solutionsRef}>
        <div className={`text-center max-w-3xl mx-auto mb-16 ${solutionsClass}`}>
          <p className="font-mono text-sm uppercase tracking-widest text-teal-DEFAULT drop-shadow-[0_0_8px_rgba(20,184,166,0.6)] mb-4">Core Solutions</p>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-text-primary">Eight systems, one department</h2>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((solution, i) => (
            <Link
              key={solution.title}
              to="/solutions"
              className="glass-card p-8 group hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-DEFAULT/50 transition-all duration-500"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-teal flex items-center justify-center mb-6 group-hover:bg-gradient-amber transition-colors duration-500">
                 <span className="font-mono font-bold text-text-primary">{solution.id}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-3 group-hover:text-amber-DEFAULT transition-colors duration-300">{solution.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{solution.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 bg-surface/50 border-y border-white/5" ref={stepsRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-DEFAULT/5 to-transparent pointer-events-none"></div>
        <div className="mx-auto max-w-[1280px] px-6 relative z-10">
          <div className={`text-center max-w-3xl mx-auto mb-20 ${stepsClass}`}>
            <p className="font-mono text-sm uppercase tracking-widest text-amber-DEFAULT drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] mb-4">How It Works</p>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-text-primary">From onboarding to continuous improvement</h2>
          </div>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-gradient-to-r from-teal-DEFAULT via-amber-DEFAULT to-teal-DEFAULT opacity-30 rounded-full"></div>
            
            <div className="grid gap-6 lg:gap-8 lg:grid-cols-5 relative z-10">
              {STEPS.map(([num, label], i) => (
                <div key={num} className="glass-card p-6 flex flex-col items-center text-center group hover:-translate-y-4 hover:border-teal-DEFAULT/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] transition-all duration-500" style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className="w-16 h-16 rounded-full bg-background border-2 border-divider flex items-center justify-center mb-6 group-hover:border-teal-DEFAULT group-hover:scale-110 transition-all duration-500 shadow-xl relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-teal opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                     <span className="font-mono text-xl text-text-primary font-bold">{num}</span>
                  </div>
                  <h3 className="font-body text-lg text-text-primary font-medium group-hover:text-teal-DEFAULT transition-colors duration-300">{label}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-40 overflow-hidden" ref={ctaRef}>
        <div className="absolute inset-0 bg-gradient-mesh opacity-50 mix-blend-screen pointer-events-none"></div>
        <div className={`mx-auto max-w-[1280px] px-6 text-center relative z-10 ${ctaClass}`}>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-text-primary max-w-4xl mx-auto leading-tight">
            Stay audit-ready, <br/>
            <span className="gradient-text">every day of the year.</span>
          </h2>
          <div className="w-32 h-1 mx-auto bg-gradient-to-r from-amber-DEFAULT to-teal-DEFAULT rounded-full mt-12 mb-12"></div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/contact" className="btn-primary !px-10 !py-4 text-lg">Book Free Consultation</Link>
            <Link to="/pricing" className="btn-secondary !px-10 !py-4 text-lg">See Pricing</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
