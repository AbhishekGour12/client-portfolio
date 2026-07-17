import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaGlobe, FaTimes } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import '../styles/about.css';

const aboutImages = [
  'https://res.cloudinary.com/seqeiob7/image/upload/v1784283639/portfolio/b39mqem6kurp29sfxchs.webp',
  'https://res.cloudinary.com/seqeiob7/image/upload/v1784283640/portfolio/ty5oqtbqzbze0o8kt42w.webp',
  'https://res.cloudinary.com/seqeiob7/image/upload/v1784283641/portfolio/hgpfoekhijpdnv963vjj.webp',
  'https://res.cloudinary.com/seqeiob7/image/upload/v1784283642/portfolio/qqsrq34uxhuzdeyobwgi.webp',
  'https://res.cloudinary.com/seqeiob7/image/upload/v1784283643/portfolio/wdieuwd02rhcgliwhiei.webp',
  'https://res.cloudinary.com/seqeiob7/image/upload/v1784283644/portfolio/b8q1cl60jbhz0sfhmgmy.webp',
  'https://res.cloudinary.com/seqeiob7/image/upload/v1784283646/portfolio/e6nbdaq91qzhe8hvnto0.webp',
  'https://res.cloudinary.com/seqeiob7/image/upload/v1784283647/portfolio/qzxxsp7gihpxi8ugvg1y.webp'
];

const About = () => {
  const [activeMilestone, setActiveMilestone] = useState(null);

  const timelineMilestones = [
    {
      year: '2018',
      title: "The Girl Who Couldn't Stop Speaking",
      desc: 'Known for her audience engagement, multilingual hosting and intuitive stage presence, Anushi brings together structure, spontaneity and storytelling to create experiences that stay with people long after the final applause.'
    },
    {
      year: '2020',
      title: "The Girl Who Couldn't Stop Speaking",
      desc: "The Girl Who Couldn't Stop Speaking as the official emcee for national brand campaigns, car launches, and elite family weddings."
    },
    {
      year: '2022',
      title: 'From Campus Stages to Corporate Conversations',
      desc: 'Expanded internationally, hosting multi-day luxury weddings and international award nights in Bali, Dubai, and Singapore.'
    },
    {
      year: '2023',
      title: 'Chapter IV — The Wedding Chapter',
      desc: 'If corporate events demand precision, Indian weddings demand magic. Luxury weddings, sangeet nights, family celebrations and larger-than-life festivities introduced an entirely different rhythm of hosting — one built on emotion, spontaneity and unforgettable moments. From boardrooms to baraats, the microphone adapted and so did the host.'
    },
    {
      year: '2024',
      title: 'Chapter V — The Big League',
      desc: 'Anushi became the official host for GAIL India, Jaipur and went on to collaborate with brands and organizations including: Airtel, VLCC, Almond Board of California, Cipla, KitKat, Nescafé, K Raheja Corp and CK Birla Group. A significant milestone came with hosting events for the MSME organization and the Soft Hockey League, sharing the stage with distinguished leaders including Deputy Chief Minister of Rajasthan, Diya Kumari ji. The rooms became larger. The responsibility became greater. The excitement remained exactly the same.'
    },
    {
      year: 'Today',
      title: 'Chapter VI — The Story Continues',
      desc: "Today, Anchor Anushi moves effortlessly between corporate summits, luxury weddings, leadership forums and brand experiences. From hosting celebrations with the Khan family to moderating conversations for industry leaders and global brands, every event continues to add another page to the story. Because after all these years, the goal hasn't changed: To make people feel something long after the event is over."
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
        <h5 className="section-title ">More Than a Host. A Storyteller with a Microphone.</h5>
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
            For Anushi, a stage has never been just a platform — it has always been a place where people connect, celebrate and create memories together.
          </p>
          <p className="about-text">
            Over the years, she has hosted everything from boardroom conversations and	 leadership summits to vibrant sangeet nights and city-wide cultural events, adapting effortlessly to audiences, occasions and energies.
          </p>
          <p className='about-text'>
            Known for her audience engagement, multilingual hosting and intuitive stage presence, Anushi brings together structure, spontaneity and storytelling to create experiences that stay with people long after the final applause.



          </p>

          <div className="about-languages">
            <span className="lang-title"><FaGlobe /> Fluent In:</span>
            <div className="lang-pills">
              <span className="lang-pill">English</span>
              <span className="lang-pill">Hindi</span>

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

        {/* Photo Column Only */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="about-media-col"
        >
          <div className="about-image-wrapper">
            <Swiper
              modules={[Pagination, Autoplay, EffectFade]}
              spaceBetween={0}
              slidesPerView={1}
              effect="slide"
              fadeEffect={{ crossFade: true }}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              className="about-swiper"
            >
              {aboutImages.map((imgSrc, idx) => (
                <SwiperSlide key={idx}>
                  <div className="about-slide-inner">
                    <div
                      className="about-slide-bg"
                      style={{ backgroundImage: `url(${imgSrc})` }}
                    />
                    <img
                      src={imgSrc}
                      alt={`Anushi Kothari Anchor ${idx + 1}`}
                      className="about-image"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="image-border-gold" />
          </div>
        </motion.div>
      </div>

      {/* Horizontal Timeline at the Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="milestones-section-container"
      >
        <h4 className="timeline-section-title">Milestones</h4>

        {/* Row 1 (Chapters I - III) */}
        <div className="timeline-row-wrapper">
          <div className="timeline-line-horizontal" />
          <div className="timeline-row-items">
            {timelineMilestones.slice(0, 3).map((item, index) => (
              <div key={index} className="timeline-item-horizontal">
                <div className="timeline-dot-horizontal" />
                <div className="timeline-year-horizontal">{item.year}</div>
                <div className="glass-card milestone-card-wrapper">
                  <div className="milestone-card-header">
                    <h5 className="milestone-card-title">{item.title}</h5>
                  </div>
                  <p className="milestone-card-desc">{item.desc}</p>
                  <button
                    onClick={() => setActiveMilestone(item)}
                    className="btn btn-outline milestone-more-btn clickable"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 (Chapters IV - VI) */}
        <div className="timeline-row-wrapper" style={{ marginTop: '40px' }}>
          <div className="timeline-line-horizontal" />
          <div className="timeline-row-items">
            {timelineMilestones.slice(3, 6).map((item, index) => (
              <div key={index} className="timeline-item-horizontal">
                <div className="timeline-dot-horizontal" />
                <div className="timeline-year-horizontal">{item.year}</div>
                <div className="glass-card milestone-card-wrapper">
                  <div className="milestone-card-header">
                    <h5 className="milestone-card-title">{item.title}</h5>
                  </div>
                  <p className="milestone-card-desc">{item.desc}</p>
                  <button
                    onClick={() => setActiveMilestone(item)}
                    className="btn btn-outline milestone-more-btn clickable"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Milestone Modal */}
      <AnimatePresence>
        {activeMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="milestone-modal-overlay"
            onClick={() => setActiveMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass-card milestone-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="milestone-modal-close"
                onClick={() => setActiveMilestone(null)}
                aria-label="Close details"
              >
                <FaTimes />
              </button>

              <div className="milestone-modal-header">
                <span className="milestone-modal-year">{activeMilestone.year}</span>
                <h3>{activeMilestone.title}</h3>
              </div>

              <div className="milestone-modal-body">
                <p>{activeMilestone.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;
