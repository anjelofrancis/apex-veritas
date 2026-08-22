import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$49',
    description: 'Perfect for small teams getting started with data.',
    features: ['Up to 100k events/mo', '3 team members', 'Basic analytics', '48h support response'],
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$199',
    description: 'Advanced features for growing businesses.',
    features: ['Up to 1M events/mo', 'Unlimited team members', 'Custom dashboards', 'Real-time alerts', 'Priority 24/7 support'],
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Dedicated support and infrastructure for large scale.',
    features: ['Unlimited events', 'Custom SLA', 'Dedicated success manager', 'On-premise option', 'Advanced security (SOC2)'],
    highlighted: false
  }
];

const Pricing = () => {
  return (
    <section className="py-24 px-6 relative z-10 text-white pb-40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">No hidden fees, no surprises. Choose the plan that best fits your needs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 rounded-3xl border ${
                plan.highlighted 
                  ? 'bg-gradient-to-b from-surface to-background border-teal shadow-2xl shadow-teal/20 transform md:-translate-y-4' 
                  : 'bg-white/5 border-divider'
              }`}
            >
              {plan.highlighted && <div className="text-teal text-sm font-bold uppercase tracking-wider mb-4">Most Popular</div>}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-text-secondary text-sm mb-6 h-10">{plan.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-text-secondary">/mo</span>}
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-text-muted">
                    <Check size={16} className="text-teal flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  plan.highlighted 
                    ? 'bg-gradient-teal text-white hover:shadow-lg hover:scale-105 hover:shadow-teal/20' 
                    : 'bg-white/5 text-white hover:bg-white/10 border border-divider'
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
