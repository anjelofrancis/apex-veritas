import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const areaData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 },
];

const barData = [
  { name: 'Mon', visits: 2400 },
  { name: 'Tue', visits: 1398 },
  { name: 'Wed', visits: 9800 },
  { name: 'Thu', visits: 3908 },
  { name: 'Fri', visits: 4800 },
  { name: 'Sat', visits: 3800 },
  { name: 'Sun', visits: 4300 },
];

const DashboardPreview = () => {
  return (
    <section className="py-32 px-6 relative z-10 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-6"
          >
            Dive deep into your metrics
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto"
          >
            Powerful visualisations that help you spot trends and understand user behaviour at a glance.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-surface rounded-3xl p-6 md:p-10 border border-divider shadow-2xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold">Performance Overview</h3>
              <p className="text-text-secondary text-sm">Last 7 months of growth</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
               <button className="px-4 py-2 rounded-lg bg-white/5 text-sm hover:bg-white/10 transition">Export</button>
               <button className="px-4 py-2 rounded-lg bg-gradient-teal text-sm font-medium hover:shadow-lg hover:shadow-teal/20 transition">Detailed Report</button>
            </div>
          </div>

          <div className="h-[400px] w-full mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#14B8A6' }}
                />
                <Area type="monotone" dataKey="value" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-divider">
              <p className="text-text-secondary text-sm mb-1">Weekly Traffic</p>
              <h4 className="text-2xl font-bold mb-4">34,508</h4>
              <div className="h-[100px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '4px' }} />
                    <Bar dataKey="visits" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white/5 p-6 rounded-2xl border border-divider flex flex-col justify-between">
               <div>
                  <p className="text-text-secondary text-sm mb-1">Conversion Rate</p>
                  <h4 className="text-4xl font-bold text-teal">4.2%</h4>
               </div>
               <p className="text-sm text-text-secondary">Up 1.2% from last week. Checkout flow optimizations are showing positive results.</p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-divider flex flex-col justify-between">
               <div>
                  <p className="text-text-secondary text-sm mb-1">Avg Session Duration</p>
                  <h4 className="text-4xl font-bold">3m 42s</h4>
               </div>
               <p className="text-sm text-text-secondary">Stable across all platforms. Mobile users represent 62% of total session time.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
