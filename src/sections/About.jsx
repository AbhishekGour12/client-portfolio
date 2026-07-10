import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaGlobe } from 'react-icons/fa';
import '../styles/about.css';

const About = () => {
  const timelineMilestones = [
    {
      year: '2018',
      title: 'The Spark',
      desc: 'Began anchoring local corporate panels, media press meets, and private VIP gatherings.'
    },
    {
      year: '2020',
      title: 'The Main Stage',
      desc: 'Selected as the official emcee for national brand campaigns, car launches, and elite family weddings.'
    },
    {
      year: '2023',
      title: 'Global Anchoring',
      desc: 'Expanded internationally, hosting multi-day luxury weddings and international award nights in Bali, Dubai, and Singapore.'
    }
  ];

  const traits = [
    'Charismatic Stage Command',
    'Sharp Spontaneous Banter',
    'Flawless Protocol Management',
    'High-Octane Audience Engagement'
  ];

  return (
    <section id="about" className="section about-section">
      <div className="bg-glow-blob blob-purple about-blob" />
      
      <div className="section-title-wrapper">
        <span className="section-subtitle">The MC Journey</span>
        <h2 className="section-title">About Anushi Kothari</h2>
      </div>

      <div className="about-grid">
        
        {/* Biography & Traits */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="about-info-col"
        >
          <h3 className="about-heading">Commanding Stages with Grace and Wit</h3>
          <p className="about-text">
            Anushi Kothari is a premier event host, anchor, and master of ceremonies based in India, anchoring events globally. With over 8 years of live stage experience, she is known for her magnetizing stage presence, intellectual delivery, and quick-witted crowd interaction.
          </p>
          <p className="about-text">
            Whether representing Fortune 500 brands in front of thousands of delegates or hosting intimate luxury weddings at heritage palaces, Anushi brings a custom blend of sophistication and high-octane celebration.
          </p>

          <div className="about-languages">
            <span className="lang-title"><FaGlobe /> Fluent In:</span>
            <div className="lang-pills">
              <span className="lang-pill">English</span>
              <span className="lang-pill">Hindi</span>
              <span className="lang-pill">Gujarati</span>
            </div>
          </div>

          <div className="about-traits-grid">
            {traits.map((trait, index) => (
              <div key={index} className="about-trait-item">
                <FaCheckCircle className="trait-icon" />
                <span>{trait}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Photo and Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="about-media-col"
        >
          <div className="about-image-wrapper">
            <img
              src="/assets/about_profile_laptop.webp"
              alt="Anushi Kothari Anchor"
              className="about-image"
              loading="lazy"
              decoding="async"
            />
            <div className="image-border-gold" />
          </div>

          <div className="timeline-container">
            <h4 className="timeline-section-title">Milestones</h4>
            <div className="timeline-line" />
            <div className="timeline-items">
              {timelineMilestones.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-year">{item.year}</div>
                  <div className="glass-card timeline-card">
                    <h5>{item.title}</h5>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
