import { Link } from 'react-router-dom';

export default function PageHeader({ eyebrow, title, intro, docRef }) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-background">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 mix-blend-screen pointer-events-none"></div>
      
      {/* Decorative Blur Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-DEFAULT/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-DEFAULT/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative mx-auto max-w-[1280px] px-6 z-10">
        <p className="font-mono text-sm uppercase tracking-widest text-teal-DEFAULT drop-shadow-[0_0_8px_rgba(20,184,166,0.6)] mb-4 animate-fade-in-up">
          {eyebrow}
        </p>
        
        <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight text-text-primary sm:text-5xl md:text-6xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {title}
        </h1>
        
        {intro && (
          <p className="mt-6 max-w-2xl text-lg text-text-secondary leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {intro}
          </p>
        )}
        
        <div className="mt-10 flex flex-wrap items-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link to="/contact" className="btn-primary">
            Book Free Consultation
          </Link>
          
          {docRef && (
            <div className="title-block">
              <dt>Doc</dt>
              <dd>{docRef}</dd>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
