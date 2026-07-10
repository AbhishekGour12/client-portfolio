import React from 'react';
import { FaGoogle, FaStar } from 'react-icons/fa';

// SET THIS TO 'true' TO ENABLE GOOGLE REVIEWS SECTION ON THE WEBSITE
export const SHOW_GOOGLE_REVIEWS = false;

const GoogleReviews = () => {
  if (!SHOW_GOOGLE_REVIEWS) return null;

  const reviews = [
    {
      id: 1,
      author: 'Sameer Sen',
      date: '2 weeks ago',
      rating: 5,
      text: 'Anushi anchored our grand launch event. She was brilliant, elegant, and kept the audience highly engaged! Highly recommended.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'
    },
    {
      id: 2,
      author: 'Rohit Khandelwal',
      date: '1 month ago',
      rating: 5,
      text: 'Unbelievable stage presence. She hosted our 3-day destination sangeet and reception with absolute energy and charm.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80'
    },
    {
      id: 3,
      author: 'Meera Deshmukh',
      date: '2 months ago',
      rating: 5,
      text: 'Professional, articulate, and excellent timing. She represents brand identities with extreme precision on stage.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80'
    }
  ];

  return (
    <section id="google-reviews" className="section google-reviews-section">
      <div className="section-title-wrapper">
        <span className="section-subtitle">Google Reviews</span>
        <h2 className="section-title">What Clients Say On Google</h2>
      </div>

      <div className="google-reviews-grid">
        {reviews.map((rev) => (
          <div key={rev.id} className="glass-card google-review-card">
            <div className="google-review-header">
              <img src={rev.avatar} alt={rev.author} className="google-review-avatar" loading="lazy" decoding="async" />
              <div className="google-review-meta">
                <h4>{rev.author}</h4>
                <span>{rev.date}</span>
              </div>
              <FaGoogle className="google-icon" />
            </div>

            <div className="google-review-stars">
              {[...Array(rev.rating)].map((_, i) => (
                <FaStar key={i} className="star-icon" />
              ))}
            </div>

            <p className="google-review-text">"{rev.text}"</p>
          </div>
        ))}
      </div>

      <div className="google-aggregate glass-card">
        <div className="google-aggregate-brand">
          <FaGoogle className="google-brand-icon" />
          <div>
            <h3>Google Rating</h3>
            <span>Trust Score 5.0 out of 5</span>
          </div>
        </div>
        <div className="google-aggregate-stars">
          <div className="stars-row">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="star-icon large" />
            ))}
          </div>
          <span>Based on 84 reviews</span>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
