import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigationLinks } from '../data/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScrollNavbar = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScrollNavbar, { passive: true });

    // Active Section Tracking via IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const observedIds = new Set();
    let intervalId;
    let attempts = 0;

    const setupObserver = () => {
      attempts++;
      navigationLinks.forEach((link) => {
        if (observedIds.has(link.targetId)) return;
        const el = document.getElementById(link.targetId);
        if (el) {
          observer.observe(el);
          observedIds.add(link.targetId);
        }
      });

      const homeSections = ['home', 'about', 'portfolio', 'services'];
      const allObserved = location.pathname === '/' 
        ? homeSections.every(id => observedIds.has(id))
        : true;

      if ((allObserved || attempts >= 30) && intervalId) {
        clearInterval(intervalId);
      }
    };

    intervalId = setInterval(setupObserver, 300);
    setupObserver();

    return () => {
      window.removeEventListener('scroll', handleScrollNavbar);
      observer.disconnect();
      if (intervalId) clearInterval(intervalId);
    };
  }, [location.pathname]);

  // Set active section when routing or loading specific sections/pages
  useEffect(() => {
    if (location.pathname === '/contact') {
      setActiveSection('contact');
    } else if (location.pathname === '/blog') {
      setActiveSection('blog');
    } else if (location.pathname === '/') {
      if (location.hash) {
        setActiveSection(location.hash.substring(1));
      } else {
        setActiveSection('home');
      }
    }
  }, [location.pathname, location.hash]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (targetId === 'contact') {
      navigate('/contact');
      window.scrollTo(0, 0);
      return;
    }

    if (targetId === 'blog') {
      navigate('/blog');
      window.scrollTo(0, 0);
      return;
    }

    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
    } else {
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
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="#home" className="navbar-logo" onClick={(e) => handleNavClick(e, 'home')}>
          <img src="/logo.png" alt="Anushi Kothari Logo" className="navbar-logo-img" />
        </a>

        {/* Desktop Links */}
        <ul className="navbar-menu">
          {navigationLinks.map((link) => (
            <li key={link.targetId} className="navbar-item">
              <a
                href={`#${link.targetId}`}
                className={`navbar-link ${activeSection === link.targetId ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, link.targetId)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Book Now Button Desktop */}
        <div className="navbar-cta-wrapper">
          <a
            href="#contact"
            className="btn btn-gold navbar-cta"
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            Book Now
          </a>
        </div>

        {/* Hamburger Icon */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`navbar-mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="navbar-mobile-menu">
          {navigationLinks.map((link) => (
            <li key={link.targetId} className="navbar-mobile-item">
              <a
                href={`#${link.targetId}`}
                className={`navbar-mobile-link ${activeSection === link.targetId ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, link.targetId)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="navbar-mobile-item">
            <a
              href="#contact"
              className="btn btn-gold navbar-mobile-cta"
              onClick={(e) => handleNavClick(e, 'contact')}
            >
              Book Now
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
