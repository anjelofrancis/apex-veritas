import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { EASE, Reveal } from '../components/motion';

const EMAIL = 'support@apexveritas.com';

function initialMessage(params) {
  const pack = params.get('pack');
  const plan = params.get('plan');
  if (pack) return `I would like to request the ${pack}.`;
  if (plan) return `I would like a quote for the ${plan} plan.`;
  return '';
}

export default function Contact() {
  const [params] = useSearchParams();
  const [form, setForm] = useState(() => ({ fullName: '', email: '', message: initialMessage(params) }));
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState(null);

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setState('sending');
    setError(null);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${API_BASE}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.details?.[0]?.message || body.error || `Request failed (${res.status})`);
      }
      setForm({ fullName: '', email: '', message: '' });
      setState('sent');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        eyebrow="Contact"
        title="Talk to a virtual HSEQ manager"
        intro="Tell us what you are trying to solve and a consultant will come back to you within one working day."
        cta={false}
      />
      <section className="mx-auto grid max-w-[1100px] items-start gap-12 px-6 py-24 lg:grid-cols-[1fr_1.5fr]">
        <Reveal className="space-y-8">
          <div>
            <h2 className="font-display text-xl font-semibold">Email us</h2>
            <a href={`mailto:${EMAIL}`} className="mt-2 inline-block text-text-secondary underline underline-offset-4 hover:text-amber">
              {EMAIL}
            </a>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">What happens next</h2>
            <ol className="mt-3 space-y-3 text-text-secondary">
              <li>1. A consultant reads your enquiry.</li>
              <li>2. You have a call of about 30 minutes.</li>
              <li>3. You receive a written quote.</li>
            </ol>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="glass-card p-8 sm:p-10">
          <AnimatePresence mode="wait" initial={false}>
            {state === 'sent' ? (
              <motion.div
                key="sent"
                role="status"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="py-10 text-center"
              >
                <svg viewBox="0 0 52 52" className="mx-auto h-20 w-20 text-teal" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <motion.circle cx="26" cy="26" r="23" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
                  <motion.path d="M15 27l8 8 14-16" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5 }} />
                </svg>
                <h2 className="mb-3 mt-6 font-display text-2xl font-bold">Enquiry received</h2>
                <p className="mb-8 text-text-secondary">
                  Your message is with our consultants. Expect a reply within one working day.
                </p>
                <button type="button" onClick={() => setState('idle')} className="btn-secondary">
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-display text-2xl font-bold">Send us a message</h2>
                {state === 'error' && (
                  <p role="alert" className="rounded-lg border border-oxide/40 bg-oxide/10 px-4 py-3 text-sm text-oxide">
                    {error}
                  </p>
                )}
                <div>
                  <label htmlFor="contact-name" className="field-label">Full name</label>
                  <input id="contact-name" type="text" autoComplete="name" required maxLength={200} className="field" value={form.fullName} onChange={update('fullName')} />
                </div>
                <div>
                  <label htmlFor="contact-email" className="field-label">Work email</label>
                  <input id="contact-email" type="email" autoComplete="email" required className="field" value={form.email} onChange={update('email')} />
                </div>
                <div>
                  <label htmlFor="contact-message" className="field-label">What are you looking to solve?</label>
                  <textarea id="contact-message" required rows={5} maxLength={5000} className="field resize-none" value={form.message} onChange={update('message')} />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={state === 'sending'}>
                  {state === 'sending' ? 'Sending…' : 'Send message'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </section>
    </main>
  );
}
