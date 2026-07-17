import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaEnvelope, FaInstagram, FaRegClock, FaChevronRight } from 'react-icons/fa';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import defaultBlogs from '../data/blogs.json';
import '../styles/blog.css';

const blogCategories = ['All', 'Events', 'Anchoring Tips', 'Lifestyle', 'Travel', 'Behind The Scenes', 'Media'];

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Newsletter form states
  const [email, setEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Fetch blogs from Firebase Database on mount
  useEffect(() => {
    const blogsRef = ref(db, 'blogs');
    const unsub = onValue(blogsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const blogList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setBlogs(blogList);
      } else {
        // Fallback to local default blogs.json if empty
        setBlogs(defaultBlogs);
      }
    });

    return () => unsub();
  }, []);

  // Filter posts based on search and category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = activeFilter === 'All' || blog.category === activeFilter;
    const matchesSearch = 
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Extract featured and trending posts for layout structure
  // Featured is flagged true in DB. Fallback to first blog if none flagged.
  const featuredPost = blogs.find(blog => blog.featured) || blogs[0];
  
  // Trending contains up to 3 posts flagged trending. Fallback to next 3 if none.
  const trendingPosts = blogs.filter(blog => blog.trending).slice(0, 3);
  const fallbackTrending = blogs.filter(blog => blog.id !== featuredPost?.id).slice(0, 3);
  const activeTrending = trendingPosts.length > 0 ? trendingPosts : fallbackTrending;

  // Grid posts are all filtered items that are NOT currently displayed as the primary featured story
  const gridPosts = filteredBlogs.filter(blog => blog.id !== featuredPost?.id);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setNewsletterSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setNewsletterSubscribed(false);
    }, 5000);
  };

  return (
    <div className="blog-page">
      <div className="bg-glow-blob blob-purple" style={{ top: '10%', left: '-5%', opacity: 0.1 }} />
      <div className="bg-glow-blob blob-gold" style={{ bottom: '20%', right: '-5%', opacity: 0.1 }} />

      <div className="blog-container">
        
        {/* Header Section */}
        <header className="blog-header">
          <span className="section-subtitle">My Blog</span>
          <h1>Stories, <span>Insights</span> & Behind the Scenes</h1>
          <p className="blog-header-desc">
            A peek into my world of media, anchoring, events, lifestyle and everything in between. Real stories. Real experiences. Real me.
          </p>
        </header>

        {/* Top Layout: Featured & Trending (Shown when no search/filters are active for clean landing) */}
        {!searchQuery && activeFilter === 'All' && blogs.length > 0 && (
          <div className="blog-top-layout">
            
            {/* Featured Section */}
            <div>
              <div className="trending-title">
                <span>✦</span> Featured Story
              </div>
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="glass-card featured-story-card"
                >
                  <div className="featured-img-wrapper">
                    <img src={featuredPost.image} alt={featuredPost.title} className="featured-img" loading="lazy" />
                  </div>
                  <div className="featured-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', flexWrap: 'wrap' }}>
                      <span className="blog-badge" style={{ marginBottom: 0 }}>{featuredPost.category}</span>
                      <span className="blog-date" style={{ marginBottom: 0 }}>{featuredPost.date} &bull; {featuredPost.readTime}</span>
                    </div>
                    <h3>{featuredPost.title}</h3>
                    <p className="testimonial-text">{featuredPost.summary}</p>
                    <button className="read-more-btn" onClick={() => setSelectedBlog(featuredPost)}>
                      Read More <FaChevronRight />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Trending Section */}
            <div className="trending-container">
              <div className="trending-title">
                <span>🔥</span> Trending Now
              </div>
              <div className="trending-list">
                {activeTrending.map((blog, idx) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="glass-card trending-item"
                  >
                    <img src={blog.image} alt={blog.title} className="trending-img" loading="lazy" />
                    <div className="trending-details">
                      <h4 onClick={() => setSelectedBlog(blog)}>{blog.title}</h4>
                      <span className="trending-meta">{blog.date} &bull; {blog.readTime}</span>
                    </div>
                    <span className="trending-num">0{idx + 1}</span>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Filter / Search Controls Bar */}
        <div className="blog-controls-bar">
          <div className="blog-filters">
            {blogCategories.map((category) => (
              <button
                key={category}
                className={`blog-filter-btn clickable ${activeFilter === category ? 'active' : ''}`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="blog-search-wrapper">
            <FaSearch className="blog-search-icon" />
            <input
              type="text"
              className="blog-search-input"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        {gridPosts.length === 0 ? (
          <div className="empty-state" style={{ minHeight: '300px' }}>
            <FaSearch className="empty-state-icon" />
            <p>No blog posts found matching your search or filter criteria.</p>
          </div>
        ) : (
          <div className="blog-grid">
            <AnimatePresence mode="popLayout">
              {gridPosts.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
                  className="blog-card glass-card"
                >
                  <div className="blog-card-img-wrapper">
                    <img src={blog.image} alt={blog.title} className="blog-card-img" loading="lazy" />
                  </div>
                  <div className="blog-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span className="blog-badge" style={{ marginBottom: 0, padding: '3px 10px', fontSize: '0.65rem' }}>{blog.category}</span>
                      <span className="blog-card-meta" style={{ marginBottom: 0 }}>{blog.date} &bull; {blog.readTime}</span>
                    </div>
                    <h3 onClick={() => setSelectedBlog(blog)}>{blog.title}</h3>
                    <p>{blog.summary}</p>
                    <div className="blog-card-footer">
                      <div className="blog-author">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" 
                          alt="Anushi Kothari" 
                          className="blog-author-img" 
                        />
                        <span>By Anushi</span>
                      </div>
                      <button className="read-more-btn" onClick={() => setSelectedBlog(blog)}>
                        Read <FaChevronRight />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Newsletter Signup Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card blog-newsletter-row"
        >
          <div className="newsletter-info">
            <div className="newsletter-icon-wrapper">
              <FaEnvelope />
            </div>
            <div className="newsletter-text">
              <h3>Let's stay connected!</h3>
              <p>Subscribe to my newsletter for the latest updates, event stories, and behind-the-scenes insights.</p>
            </div>
          </div>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder={newsletterSubscribed ? "Thank you for subscribing!" : "Enter your email address"}
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={newsletterSubscribed}
              required
            />
            <button type="submit" className="btn btn-gold newsletter-btn clickable" disabled={newsletterSubscribed}>
              {newsletterSubscribed ? "Subscribed!" : "Subscribe 🚀"}
            </button>
          </form>
        </motion.div>

      </div>

      {/* Reader Modal Lightbox */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="blog-modal-overlay"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="glass-card blog-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="blog-modal-close-btn clickable" onClick={() => setSelectedBlog(null)}>
                <FaTimes />
              </button>

              <img src={selectedBlog.image} alt={selectedBlog.title} className="blog-modal-hero-img" />

              <div className="blog-modal-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <span className="blog-badge" style={{ marginBottom: 0 }}>{selectedBlog.category}</span>
                  <span className="blog-date" style={{ marginBottom: 0 }}>{selectedBlog.date} &bull; {selectedBlog.readTime}</span>
                </div>
                <h2>{selectedBlog.title}</h2>
                <div className="blog-modal-body">
                  {selectedBlog.content}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
