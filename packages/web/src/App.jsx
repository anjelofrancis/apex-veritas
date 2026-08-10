import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
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

export default function App() {
  return (
    <ThemeProvider>
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <NavBar />
      <div className="flex-1">
        <Routes>
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
      </div>
      <Footer />
    </div>
    </ThemeProvider>
  );
}
