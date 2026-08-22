import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2 } from 'lucide-react';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold text-text-primary tracking-tight mb-6">
            Data-Driven Insights <br />
            <span className="text-teal">for Modern Teams</span>
          </h1>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto font-body">
            Unlock the power of your data with our advanced analytics platform. Make smarter decisions, faster.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-amber text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:scale-105">
              Start Free Trial <ArrowRight size={18} />
            </button>
            <button className="px-8 py-4 bg-surface text-text-primary border border-gray-200 rounded-full font-medium hover:bg-background transition-colors flex items-center gap-2">
              <BarChart2 size={18} /> View Demo
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-divider bg-surface"
        >
          {/* Mockup Window */}
          <div className="h-12 border-b border-divider flex items-center px-4 bg-background">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
          </div>
          <div className="p-8 bg-surface h-[400px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-white opacity-50"></div>
            <div className="relative z-10 grid grid-cols-3 gap-6 w-full h-full">
               <div className="col-span-2 bg-surface rounded-xl border border-divider shadow-sm p-6 flex flex-col justify-end h-full">
                  <div className="flex items-end gap-2 h-48">
                    {[40, 70, 45, 90, 65, 85, 120].map((h, i) => (
                      <div key={i} className="flex-1 bg-teal/20 rounded-t-md relative group">
                        <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: `${h}%` }} 
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                          className="absolute bottom-0 w-full bg-teal rounded-t-md"
                        ></motion.div>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="col-span-1 flex flex-col gap-6">
                 <div className="bg-surface rounded-xl border border-divider shadow-sm p-6 flex-1 flex flex-col justify-center">
                    <p className="text-gray-500 text-sm mb-2">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-text-primary">$124,500</h3>
                    <p className="text-teal text-sm mt-2 flex items-center gap-1">+14.5% <ArrowRight size={12} className="-rotate-45" /></p>
                 </div>
                 <div className="bg-surface rounded-xl border border-divider shadow-sm p-6 flex-1 flex flex-col justify-center">
                    <p className="text-gray-500 text-sm mb-2">Active Users</p>
                    <h3 className="text-3xl font-bold text-text-primary">45.2k</h3>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
