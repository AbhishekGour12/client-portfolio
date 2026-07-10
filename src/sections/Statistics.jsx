import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { statsData } from '../data/stats';
import { motion } from 'framer-motion';
import '../styles/stats.css';

// Resolve CJS/ESM interop mismatch
const CountUpComponent = CountUp.default || CountUp;

const Statistics = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15
  });

  return (
    <section ref={ref} className="stats-section">
      <div className="stats-container">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-card stat-card"
          >
            <h3 className="stat-value">
              {inView ? (
                <CountUpComponent start={0} end={stat.value} duration={3} separator="," />
              ) : (
                '0'
              )}
              <span className="stat-suffix">{stat.suffix}</span>
            </h3>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Statistics;
