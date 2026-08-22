import React, { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Hero from './components/Hero';
import Features from './components/Features';
import DashboardPreview from './components/DashboardPreview';
import Pricing from './components/Pricing';
import './index.css';

function App() {
  const { scrollYProgress } = useScroll();
  const [isDark, setIsDark] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.25 && !isDark) {
      setIsDark(true);
    } else if (latest <= 0.25 && isDark) {
      setIsDark(false);
    }
  });
  
  // As the user scrolls from 0.1 to 0.4, the background changes from light to dark
  const backgroundColor = useTransform(
    scrollYProgress,
    [0.1, 0.4],
    ["#EDF2F4", "#0A0F1C"] // Brand Light to Dark background
  );

  return (
    <motion.div 
      style={{ backgroundColor }}
      className={`min-h-screen transition-colors duration-200 ease-linear font-body selection:bg-teal/30 selection:text-white ${isDark ? 'dark' : ''}`}
    >
      <Hero />
      <Features />
      <DashboardPreview />
      <Pricing />
    </motion.div>
  );
}

export default App;
