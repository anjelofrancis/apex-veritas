import { useState } from 'react';

const EMPTY = { fullName: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
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
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.details?.[0]?.message || body.error || `Request failed (${res.status})`);
      }
      setForm(EMPTY);
      setState('sent');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  }

  return (
    <main className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-amber-DEFAULT/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="mx-auto max-w-[1280px] px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Contact Info */}
        <div className="lg:pr-12">
          <p className="font-mono text-sm uppercase tracking-widest text-amber-DEFAULT drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] mb-4">Contact Us</p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-text-primary leading-tight mb-6">
            Talk to a virtual <span className="gradient-text">HSEQ manager</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-12">
            Tell us what you are trying to solve and a consultant will come back to you within one
            working day. We're ready to help you streamline your compliance.
          </p>
          
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-divider flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-teal-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-text-primary font-medium mb-1">Global Support</h3>
                <p className="text-sm text-text-muted">Available 24/7 for urgent matters.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-divider flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-text-primary font-medium mb-1">Email Us</h3>
                <p className="text-sm text-text-muted">support@apexveritas.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="glass-card p-8 sm:p-10 border-divider relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-DEFAULT/20 blur-[50px] rounded-full pointer-events-none"></div>
          
          {state === 'sent' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-teal-DEFAULT/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-teal-DEFAULT animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-text-primary mb-4">Enquiry received!</h2>
              <p className="text-text-secondary mb-8">
                Thanks — your message is with our consultants. Expect a reply within one working day.
              </p>
              <button onClick={() => setState('idle')} className="btn-secondary">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
              <h2 className="text-2xl font-display font-bold text-text-primary mb-8">Send us a message</h2>
              
              {state === 'error' && (
                <div className="bg-oxide/10 border border-oxide/30 text-oxide px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  className="w-full bg-background/50 border border-divider rounded-lg px-4 py-3 text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-amber-DEFAULT focus:ring-1 focus:ring-amber-DEFAULT transition-all"
                  placeholder="Jane Doe"
                  value={form.fullName}
                  onChange={update('fullName')}
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2">
                  Work email
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-background/50 border border-divider rounded-lg px-4 py-3 text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-amber-DEFAULT focus:ring-1 focus:ring-amber-DEFAULT transition-all"
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={update('email')}
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2">
                  What are you looking to solve?
                </label>
                <textarea
                  required
                  rows={5}
                  maxLength={5000}
                  className="w-full bg-background/50 border border-divider rounded-lg px-4 py-3 text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-amber-DEFAULT focus:ring-1 focus:ring-amber-DEFAULT transition-all resize-none"
                  placeholder="Tell us about your compliance needs..."
                  value={form.message}
                  onChange={update('message')}
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary"
                disabled={state === 'sending'}
              >
                {state === 'sending' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
