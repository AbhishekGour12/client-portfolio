import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { servicesData } from '../data/services';
import {
  FaBuilding,
  FaTrophy,
  FaRocket,
  FaCrown,
  FaPlaneDeparture,
  FaMusic,
  FaBullhorn,
  FaStar,
  FaUsers,
  FaGem,
  FaTimes,
  FaArrowRight,
  FaBriefcase
} from 'react-icons/fa';
import '../styles/services.css';

const FaIcons = {
  FaBuilding,
  FaTrophy,
  FaRocket,
  FaCrown,
  FaPlaneDeparture,
  FaMusic,
  FaBullhorn,
  FaStar,
  FaUsers,
  FaGem,
  FaTimes,
  FaArrowRight,
  FaBriefcase
};

const Services = () => {
  const [activeService, setActiveService] = useState(null);

  const getIcon = (iconName) => {
    const Icon = FaIcons[iconName];
    return Icon ? <Icon /> : <FaIcons.FaStar />;
  };

  return (
    <section id="services" className="section services-section">
      <div className="bg-glow-blob blob-gold services-blob" />
      
      <div className="section-title-wrapper">
        <span className="section-subtitle">Core Offerings</span>
        <h2 className="section-title">Professional Hosting Services</h2>
      </div>

      <div className="services-grid">
        {servicesData.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="glass-card service-card"
            style={{ '--hover-glow': service.hoverGlow }}
          >
            <div className="service-icon-wrapper" style={{ background: service.gradient }}>
              {getIcon(service.iconName)}
            </div>
            
            <h3 className="service-card-title">{service.title}</h3>
            <p className="service-card-desc">{service.shortDesc}</p>
            
            <button
              onClick={() => setActiveService(service)}
              className="service-learn-more-btn clickable"
            >
              Learn More <FaArrowRight />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Interactive Detail Modal */}
      <AnimatePresence>
        {activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="service-modal-overlay"
            onClick={() => setActiveService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass-card service-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="service-modal-close"
                onClick={() => setActiveService(null)}
                aria-label="Close details"
              >
                <FaTimes />
              </button>

              <div className="service-modal-header">
                <div className="service-modal-icon" style={{ background: activeService.gradient }}>
                  {getIcon(activeService.iconName)}
                </div>
                <h3>{activeService.title}</h3>
              </div>

               <div className="service-modal-body">
                <p className="service-long-desc">{activeService.longDesc}</p>
                
                {activeService.whyChoose && activeService.whyChoose.length > 0 ? (
                  <div className="service-modal-benefits">
                    <h4>Why clients choose Anushi:</h4>
                    <ul>
                      {activeService.whyChoose.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="service-modal-benefits">
                    <h4>What Anushi Delivers:</h4>
                    <ul>
                      <li>Bespoke speech curation adapted to key brand guidelines or wedding logs.</li>
                      <li>Synchronized cooperation with AV, DJ, and stage managers.</li>
                      <li>Graceful management of celebrity panels, VIP protocols, or family milestones.</li>
                      <li>Highly energetic, memorable, and photo-ready stage presence.</li>
                    </ul>
                  </div>
                )}

                {activeService.highlights && (
                  <div className="service-modal-highlights" style={{ marginTop: '20px' }}>
                    <h4 style={{ color: 'var(--color-gold)', marginBottom: '8px', fontSize: '1.1rem', fontFamily: 'var(--font-headings)' }}>
                      {activeService.highlightsLabel || 'Worked with:'}
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {activeService.highlights}
                    </p>
                  </div>
                )}
              </div>

              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
