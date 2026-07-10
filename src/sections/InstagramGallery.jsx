import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaInstagram } from 'react-icons/fa';
import '../styles/instagram.css';

const InstagramGallery = () => {
  // Curated list of high-quality lifestyle/stage hosting images for the Instagram Grid
  const instagramPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&h=400&fm=webp&q=70',
      likes: '1,204',
      comments: '88',
      link: 'https://instagram.com/anushi_kothari'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&h=400&fm=webp&q=70',
      likes: '942',
      comments: '47',
      link: 'https://instagram.com/anushi_kothari'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=400&h=400&fm=webp&q=70',
      likes: '1,560',
      comments: '112',
      link: 'https://instagram.com/anushi_kothari'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&h=400&fm=webp&q=70',
      likes: '2,110',
      comments: '185',
      link: 'https://instagram.com/anushi_kothari'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&h=400&fm=webp&q=70',
      likes: '870',
      comments: '39',
      link: 'https://instagram.com/anushi_kothari'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=400&h=400&fm=webp&q=70',
      likes: '1,894',
      comments: '131',
      link: 'https://instagram.com/anushi_kothari'
    }
  ];

  return (
    <section className="section instagram-section">
      <div className="bg-glow-blob blob-purple instagram-blob" />

      <div className="section-title-wrapper">
        <span className="section-subtitle">Social Feed</span>
        <h2 className="section-title">Follow @anushi_kothari</h2>
      </div>

      <div className="instagram-grid">
        {instagramPosts.map((post, index) => (
          <motion.a
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="instagram-item glass-card clickable"
          >
            <div className="instagram-img-wrapper">
              <img src={post.image} alt="Anushi Kothari Instagram post" className="instagram-img" loading="lazy" decoding="async" />
              <div className="instagram-hover-overlay">
                <div className="instagram-stats">
                  <span><FaHeart className="stat-icon-ig" /> {post.likes}</span>
                  <span><FaComment className="stat-icon-ig" /> {post.comments}</span>
                </div>
                <FaInstagram className="instagram-icon-overlay" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="instagram-cta-wrapper">
        <a
          href="https://instagram.com/anushi_kothari"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline instagram-cta-btn clickable"
        >
          <FaInstagram /> View More On Instagram
        </a>
      </div>
    </section>
  );
};

export default InstagramGallery;
