import { MotionConfig, motion } from 'framer-motion';
import LiveRegister from './components/LiveRegister';
import {
  Aurora,
  EASE,
  Marquee,
  Reveal,
  ScrollProgress,
  SplitHeadline,
  SpotlightCard,
  Stagger,
  StaggerItem,
} from './components/motion';

const WEB_URL = (import.meta.env.VITE_WEB_URL || 'https://apexvwebp50ai.z1.web.core.windows.net').replace(/\/$/, '');
const PORTAL_URL = import.meta.env.VITE_PORTAL_URL || 'http://localhost:5173';
const CONTACT = `${WEB_URL}/#/contact`;

const FRAMEWORKS = ['OSHA 2007', 'WIBA 2007', 'EMCA 1999', 'ISO 45001', 'ISO 14001', 'ISO 9001', 'UAE Federal OSH', 'OSHAD-SF'];

const PILLARS = [
  ['A named consultant', 'Someone embedded in your operation who runs the management system and answers the regulator on your behalf.'],
  ['A live legal register', 'Every obligation, the evidence it needs, and the date it falls due, for each jurisdiction you operate in.'],
  ['One record of your operation', 'Documents, audits, incidents, training and actions, tracked to closure in a single system.'],
];

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <main className="overflow-hidden bg-background font-body text-text-primary">
        <section className="dark relative flex min-h-screen flex-col bg-background">
          <Aurora />
          <header className="relative z-10 mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-6">
            <a href={WEB_URL} className="flex items-center gap-3 font-display text-lg font-bold text-text-primary">
              <img src="/logo.jpg" alt="" className="h-8 w-8 rounded-md object-cover" />
              APEX VERITAS
            </a>
            <a href={PORTAL_URL} className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
              Client Portal →
            </a>
          </header>

          <div className="relative z-10 mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-14 px-6 pb-20 pt-8 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <SplitHeadline
                text="Your Virtual HSEQ & Compliance Department"
                className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl"
              />
              <Reveal delay={0.5} y={16}>
                <p className="mt-7 max-w-xl text-xl leading-relaxed text-text-secondary">
                  Most operations need a full HSEQ function and can only justify a fraction of one.
                  We run it for you, remotely and on site when it matters.
                </p>
              </Reveal>
              <Reveal delay={0.65} y={16}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href={CONTACT} className="btn-primary">Book Free Consultation</a>
                  <a href={`${WEB_URL}/#/solutions`} className="btn-secondary">See what we run</a>
                </div>
              </Reveal>
            </div>
            <motion.div
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

        <section className="mx-auto max-w-[1200px] px-6 py-28">
          <Reveal className="mb-14 max-w-3xl">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">A department, not another binder</h2>
          </Reveal>
          <Stagger className="grid gap-6 md:grid-cols-3">
            {PILLARS.map(([title, body]) => (
              <StaggerItem key={title}>
                <SpotlightCard className="h-full p-8">
                  <h3 className="font-display text-xl font-bold">{title}</h3>
                  <p className="mt-3 leading-relaxed text-text-secondary">{body}</p>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section className="dark relative overflow-hidden bg-background py-32">
          <Aurora />
          <Reveal className="relative z-10 mx-auto max-w-[1200px] px-6 text-center">
            <h2 className="mx-auto max-w-4xl font-display text-5xl font-bold leading-tight sm:text-6xl">
              Stay audit-ready, <span className="gradient-text">every day of the year.</span>
            </h2>
            <a href={CONTACT} className="btn-primary mt-12 !px-10 !py-4 text-base">Book Free Consultation</a>
            <p className="mt-14 text-sm text-text-muted">© {new Date().getFullYear()} Apex Veritas</p>
          </Reveal>
        </section>
      </main>
    </MotionConfig>
  );
}
