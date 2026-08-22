import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Cpu } from 'lucide-react';

const features = [
  {
    icon: <Zap size={24} className="text-amber" />,
    title: 'Real-time Analytics',
    description: 'Monitor your KPIs as they happen with sub-second latency data processing pipelines.',
  },
  {
    icon: <Shield size={24} className="text-teal" />,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and compliance with SOC2, GDPR, and HIPAA standards out of the box.',
  },
  {
    icon: <Globe size={24} className="text-blue-500" />,
    title: 'Global Scale',
    description: 'Deploy across 30+ regions instantly. We handle the infrastructure so you can focus on data.',
  },
  {
    icon: <Cpu size={24} className="text-purple-500" />,
    title: 'AI-Powered Insights',
    description: 'Let our machine learning models identify trends and anomalies before they become problems.',
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-text-primary mb-4 transition-colors duration-700">
            Everything you need to scale
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto transition-colors duration-700">
            A complete suite of tools designed to help you understand your users and grow your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-divider shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 border border-divider">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
