import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import '../styles/showreel.css';

const Showreel = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // IntersectionObserver to auto-play when in view, and pause when out of view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Autoplay when scrolled in (must be muted by default)
            video.play().catch((err) => {
              console.log("Autoplay prevented by browser: needs user interaction or mute.", err);
            });
          } else {
            // Pause when scrolled out
            video.pause();
          }
        });
      },
      { threshold: 0.1 } // triggers when 10% of the video card enters/leaves the viewport
    );

    observer.observe(video);

    return () => {
      if (video) observer.unobserve(video);
    };
  }, []);

  // Hover triggers play / pause
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.log("Play on hover blocked:", err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section id="showreel" className="section showreel-section" style={{ paddingLeft: '5%', paddingRight: '5%' }}>
      <div className="bg-glow-blob blob-gold showreel-blob" />

      <div className="section-title-wrapper" style={{ marginBottom: '35px' }}>
        <span className="section-subtitle">Anchor In Action</span>
        <h2 className="section-title">Showreel & Clips</h2>
      </div>

      <div className="showreel-container" style={{ maxWidth: '1200px', width: '100%' }}>

        {/* Featured Full-Width Video Player Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
          className="featured-showreel glass-card"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ width: '100%', overflow: 'hidden', padding: 0 }}
        >
          <div className="showreel-video-wrapper" style={{ position: 'relative', width: '100%', paddingTop: 0, height: 'auto', background: '#000' }}>
            <video
              ref={videoRef}
              src="/Showreel .mp4"
              controls
              muted={isMuted}
              loop
              playsInline
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                border: 'none',
                borderRadius: '0'
              }}
            />

            {/* Custom Control Mute Overlay Button */}
            <button
              onClick={toggleMute}
              className="clickable"
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: 'rgba(8, 17, 31, 0.75)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifycontent: 'center',
                justifyContent: 'center',
                zIndex: 20,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <FaVolumeMute style={{ color: 'var(--color-gold)' }} /> : <FaVolumeUp style={{ color: 'var(--color-gold)' }} />}
            </button>

            {/* Auto Play Hover Indicator Alert */}
            {isMuted && !isHovered && (
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: 'rgba(8, 17, 31, 0.6)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-alt)',
                  zIndex: 20,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--color-gold)', borderRadius: '50%', animation: 'ping 1.5s infinite' }}></span>
                Autoplaying Muted (Hover or Tap to Listen)
              </div>
            )}
          </div>

          <div className="showreel-details" style={{ padding: '30px' }}>
            <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '1.8rem', color: 'var(--color-gold)' }}>
              Official MC & Anchor Showreel
            </h3>
            <p style={{ marginTop: '10px', fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Watch highlights from global corporate meets, award functions, high-profile celebrity events, and grand wedding sangeets. Experience the energy, timing, and luxury production value that Anushi Kothari brings to every stage.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Showreel;
