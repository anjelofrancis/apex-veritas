import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { Reveal, SpotlightCard, Stagger, StaggerItem } from '../components/motion';

const TIERS = [
  {
    name: 'Starter',
    summary: 'One site, core compliance record-keeping.',
    basis: 'Quoted per site',
    features: [
      ['Legal register with due-date alerts', true],
      ['Document control with approval workflow', true],
      ['Incident reporting and CAPA tracking', true],
      ['Up to 10 portal users', true],
      ['Email support, 2 working days', true],
      ['Internal and external audit management', false],
      ['ISO system templates', false],
      ['Multi-jurisdiction registers', false],
    ],
  },
  {
    name: 'Professional',
    summary: 'Multi-site operations working to ISO certification.',
    basis: 'Quoted per site',
    highlight: true,
    features: [
      ['Everything in Starter', true],
      ['Internal and external audit management', true],
      ['ISO 45001 / 14001 / 9001 templates', true],
      ['Training matrix with competency expiry', true],
      ['Named consultant, monthly review call', true],
      ['Unlimited portal users', true],
      ['Multi-jurisdiction registers', false],
      ['Quarterly on-site audit support', false],
    ],
  },
  {
    name: 'Enterprise',
    summary: 'Group-level assurance across jurisdictions.',
    basis: 'Custom agreement',
    features: [
      ['Everything in Professional', true],
      ['Multi-jurisdiction legal registers', true],
      ['Contractor and tender compliance packs', true],
      ['Custom reporting and data export', true],
      ['Quarterly on-site audit support', true],
      ['Priority response, same working day', true],
      ['Custom SSO integration', true],
      ['Dedicated account manager', true],
    ],
  },
];

export default function Pricing() {
  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        eyebrow="Pricing"
        title="Three tiers, one department"
        intro="Every engagement is scoped to your sites, headcount, and jurisdictions. A consultation takes about 30 minutes and ends with a written quote."
        cta={false}
      />
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Stagger className="grid items-stretch gap-8 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <StaggerItem key={tier.name}>
              <SpotlightCard className={`h-full p-8 ${tier.highlight ? 'border-amber ring-1 ring-amber/40' : ''}`}>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-2xl font-bold">{tier.name}</h2>
                  {tier.highlight && (
                    <span className="rounded-full bg-amber/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-amber">
                      Multi-site
                    </span>
                  )}
                </div>
                <p className="mt-2 min-h-[2.5rem] text-sm text-text-secondary">{tier.summary}</p>
                <p className="my-6 border-y border-divider py-4 font-display text-lg font-semibold text-text-primary">
                  {tier.basis}
                </p>
                <ul className="mb-8 flex-1 space-y-3.5">
                  {tier.features.map(([name, included]) => (
                    <li key={name} className="flex gap-3 text-sm">
                      <span aria-hidden="true" className={`font-mono ${included ? 'text-teal' : 'text-text-muted'}`}>
                        {included ? '✓' : '–'}
                      </span>
                      <span className={included ? 'text-text-primary' : 'text-text-muted'}>
                        {name}
                        {!included && <span className="sr-only"> (not included)</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/contact?plan=${encodeURIComponent(tier.name)}`}
                  className={`${tier.highlight ? 'btn-primary' : 'btn-secondary'} w-full`}
                >
                  Request a quote
                </Link>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="glass-card mx-auto mt-16 max-w-4xl p-8 sm:p-10">
          <h2 className="mb-4 font-display text-2xl font-bold">What every tier includes</h2>
          <p className="leading-relaxed text-text-secondary">
            Data residency and tenant isolation, role-based access for your team, an audit trail on
            every record, and no charge for read-only auditor accounts during a certification visit.
            Month-to-month after the first term; export your data at any time.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
