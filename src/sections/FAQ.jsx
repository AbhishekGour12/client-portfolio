import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqsData } from '../data/faqs';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/faq.css';

const FAQ = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="section faq-section">
      <div className="bg-glow-blob blob-gold faq-blob" />
      
      <div className="section-title-wrapper">
        <span className="section-subtitle">Got Questions?</span>
        <h2 className="section-title">Frequently Asked Questions</h2>
      </div>

      <div className="faq-container">
        {faqsData.map((faq, index) => {
          const isExpanded = expandedId === faq.id;
          return (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`glass-card faq-card ${isExpanded ? 'active' : ''}`}
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="faq-header clickable"
                aria-expanded={isExpanded}
              >
                <h3>{faq.question}</h3>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="faq-chevron"
                >
                  <FaChevronDown />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="faq-body"
                  >
                    <p className="faq-answer">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
