import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  // Pre-configured phone number (international format without '+' or leading zeros) and pre-filled message
  const whatsappNumber = '919983456885'; 
  const message = encodeURIComponent("Hi Anushi, I would like to enquire about your availability to host/anchor our upcoming event.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float clickable"
      aria-label="Contact Anushi Kothari on WhatsApp"
    >
      <div className="whatsapp-pulse pulse-1" />
      <div className="whatsapp-pulse pulse-2" />
      <FaWhatsapp className="whatsapp-icon" />
    </a>
  );
};

export default WhatsAppButton;
