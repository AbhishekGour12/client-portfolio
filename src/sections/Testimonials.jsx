import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { testimonialsData } from '../data/testimonials';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/testimonials.css';

const Testimonials = () => {
  return (
    <section id="testimonials" className="section testimonials-section">
      <div className="bg-glow-blob blob-purple testimonials-blob" />
      
      <div className="section-title-wrapper">
        <span className="section-subtitle">Client Reviews</span>
        <h2 className="section-title">Client Testimonials</h2>
      </div>

      <div className="testimonials-container">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 40,
            }
          }}
          className="testimonials-swiper"
        >
          {testimonialsData.map((test) => (
            <SwiperSlide key={test.id}>
              <div className="glass-card testimonial-card">
                <FaQuoteLeft className="quote-icon" />
                <p className="testimonial-text">"{test.review}"</p>
                
                <div className="testimonial-rating">
                  {[...Array(test.rating)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>

                <div className="testimonial-client">
                  <img src={test.avatar} alt={test.name} className="client-avatar" loading="lazy" decoding="async" />
                  <div className="client-meta">
                    <h4>{test.name}</h4>
                    <span>{test.company}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
