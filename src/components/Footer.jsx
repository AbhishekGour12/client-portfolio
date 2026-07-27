import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { footerLinks } from '../data/navigation';
import { socialLinksData } from '../data/socialLinks';
import { 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube, 
  FaFacebookF, 
  FaRegEnvelope, 
  FaPhoneAlt, 
  FaArrowUp,
  FaWhatsapp,
  FaFolderOpen,
  FaImages
} from 'react-icons/fa';
import '../styles/footer.css';

const FaIcons = {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaFacebookF,
  FaRegEnvelope,
  FaPhoneAlt,
  FaArrowUp,
  FaWhatsapp,
  FaFolderOpen,
  FaImages
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getIcon = (iconName) => {
    const Icon = FaIcons[iconName];
    return Icon ? <Icon /> : null;
  };

  const handleScrollToTop = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    
    if (targetId === 'contact') {
      navigate('/contact');
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
    <footer className="footer">
      <div className="footer-glow" />
      <div className="footer-container">
        
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#home" className="footer-logo" onClick={handleScrollToTop}>
              ANUSHI <span>KOTHARI</span>
            </a>
            <p className="footer-tagline">
              Crafting luxury stage experiences, command performances, and unforgettable event flows worldwide.
            </p>
            <div className="footer-socials">
              {socialLinksData.map((social) => {
                // Ignore email, phone, and raw folder links for the generic social icon circle list
                if (social.id === 'email' || social.id === 'phone' || social.id.includes('raw')) return null;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    aria-label={social.name}
                  >
                    {getIcon(social.iconName)}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-links-col">
              <h4 className="footer-col-title">Navigation</h4>
              <ul>
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.targetId}>
                    <a href={`#${link.targetId}`} onClick={(e) => handleNavClick(e, link.targetId)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title">Explore</h4>
              <ul>
                {footerLinks.supportLinks.map((link) => (
                  <li key={link.targetId}>
                    <a href={`#${link.targetId}`} onClick={(e) => handleNavClick(e, link.targetId)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title">Direct Enquiries</h4>
              <ul>
                {socialLinksData.filter(s => s.id === 'email' || s.id === 'phone').map((contact) => (
                  <li key={contact.id} className="footer-contact-item">
                    <span className="footer-contact-icon">{getIcon(contact.iconName)}</span>
                    <a href={contact.url}>{contact.username}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Anushi Kothari. All Rights Reserved. Designed for Luxury<span onClick={() => { navigate('/admin'); window.scrollTo(0, 0); }} style={{ cursor: 'default', userSelect: 'none' }}>.</span>
          </p>
          <div className="footer-legal">
            <a href="#privacy" className="clickable">Privacy Policy</a>
            <a href="#terms" className="clickable">Terms of Booking</a>
          </div>
          <button onClick={handleScrollToTop} className="footer-back-to-top" aria-label="Scroll to top">
            <FaArrowUp />
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
