import { Link } from 'react-router-dom';
import { Aurora, Reveal, SplitHeadline } from './motion';

export default function PageHeader({ eyebrow, title, intro, cta = true }) {
  return (
    <section className="dark relative overflow-hidden bg-background pb-24 pt-40">
      <Aurora />
      <div className="relative z-10 mx-auto max-w-[1280px] px-6">
        <Reveal y={10}>
          <p className="mb-5 font-mono text-sm uppercase tracking-widest text-amber">{eyebrow}</p>
        </Reveal>
        <SplitHeadline
          text={title}
          delay={0.05}
          className="max-w-5xl font-display text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl"
        />
        {intro && (
          <Reveal delay={0.35} y={14}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary">{intro}</p>
          </Reveal>
        )}
        {cta && (
          <Reveal delay={0.5} y={14}>
            <Link to="/contact" className="btn-primary mt-10">Book Free Consultation</Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
