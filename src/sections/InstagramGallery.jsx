import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaComment, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
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

// Utility to detect social platform
const detectPlatform = (link) => {
  if (!link) return 'instagram';
  const cleanLink = link.toLowerCase();
  if (cleanLink.includes('linkedin.com')) return 'linkedin';
  if (cleanLink.includes('facebook.com') || cleanLink.includes('fb.watch')) return 'facebook';
  return 'instagram';
};

// Utility to convert Instagram post/reel link to embed URL
const getInstagramEmbedUrl = (link) => {
  if (!link) return '';
  let cleanLink = link.trim().split('?')[0];
  if (cleanLink.endsWith('/')) {
    cleanLink = cleanLink.slice(0, -1);
  }
  return `${cleanLink}/embed`;
};

// Utility to convert LinkedIn post link to embed URL
const getLinkedInEmbedUrl = (link) => {
  if (!link) return '';
  
  // Try to find the URN pattern with prefixes like activity, share, ugcPost
  const urnMatch = link.match(/(activity|share|ugcPost)[-:](\d+)/i);
  if (urnMatch) {
    const type = urnMatch[1].toLowerCase();
    const id = urnMatch[2];
    const urnType = type === 'ugcpost' ? 'ugcPost' : type;
    return `https://www.linkedin.com/embed/feed/update/urn:li:${urnType}:${id}`;
  }
  
  // Fallback if we only found digits but no prefix
  const digitMatch = link.match(/\d{18,20}/);
  if (digitMatch) {
    const id = digitMatch[0];
    if (link.includes('/posts/')) {
      // User updates in feed are mostly activity URNs
      return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${id}`;
    }
    return `https://www.linkedin.com/embed/feed/update/urn:li:share:${id}`;
  }
  
  return '';
};

// Utility to convert Facebook post link to embed URL
const getFacebookEmbedUrl = (link) => {
  if (!link) return '';
  const isVideo = link.includes('/videos/') || link.includes('/watch/') || link.includes('/reels/') || link.includes('fb.watch');
  const plugin = isVideo ? 'video.php' : 'post.php';
  return `https://www.facebook.com/plugins/${plugin}?href=${encodeURIComponent(link)}&show_text=false&width=500`;
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

  return (
    <section className="section instagram-section">
      <div className="bg-glow-blob blob-purple instagram-blob" />

      <div className="section-title-wrapper">
        <span className="section-subtitle">Social Feed</span>
        <h2 className="section-title">Follow My Journey</h2>
      </div>

      <div className="instagram-grid">
        <AnimatePresence mode="popLayout">
          {slicedPosts.map((post, index) => {
            if (post.isFirebase) {
              const platform = detectPlatform(post.link);
              if (platform === 'instagram') {
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                    className="instagram-item social-embed-card"
                  >
                    <iframe
                      src={getInstagramEmbedUrl(post.link)}
                      title="Instagram Embed"
                      allowtransparency="true"
                      allowFullScreen={true}
                      frameBorder="0"
                      scrolling="no"
                      style={{ width: '100%', height: '480px', border: 'none', background: 'transparent' }}
                    />
                  </motion.div>
                );
              } else if (platform === 'linkedin') {
                const embedUrl = getLinkedInEmbedUrl(post.link);
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                    className="instagram-item social-embed-card"
                  >
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title="LinkedIn Embed"
                        frameBorder="0"
                        allowFullScreen={true}
                        style={{ width: '100%', height: '550px', border: 'none', background: 'transparent' }}
                      />
                    ) : (
                      <div className="embed-error">
                        <FaLinkedin style={{ fontSize: '2rem', color: '#0A66C2', marginBottom: '10px' }} />
                        <p>LinkedIn Share Post</p>
                        <a href={post.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
                          View Post
                        </a>
                      </div>
                    )}
                  </motion.div>
                );
              } else if (platform === 'facebook') {
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                    className="instagram-item social-embed-card"
                  >
                    <iframe
                      src={getFacebookEmbedUrl(post.link)}
                      title="Facebook Embed"
                      scrolling="no"
                      frameBorder="0"
                      allowFullScreen={true}
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      style={{ width: '100%', height: '500px', border: 'none', background: 'transparent' }}
                    />
                  </motion.div>
                );
              }
              return null;
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

      <div className="instagram-cta-wrapper" style={{ gap: '15px', flexWrap: 'wrap' }}>
        <a
          href="https://instagram.com/anushi_kothari"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline instagram-cta-btn clickable"
        >
          <FaInstagram /> View More On Instagram
        </a>
        <a
          href="https://www.linkedin.com/in/anushi-kothari-049821214/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline instagram-cta-btn clickable"
          style={{ borderColor: 'rgba(10, 102, 194, 0.4)', color: 'var(--text-primary)' }}
        >
          <FaLinkedin style={{ color: '#0A66C2' }} /> View More On LinkedIn
        </a>
      </div>
    </section>
  );
};

export default InstagramGallery;

