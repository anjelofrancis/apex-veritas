import { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
} from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const staggerParent = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const staggerChild = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Stagger({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}

/** Headline that rises in word by word. Stays one readable string for assistive tech. */
export function SplitHeadline({ text, className = '', delay = 0 }) {
  const words = text.split(' ');
  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-top">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, delay: delay + i * 0.055, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/** Card with a soft light that follows the pointer. */
export function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const background = useMotionTemplate`radial-gradient(320px circle at ${x}px ${y}px, rgb(var(--rgb-amber) / 0.14), transparent 70%)`;

  function onMove(e) {
    const box = ref.current.getBoundingClientRect();
    x.set(e.clientX - box.left);
    y.set(e.clientY - box.top);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`glass-card group relative overflow-hidden ${className}`}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.div>
  );
}

export function Marquee({ items }) {
  const row = [...items, ...items];
  return (
    <div className="marquee" role="list" aria-label="Frameworks we work with">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            role={i < items.length ? 'listitem' : undefined}
            aria-hidden={i >= items.length ? 'true' : undefined}
            className="flex items-center gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-widest text-text-secondary"
          >
            {item}
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-amber"
      style={{ scaleX }}
    />
  );
}

export function Aurora() {
  return (
    <div aria-hidden="true" className="aurora">
      <span className="aurora-blob aurora-blob--amber" />
      <span className="aurora-blob aurora-blob--teal" />
      <span className="aurora-grid" />
    </div>
  );
}
