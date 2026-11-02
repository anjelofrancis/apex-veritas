import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

// Sample data for the illustration only. It never represents a real client.
const START = [
  { ref: 'OSHA 2007 s.11', title: 'Fire safety certificate renewal', status: 'open' },
  { ref: 'EMCA 1999 s.87', title: 'Effluent discharge permit', status: 'overdue' },
  { ref: 'ISO 45001 cl.9.2', title: 'Internal audit programme', status: 'progress' },
  { ref: 'WIBA 2007 s.7', title: 'Employee injury benefits cover', status: 'met' },
  { ref: 'OSHA 2007 s.47', title: 'Machinery examination certificate', status: 'open' },
];

const NEXT = { overdue: 'progress', open: 'progress', progress: 'met', met: 'open' };
const LABEL = { overdue: 'Overdue', open: 'Open', progress: 'In progress', met: 'Met' };
const TONE = {
  overdue: 'bg-oxide/15 text-oxide border-oxide/40',
  open: 'bg-white/5 text-text-secondary border-divider',
  progress: 'bg-amber/15 text-amber border-amber/40',
  met: 'bg-teal/15 text-teal border-teal/40',
};

const R = 34;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function LiveRegister() {
  const [rows, setRows] = useState(START);
  const [cursor, setCursor] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => {
      setCursor((c) => {
        setRows((prev) => prev.map((r, i) => (i === c ? { ...r, status: NEXT[r.status] } : r)));
        return (c + 1) % START.length;
      });
    }, 1900);
    return () => clearInterval(id);
  }, [reduced]);

  const met = rows.filter((r) => r.status === 'met').length;
  const share = met / rows.length;

  return (
    <div className="glass-card w-full p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4 border-b border-divider pb-4">
        <div>
          <p className="font-display text-base font-semibold text-text-primary">Legal register</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Example view · sample data
          </p>
        </div>
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="40" cy="40" r={R} fill="none" strokeWidth="7" className="stroke-white/10" />
            <motion.circle
              cx="40"
              cy="40"
              r={R}
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              className="stroke-teal"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - share) }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </svg>
          <p className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-text-primary">
            {met}/{rows.length}
          </p>
        </div>
      </div>

      <ul className="mt-2 divide-y divide-divider">
        {rows.map((row, i) => (
          <li key={row.ref} className="relative flex items-center justify-between gap-3 py-3">
            {i === cursor && !reduced && (
              <motion.span
                layoutId="register-cursor"
                aria-hidden="true"
                className="absolute -inset-x-2 inset-y-1 rounded-lg bg-white/5"
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              />
            )}
            <div className="relative min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">{row.title}</p>
              <p className="mt-0.5 font-mono text-[11px] text-text-muted">{row.ref}</p>
            </div>
            <div className="relative shrink-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={row.status}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className={`block rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${TONE[row.status]}`}
                >
                  {LABEL[row.status]}
                </motion.span>
              </AnimatePresence>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
