import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';
import '../styles/hero.css';

const Hero = () => {
  const typingWords = [
    'Celebrity Events.',
    'Corporate Summits.',
    'Luxury Weddings.',
    'Award Shows.',
    'Product Launches.'
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    let timer;
    const handleType = () => {
      const fullWord = typingWords[currentWordIndex];
      if (!isDeleting) {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setTypingSpeed(50);

        if (currentText === fullWord) {
          timer = setTimeout(() => setIsDeleting(true), 700); // Faster pause on complete word
          return;
        }
      } else {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setTypingSpeed(25);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % typingWords.length);
          return;
        }
      }
      
      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, typingSpeed]);

  const handleScrollTo = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* Background elements */}
      <img
        className="hero-video-fallback"
        src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&fm=webp&q=75"
        alt="Anushi Kothari - Premium Event Host & Anchor"
        fetchPriority="high"
        loading="eager"
        decoding="async"
      />
      <div className="hero-gradient-overlay" />
      
      <div className="bg-glow-blob blob-gold hero-blob-1" />
      <div className="bg-glow-blob blob-purple hero-blob-2" />

      <div className="hero-content">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-subtitle"
        >
          Professional Event Host & Anchor
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hero-title"
        >
          Anushi Kothari
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hero-typing-wrapper"
        >
          <span className="hero-typing-static">Elevating </span>
          <span className="hero-typing-text">{currentText}</span>
          <span className="hero-typing-cursor">|</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="hero-description"
        >
         Your Voice For Every Ocassion
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="hero-cta-group"
        >
          <button
            onClick={() => handleScrollTo('contact')}
            className="btn btn-gold hero-btnclickable"
          >
            <FaCalendarAlt /> Book Now
          </button>
          
          <button
            onClick={() => handleScrollTo('showreel')}
            className="btn btn-outline hero-btnclickable"
          >
            <FaPlay /> Watch Showreel
          </button>
        </motion.div>
      </div>

      <button
        onClick={() => handleScrollTo('about')}
        className="hero-scroll-indicator"
        aria-label="Scroll to next section"
      >
        <span>Explore Journey</span>
        <FaChevronDown className="bounce-arrow" />
      </button>
    </section>
  );
};

export default Hero;
