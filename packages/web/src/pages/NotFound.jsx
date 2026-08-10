import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="bg-background min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-oxide/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-3xl">
        <div className="glass-card p-10 sm:p-16 border-divider text-center relative overflow-hidden">
          <div className="absolute -top-40 -right-40 text-[300px] font-display font-bold text-text-primary/5 select-none pointer-events-none">
            404
          </div>
          
          <div className="relative z-10">
            <p className="font-mono text-sm uppercase tracking-widest text-oxide mb-4">Error 404</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-6">
              This sheet is <span className="text-transparent bg-clip-text bg-gradient-to-r from-oxide to-amber-DEFAULT">not in the set</span>
            </h1>
            <p className="max-w-lg mx-auto text-text-secondary text-lg mb-12">
              The page you asked for does not exist. It may have been renamed, or the link that
              brought you here may be out of date.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link to="/" className="btn-primary">
                Back to home
              </Link>
              <Link to="/contact" className="btn-secondary">
                Contact us
              </Link>
            </div>
            
            <div className="title-block bg-black/20 border-divider mx-auto justify-center">
              <dt>Status</dt>
              <dd className="text-oxide drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">Not found</dd>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
