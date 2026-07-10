import React from 'react';
import { brandsData } from '../data/brands';
import '../styles/brands.css';

const Brands = () => {
  // Tripling the brands array ensures seamless infinite scrolling loop
  const marqueeItems = [...brandsData, ...brandsData, ...brandsData];

  return (
    <section className="brands-marquee-section">
      <div className="brands-title-container">
        <span className="brands-marquee-subtitle">Collaboration Network</span>
        <h2>Trusted By Prestigious Brands & Event Agencies</h2>
      </div>

      <div className="marquee-container">
        <div className="marquee-content">
          {marqueeItems.map((brand, index) => (
            <div key={`${brand.id}-${index}`} className="brand-logo-item clickable">
              {brand.image && (
                <img 
                  src={brand.image} 
                  alt={`${brand.name} logo`} 
                  className="brand-logo-img" 
                  onError={(e) => {
                    // Fallback to hide image if it fails to load
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
