import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaYoutube, FaInstagram, FaVolumeUp } from 'react-icons/fa';
import '../styles/showreel.css';

const Showreel = () => {
  const [isPlayingYoutube, setIsPlayingYoutube] = useState(false);
  
  // Replace this YouTube Video ID with Anushi's original showreel ID
  const youtubeVideoId = 'ysz5S6PUM-U'; // standard placeholder presentation video id

  const instagramReels = [
    {
      id: 1,
      title: 'Corporate Summit Highlights',
      likes: '12.4K',
      comments: '342',
      link: 'https://instagram.com/reels',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&fm=webp&q=70'
    },
    {
      id: 2,
      title: 'Grand Sangeet Opening Energy',
      likes: '18.9K',
      comments: '581',
      link: 'https://instagram.com/reels',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&fm=webp&q=70'
    }
  ];

  return (
    <section id="showreel" className="section showreel-section">
      <div className="bg-glow-blob blob-gold showreel-blob" />
      
      <div className="section-title-wrapper">
        <span className="section-subtitle">Anchor In Action</span>
        <h2 className="section-title">Showreel & Clips</h2>
      </div>

      <div className="showreel-container">
        
        {/* Featured YouTube Showreel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="featured-showreel glass-card"
        >
          <div className="showreel-video-wrapper">
            {!isPlayingYoutube ? (
              <div
                className="showreel-thumbnail-overlay clickable"
                onClick={() => setIsPlayingYoutube(true)}
              >
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&fm=webp&q=75"
                  alt="Anushi Kothari Showreel Thumbnail"
                  className="showreel-thumbnail"
                  loading="lazy"
                  decoding="async"
                />
                <div className="thumbnail-darkener" />
                <div className="play-button-outer">
                  <div className="play-button-inner">
                    <FaPlay className="play-icon" />
                  </div>
                </div>
                <div className="showreel-overlay-text">
                  <FaYoutube className="yt-icon" />
                  <span>Click to Watch Official Showreel</span>
                </div>
              </div>
            ) : (
              <iframe
                title="Anushi Kothari Hosting Showreel"
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="showreel-iframe"
              />
            )}
          </div>
          
          <div className="showreel-details">
            <h3>Official Anchor Showreel</h3>
            <p>
              Experience the energy, timing, and elegance that Anushi Kothari brings to the stage. This compilation showcases highlights from global corporate summits, luxury weddings, sangeets, and massive celebrity concert audiences.
            </p>
            <div className="replace-comment-label">
              {"// Replace the youtubeVideoId state variable in Showreel.jsx with your original YouTube ID."}
            </div>
          </div>
        </motion.div>

        {/* Secondary Instagram Clips Grid */}
        <div className="reels-grid">
          {instagramReels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="reel-card glass-card"
            >
              <div className="reel-video-mock">
                <img src={reel.image} alt={reel.title} className="reel-thumbnail" loading="lazy" decoding="async" />
                <div className="reel-dark-overlay" />
                <a
                  href={reel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reel-play-btn clickable"
                  aria-label="Watch Instagram Reel"
                >
                  <FaInstagram />
                </a>
                <div className="reel-audio-icon">
                  <FaVolumeUp />
                </div>
              </div>
              <div className="reel-info">
                <h4>{reel.title}</h4>
                <div className="reel-stats">
                  <span><strong>{reel.likes}</strong> Likes</span>
                  <span>•</span>
                  <span><strong>{reel.comments}</strong> Comments</span>
                </div>
                <div className="replace-comment-label">
                  {"// Swap link with original Instagram Reel URL."}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Showreel;
