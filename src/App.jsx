import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Styles
import './styles/index.css';

// Core Components
import SEO from './components/SEO';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import GoogleReviews from './components/GoogleReviews';

// Lazy Loaded Sections for Code Splitting
const Hero = lazy(() => import('./sections/Hero'));
const About = lazy(() => import('./sections/About'));
const Statistics = lazy(() => import('./sections/Statistics'));
const Services = lazy(() => import('./sections/Services'));
const Portfolio = lazy(() => import('./sections/Portfolio'));
const Showreel = lazy(() => import('./sections/Showreel'));
const Testimonials = lazy(() => import('./sections/Testimonials'));
const Brands = lazy(() => import('./sections/Brands'));
const InstagramGallery = lazy(() => import('./sections/InstagramGallery'));
const FAQ = lazy(() => import('./sections/FAQ'));
const Contact = lazy(() => import('./sections/Contact'));
const AdminPanel = lazy(() => import('./sections/AdminPanel'));
const Blog = lazy(() => import('./sections/Blog'));

// Scroll to Top on Route Change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Home View rendering all sections except Contact
const HomeView = () => (
  <>
    <Hero />
    <About />
    <Statistics />
    <Services />
    <Portfolio />
    <Showreel />
    <Testimonials />
    <Brands />
    <InstagramGallery />
    <FAQ />
    <GoogleReviews />
  </>
);

function AppContent() {
  const [loading, setLoading] = useState(() => {
    // Skip preloader on mobile/tablet for instant FCP and LCP paint times
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return true;
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  // Initial Loader Timeout
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // Shortened loader duration to improve SEO and FCP
    return () => clearTimeout(timer);
  }, [loading]);

  // Scroll Progress and Sticky CTA Listeners with passive: true and requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // 1. Scroll Progress Bar
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
          }

          // 2. Sticky CTA visibility (display past Hero section - approx 750px)
          if (window.scrollY > 750) {
            setShowStickyCta(true);
          } else {
            setShowStickyCta(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash scrolling on page redirection/landing
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const targetId = location.hash.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        // Wait a brief moment to ensure the component is loaded and rendered
        const timer = setTimeout(() => {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - navbarHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location]);


  const handleStickyCtaClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/contact') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/contact');
    }
  };

  return (
    <>
      <ScrollToTop />
      <SEO />

      {/* Accessibility: Skip to Content link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <AnimatePresence mode="wait">
        {loading ? (
          // Luxury Preloader Animation (div instead of h1 for SEO heading sequential structure)
          <motion.div
            key="preloader"
            className="preloader-overlay"
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="preloader-logo-wrapper">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="preloader-logo"
              >
                ANUSHI <span>KOTHARI</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="preloader-subtitle"
              >
                World-Class Master of Ceremonies
              </motion.p>

              <div className="preloader-progress-container">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                  className="preloader-progress-bar"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          // Main Website Content
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="main-layout"
          >

            {/* Scroll Progress Line */}
            <div className="scroll-progress-container">
              <div
                className="scroll-progress-bar"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>

            {/* Header Sticky Navbar */}
            {!isAdminRoute && <Navbar />}

            {/* Main Sections Wrapper */}
            <main id="main-content">
              <Suspense fallback={
                <div className="section-fallback-loader">
                  <div className="fallback-spinner" />
                </div>
              }>
                <Routes>
                  <Route path="/" element={<HomeView />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/blog" element={<Blog />} />
                </Routes>
              </Suspense>
            </main>

            {/* Footer */}
            {!isAdminRoute && <Footer />}

            {/* Floating WhatsApp CTA */}
            {!isAdminRoute && <WhatsAppButton />}


          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App;
