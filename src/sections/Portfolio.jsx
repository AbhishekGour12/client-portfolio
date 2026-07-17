import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioCategories, portfolioItems } from '../data/portfolio';
import { FaEye, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import '../styles/portfolio.css';

const Portfolio = () => {
  const [categories, setCategories] = useState(['All']);
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredItems, setFilteredItems] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Fetch categories and projects from Firebase
  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    const unsubProjects = onValue(projectsRef, (snapshotProjects) => {
      const projectsData = snapshotProjects.val();
      
      if (projectsData) {
        // Use custom projects from database
        const projList = Object.keys(projectsData).map(key => projectsData[key]);
        setProjects(projList);

        // Fetch custom categories
        const categoriesRef = ref(db, 'categories');
        onValue(categoriesRef, (snapshotCategories) => {
          const categoriesData = snapshotCategories.val();
          if (categoriesData) {
            const catList = Object.keys(categoriesData).map(key => {
              const val = categoriesData[key];
              if (typeof val === 'string') return val;
              if (val && typeof val === 'object') return val.name || key;
              return key;
            });
            setCategories(['All', ...catList]);
          } else {
            // Extract categories from database projects if categories node is missing
            const uniqueCats = Array.from(new Set(projList.map(p => p.category)));
            setCategories(['All', ...uniqueCats]);
          }
        }, { onlyOnce: true });
      } else {
        // Fall back to local default static projects and categories
        setProjects(portfolioItems);
        setCategories(portfolioCategories);
      }
    });

    return () => {
      unsubProjects();
    };
  }, []);

  // Filter projects dynamically
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredItems(projects);
    } else {
      setFilteredItems(projects.filter(item => item.category === activeFilter));
    }
  }, [activeFilter, projects]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrev(e);
      if (e.key === 'ArrowRight') handleNext(e);
      if (e.key === 'Escape') setLightboxIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  return (
    <section id="portfolio" className="section portfolio-section">
      <div className="bg-glow-blob blob-purple portfolio-blob" />
      
      <div className="section-title-wrapper">
        <span className="section-subtitle">Visual Highlights</span>
        <h2 className="section-title">Portfolio Gallery</h2>
      </div>

      {/* Categories Filter Bar */}
      <div className="portfolio-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn clickable ${activeFilter === category ? 'active' : ''}`}
            onClick={() => setActiveFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <motion.div layout className="portfolio-grid">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              key={item.id}
              className="portfolio-card glass-card clickable"
              onClick={() => setLightboxIndex(index)}
            >
              <div className="portfolio-image-wrapper">
                <img src={item.image} alt={item.title} className="portfolio-image" loading="lazy" decoding="async" />
                <div className="portfolio-hover-overlay">
                  <div className="portfolio-hover-content">
                    <span className="portfolio-hover-category">{item.category}</span>
                    <h3 className="portfolio-hover-title">{item.title}</h3>
                    <div className="portfolio-hover-icon">
                      <FaEye />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Full Screen Image Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="lightbox-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
            >
              <FaTimes />
            </button>

            <button
              className="lightbox-nav-btn prev clickable"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lightbox-content-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className="lightbox-image"
                loading="lazy"
                decoding="async"
              />
              <div className="lightbox-info">
                <span className="lightbox-category">{filteredItems[lightboxIndex].category}</span>
                <h3 className="lightbox-title">{filteredItems[lightboxIndex].title}</h3>
                <p className="lightbox-desc">{filteredItems[lightboxIndex].description}</p>
                <div className="replace-comment-label">
                  {`// Replace this photo with your original ${filteredItems[lightboxIndex].category} asset.`}
                </div>
              </div>
            </motion.div>

            <button
              className="lightbox-nav-btn next clickable"
              onClick={handleNext}
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
