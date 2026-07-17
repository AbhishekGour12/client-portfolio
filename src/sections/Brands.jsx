import React from 'react';
import { brandsData } from '../data/brands';
import '../styles/brands.css';

const Brands = () => {
  return (
    <section className="brands-marquee-section">
      <div className="brands-title-container">
        <span className="brands-marquee-subtitle">Collaboration Network</span>
        <h2>Trusted By Prestigious Brands & Event Agencies</h2>
      </div>

      <div className="marquee-container">
        <div className="marquee-content">
          {brandsData.map((brand, index) => (
            <div key={`${brand.id}-1-${index}`} className="brand-logo-item clickable">
              {brand.image && (
                <img 
                  src={brand.image} 
                  alt={`${brand.name} logo`} 
                  className="brand-logo-img" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <span className="brand-logo-name">{brand.name}</span>
            </div>
          ))}
        </div>

        <div className="marquee-content" aria-hidden="true">
          {brandsData.map((brand, index) => (
            <div key={`${brand.id}-2-${index}`} className="brand-logo-item clickable">
              {brand.image && (
                <img 
                  src={brand.image} 
                  alt={`${brand.name} logo`} 
                  className="brand-logo-img" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <span className="brand-logo-name">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;
