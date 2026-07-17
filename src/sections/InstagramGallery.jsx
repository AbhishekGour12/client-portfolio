import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaComment, FaInstagram } from 'react-icons/fa';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import '../styles/instagram.css';

// Curated list of high-quality lifestyle/stage hosting images for the Instagram Grid
const defaultInstagramPosts = [
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

// Utility to convert Instagram post/reel link to embed URL
const getInstagramEmbedUrl = (link) => {
  if (!link) return '';
  let cleanLink = link.trim().split('?')[0];
  if (cleanLink.endsWith('/')) {
    cleanLink = cleanLink.slice(0, -1);
  }
  return `${cleanLink}/embed/`;
};

const InstagramGallery = () => {
  const [posts, setPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch Instagram posts from Firebase Realtime Database
  useEffect(() => {
    const instagramRef = ref(db, 'instagram');
    const unsub = onValue(instagramRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          link: data[key].link,
          isFirebase: true
        }));
        setPosts(list);
      } else {
        setPosts([]);
      }
    });

    return () => unsub();
  }, []);

  const displayPosts = posts.length > 0 ? posts : defaultInstagramPosts;
  const slicedPosts = displayPosts.slice(0, visibleCount);

  // Trigger Instagram embed processing when posts change
  useEffect(() => {
    const scriptId = 'instagram-embed-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };
    } else {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }
  }, [slicedPosts]);

  return (
    <section className="section instagram-section">
      <div className="bg-glow-blob blob-purple instagram-blob" />

      <div className="section-title-wrapper">
        <span className="section-subtitle">Social Feed</span>
        <h2 className="section-title">Follow @anushi_kothari</h2>
      </div>

      <div className="instagram-grid">
        <AnimatePresence mode="popLayout">
          {slicedPosts.map((post, index) => {
            if (post.isFirebase) {
              // Native Instagram Embed Blockquote (no height constraint)
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                  className="instagram-item glass-card"
                  style={{ 
                    padding: 0, 
                    background: 'rgba(16, 27, 46, 0.4)',
                    overflow: 'visible'
                  }}
                >
                  <blockquote 
                    className="instagram-media" 
                    data-instgrm-permalink={post.link} 
                    data-instgrm-version="14"
                    style={{ background: 'transparent', border: 'none', margin: '0', width: '100%' }}
                  >
                    <a href={post.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '40px', color: 'var(--color-gold)', textAlign: 'center', fontFamily: 'var(--font-alt)', textDecoration: 'none' }}>
                      <FaInstagram style={{ fontSize: '2rem', marginBottom: '10px' }} />
                      <span style={{ display: 'block' }}>Loading Instagram Reel...</span>
                    </a>
                  </blockquote>
                </motion.div>
              );
            } else {
              // Default Unsplash fallbacks
              return (
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
              );
            }
          })}
        </AnimatePresence>
      </div>

      {/* Show More Button */}
      {displayPosts.length > visibleCount && (
        <div className="instagram-cta-wrapper" style={{ marginTop: '40px', marginBottom: '-10px' }}>
          <button
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="btn btn-outline clickable"
          >
            Show More Posts
          </button>
        </div>
      )}

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

