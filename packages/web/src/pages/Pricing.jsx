import { useState } from 'react';
import { Link } from 'react-router-dom';

const TIERS = [
  {
    name: 'Starter',
    tier: 'STARTER',
    summary: 'One site, core compliance record-keeping.',
    basis: 'Quoted per site',
    features: [
      { name: 'Legal register with due-date alerts', included: true },
      { name: 'Document control with approval workflow', included: true },
      { name: 'Incident reporting and CAPA tracking', included: true },
      { name: 'Up to 10 portal users', included: true },
      { name: 'Email support, 2 working days', included: true },
      { name: 'Internal and external audit management', included: false },
      { name: 'ISO system templates', included: false },
      { name: 'Multi-jurisdiction registers', included: false },
    ],
  },
  {
    name: 'Professional',
    tier: 'PROFESSIONAL',
    summary: 'Multi-site operations working to ISO certification.',
    basis: 'Quoted per site',
    highlight: 'Most Popular',
    features: [
      { name: 'Everything in Starter', included: true },
      { name: 'Internal and external audit management', included: true },
      { name: 'ISO 45001 / 14001 / 9001 templates', included: true },
      { name: 'Training matrix with competency expiry', included: true },
      { name: 'Named consultant, monthly review call', included: true },
      { name: 'Unlimited portal users', included: true },
      { name: 'Multi-jurisdiction registers', included: false },
      { name: 'Quarterly on-site audit support', included: false },
    ],
  },
  {
    name: 'Enterprise',
    tier: 'ENTERPRISE',
    summary: 'Group-level assurance across jurisdictions.',
    basis: 'Custom agreement',
    features: [
      { name: 'Everything in Professional', included: true },
      { name: 'Multi-jurisdiction legal registers', included: true },
      { name: 'Contractor and tender compliance packs', included: true },
      { name: 'Custom reporting and data export', included: true },
      { name: 'Quarterly on-site audit support', included: true },
      { name: 'Priority response, same working day', included: true },
      { name: 'Custom SSO integration', included: true },
      { name: 'Dedicated account manager', included: true },
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <main className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none"></div>
      
      <div className="mx-auto max-w-[1280px] px-6 relative z-10 text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-teal-DEFAULT drop-shadow-[0_0_8px_rgba(20,184,166,0.6)] mb-4">Pricing</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text-primary max-w-3xl mx-auto leading-tight">
          Three tiers, <span className="gradient-text">one department</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-text-secondary">
          Every engagement is scoped to your sites, headcount, and jurisdictions. A consultation takes about 30 minutes and ends with a written quote.
        </p>

        {/* Toggle */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <span className={`text-sm font-medium transition-colors ${!annual ? 'text-text-primary' : 'text-text-muted'}`}>Monthly</span>
          <button 
            className="w-16 h-8 rounded-full bg-white/10 border border-white/20 relative transition-colors focus:outline-none focus:ring-2 focus:ring-amber-DEFAULT"
            onClick={() => setAnnual(!annual)}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-gradient-amber transition-transform duration-300 ${annual ? 'translate-x-8' : 'translate-x-0'}`}></div>
          </button>
          <span className={`text-sm font-medium transition-colors ${annual ? 'text-text-primary' : 'text-text-muted'}`}>
            Annually <span className="text-xs text-amber-DEFAULT bg-amber-DEFAULT/10 px-2 py-0.5 rounded-full ml-2">Save 20%</span>
          </span>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto text-left">
          {TIERS.map((tier) => (
            <div
              key={tier.tier}
              className={`glass-card p-8 relative flex flex-col transition-all duration-500 hover:-translate-y-2 ${
                tier.highlight 
                  ? 'border-amber-DEFAULT shadow-[0_0_40px_rgba(245,158,11,0.15)] transform lg:scale-105 z-10' 
                  : 'hover:border-white/30 hover:shadow-2xl'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-amber text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  {tier.highlight}
                </div>
              )}
              
              <h2 className="font-display text-2xl font-bold text-text-primary mb-2">{tier.name}</h2>
              <p className="text-text-secondary text-sm h-12">{tier.summary}</p>
              
              <div className="my-8 pt-8 border-t border-divider">
                <div className="title-block w-full justify-between bg-background/50">
                  <dt>Basis</dt>
                  <dd>{tier.basis}</dd>
                </div>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    {feature.included ? (
                      <svg className="w-5 h-5 text-teal-DEFAULT shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-text-muted/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={feature.included ? 'text-text-primary' : 'text-text-muted'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/contact" 
                className={`w-full text-center py-3 rounded-lg font-bold transition-all ${
                  tier.highlight 
                    ? 'bg-gradient-amber text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]' 
                    : 'bg-white/10 text-text-primary hover:bg-white/20 border border-divider'
                }`}
              >
                {tier.highlight ? 'Get Started' : 'Contact Sales'}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 glass-card p-10 max-w-4xl mx-auto text-left border-teal-DEFAULT/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-DEFAULT/10 blur-[80px] pointer-events-none"></div>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-4">What every tier includes</h2>
          <p className="text-text-secondary leading-relaxed">
            Data residency and tenant isolation, role-based access for your team, an audit trail on
            every record, and no charge for read-only auditor accounts during a certification visit.
            Month-to-month after the first term; export your data at any time.
          </p>
        </div>
      </div>
    </main>
  );
}
