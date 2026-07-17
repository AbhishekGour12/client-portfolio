import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socialLinksData } from '../data/socialLinks';
import { 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube, 
  FaFacebookF, 
  FaRegEnvelope, 
  FaPhoneAlt,
  FaCheckCircle, 
  FaSpinner,
  FaWhatsapp,
  FaFolderOpen,
  FaImages
} from 'react-icons/fa';
import '../styles/contact.css';

const FaIcons = {
  FaRegEnvelope,
  FaPhoneAlt,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaFacebookF,
  FaCheckCircle,
  FaSpinner,
  FaWhatsapp,
  FaFolderOpen,
  FaImages
};

const Contact = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    event_type: '',
    event_date: '',
    event_location: '',
    event_budget: '',
    message: '',
    honey: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [apiError, setApiError] = useState('');

  const getIcon = (iconName) => {
    const Icon = FaIcons[iconName];
    return Icon ? <Icon /> : null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_name.trim()) newErrors.user_name = 'Name is required';
    if (!formData.user_email.trim()) {
      newErrors.user_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      newErrors.user_email = 'Invalid email address';
    }
    if (!formData.user_phone.trim()) newErrors.user_phone = 'Phone number is required';
    if (!formData.event_type) newErrors.event_type = 'Please select an event category';
    if (!formData.event_date) newErrors.event_date = 'Please pick a date';
    if (!formData.event_location.trim()) newErrors.event_location = 'Event location is required';
    if (!formData.event_budget) newErrors.event_budget = 'Please specify a budget range';
    if (!formData.message.trim()) newErrors.message = 'Please share some event details';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Honeypot check for spam bots
    if (formData.honey) {
      console.warn('Spam submission detected.');
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessModal(true);
        setFormData({
          user_name: '',
          user_email: '',
          user_phone: '',
          event_type: '',
          event_date: '',
          event_location: '',
          event_budget: '',
          message: '',
          honey: ''
        });
      }, 1000);
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitting(false);
        setShowSuccessModal(true);
        setFormData({
          user_name: '',
          user_email: '',
          user_phone: '',
          event_type: '',
          event_date: '',
          event_location: '',
          event_budget: '',
          message: '',
          honey: ''
        });
      } else {
        throw new Error(data.error || 'Failed to submit booking request.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setIsSubmitting(false);
      setApiError(err.message || 'Failed to send mail. Please contact directly at anchoranushi@gmail.com');
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="bg-glow-blob blob-purple contact-blob" />
      
      <div className="section-title-wrapper">
        <span className="section-subtitle">Reserve the Stage</span>
        <h2 className="section-title">Book Anushi Kothari</h2>
      </div>

      <div className="contact-grid">
        
        {/* Info Column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
          className="contact-info-panel glass-card"
        >
          <h3>Let’s Create Something Extraordinary</h3>
          <p className="contact-panel-desc">
            Partner with a celebrity emcee who transforms events into spectacles. Complete this booking form to check calendar availability, negotiate travel logistics, and receive a customized hosting proposal.
          </p>

          <div className="contact-quote">
            <p className="quote-text">
              “Some people speak on stage. Others make the stage speak to the audience.”
            </p>
          </div>

          <div className="contact-methods">
            {socialLinksData.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target={social.id !== 'email' && social.id !== 'phone' ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="contact-method-item clickable"
              >
                <div className="contact-method-icon">
                  {getIcon(social.iconName)}
                </div>
                <div className="contact-method-text">
                  <span className="method-label">{social.name}</span>
                  <span className="method-value">{social.username}</span>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Form Column */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
          className="contact-form-panel glass-card"
        >
          <form ref={formRef} onSubmit={handleSubmit} className="booking-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="user_name">Full Name</label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  className="form-control"
                  placeholder="Enter name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                />
                {errors.user_name && <span className="form-error">{errors.user_name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user_email">Email Address</label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  className="form-control"
                  placeholder="name@company.com"
                  value={formData.user_email}
                  onChange={handleInputChange}
                />
                {errors.user_email && <span className="form-error">{errors.user_email}</span>}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="user_phone">Phone Number</label>
                <input
                  type="tel"
                  id="user_phone"
                  name="user_phone"
                  className="form-control"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.user_phone}
                  onChange={handleInputChange}
                />
                {errors.user_phone && <span className="form-error">{errors.user_phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="event_type">Event Category</label>
                <select
                  id="event_type"
                  name="event_type"
                  className="form-control"
                  value={formData.event_type}
                  onChange={handleInputChange}
                >
                  <option value="">Select Event Category</option>
                  <option value="Corporate Conferences & Summits">Corporate Conferences & Summits</option>
                  <option value="Annual General Meetings & Dealer Meets">Annual General Meetings & Dealer Meets</option>
                  <option value="Brand Launches & Activations">Brand Launches & Activations</option>
                  <option value="Award Ceremonies & Felicitations">Award Ceremonies & Felicitations</option>
                  <option value="Weddings & Celebrations">Weddings & Celebrations</option>
                  <option value="Cultural & Youth Events">Cultural & Youth Events</option>
                  <option value="Private & VIP Events">Private & VIP Events</option>
                  <option value="Other">Other</option>
                </select>
                {errors.event_type && <span className="form-error">{errors.event_type}</span>}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="event_date">Event Date</label>
                <input
                  type="date"
                  id="event_date"
                  name="event_date"
                  className="form-control"
                  value={formData.event_date}
                  onChange={handleInputChange}
                />
                {errors.event_date && <span className="form-error">{errors.event_date}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="event_location">Event Location</label>
                <input
                  type="text"
                  id="event_location"
                  name="event_location"
                  className="form-control"
                  placeholder="City, Country"
                  value={formData.event_location}
                  onChange={handleInputChange}
                />
                {errors.event_location && <span className="form-error">{errors.event_location}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="event_budget">Expected Budget / Price Range</label>
              <select
                id="event_budget"
                name="event_budget"
                className="form-control"
                value={formData.event_budget}
                onChange={handleInputChange}
              >
                <option value="">Select Budget Range</option>
                <option value="Prefer to Discuss">Prefer to Discuss</option>
                <option value="Under ₹50,000">Under ₹50,000</option>
                <option value="₹50,000 – ₹1 Lakh">₹50,000 – ₹1 Lakh</option>
                <option value="₹1 Lakh – ₹2 Lakhs">₹1 Lakh – ₹2 Lakhs</option>
                <option value="₹2 Lakhs+">₹2 Lakhs+</option>
              </select>
              {errors.event_budget && <span className="form-error">{errors.event_budget}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">Message & Itinerary</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="form-control"
                placeholder="Share details regarding timelines, stage setup, dress codes, or audience size..."
                value={formData.message}
                onChange={handleInputChange}
              />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </div>

            {apiError && <div className="form-error api-error-alert">{apiError}</div>}

            {/* Honeypot Spam Protection Field */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="honey">Do not fill this out if you are human</label>
              <input
                type="text"
                id="honey"
                name="honey"
                value={formData.honey}
                onChange={handleInputChange}
                tabIndex="-1"
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-gold submit-booking-btn clickable"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spinner-icon" /> Sending Request...
                </>
              ) : (
                'Submit Booking Request'
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Google Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="contact-map-wrapper"
      >
        <h3 className="map-title">Locate Anchor Anushi</h3>
        <div className="contact-map-container glass-card">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.799078788484!2d72.827376!3d19.0759837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Anchor Anushi Location Map"
          ></iframe>
        </div>
      </motion.div>


      {/* Success Animation Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="contact-modal-overlay"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="glass-card success-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="success-icon-wrapper">
                <FaCheckCircle />
              </div>
              <h3>Booking Request Sent!</h3>
              <p>
                Thank you for reaching out. Your event details have been successfully transmitted. Anushi's management team will review the date availability and contact you within 24 hours.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="btn btn-gold success-close-btn clickable"
              >
                Great, Thank You
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact;
