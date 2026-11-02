import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { ThemeProvider } from './components/ThemeProvider';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ScrollProgress } from './components/motion';
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import Industries from './pages/Industries';
import ComplianceHub from './pages/ComplianceHub';
import Resources from './pages/Resources';
import Templates from './pages/Templates';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

const BRAND = 'Apex Veritas';
const TITLES = {
  '/': `${BRAND} — Your Virtual HSEQ & Compliance Department`,
  '/solutions': `Solutions | ${BRAND}`,
  '/industries': `Industries | ${BRAND}`,
  '/compliance-hub': `Compliance Hub | ${BRAND}`,
  '/resources': `Resources | ${BRAND}`,
  '/templates': `Templates Store | ${BRAND}`,
  '/pricing': `Pricing | ${BRAND}`,
  '/contact': `Contact | ${BRAND}`,
  '/about': `About | ${BRAND}`,
  '/privacy': `Privacy | ${BRAND}`,
  '/terms': `Terms | ${BRAND}`,
};

export default function App() {
  const location = useLocation();

  useEffect(() => {
    document.title = TITLES[location.pathname] || `Page not found | ${BRAND}`;
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <div className="flex min-h-screen flex-col">
          <ScrollToTop />
          <ScrollProgress />
          <NavBar />
          <div className="flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/solutions" element={<Solutions />} />
                  <Route path="/industries" element={<Industries />} />
                  <Route path="/compliance-hub" element={<ComplianceHub />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  {/* A real 404 rather than a silent redirect — a mistyped URL that
                      quietly lands on Home hides broken inbound links. */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
          <Footer />
        </div>
      </MotionConfig>
    </ThemeProvider>
  );
}
