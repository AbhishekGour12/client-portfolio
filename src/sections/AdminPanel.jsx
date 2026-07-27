import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  ref, 
  set, 
  push, 
  remove, 
  onValue,
  update
} from 'firebase/database';
import { auth, db } from '../firebase';
import { 
  FaFolder, 
  FaImages, 
  FaQuoteLeft, 
  FaInstagram, 
  FaTrash, 
  FaEdit,
  FaStar, 
  FaCloudUploadAlt, 
  FaSignOutAlt, 
  FaLock, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaBookOpen,
  FaLinkedin,
  FaFacebook
} from 'react-icons/fa';
import '../styles/admin.css';

// Client-side parameters signature generator for Cloudinary (sorted alphabetically)
async function generateParamsSignature(params, apiSecret) {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  const signatureString = `${paramString}${apiSecret}`;
  
  const utf8 = new TextEncoder().encode(signatureString);
  const hashBuffer = await crypto.subtle.digest('SHA-1', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('categories');

  // Loaded DB data states
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [aboutCarousel, setAboutCarousel] = useState([]);

  // Toast / notification state
  const [toast, setToast] = useState(null);

  // Form states
  const [loading, setLoading] = useState(false);
  
  // Tab 1: Category Form & Editing
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // { id, name }

  // Tab 2: Project Form & Editing
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectImage, setProjectImage] = useState(null); // File object
  const [projectImagePreview, setProjectImagePreview] = useState('');
  const [editingProject, setEditingProject] = useState(null); // { id, title, category, description, image, publicId }
  
  // Tab 3: Testimonial Form & Editing
  const [testimonialName, setTestimonialName] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [testimonialRating, setTestimonialRating] = useState(5);
  const [testimonialAvatar, setTestimonialAvatar] = useState(null); // File object
  const [testimonialAvatarPreview, setTestimonialAvatarPreview] = useState('');
  const [editingTestimonial, setEditingTestimonial] = useState(null); // { id, name, review, rating, avatar, publicId }

  // Tab 4: Instagram Form & Editing
  const [instagramLink, setInstagramLink] = useState('');
  const [editingInstagram, setEditingInstagram] = useState(null); // { id, link }

  // Tab 5: Blog Form & Editing
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState(null); // File object
  const [blogImagePreview, setBlogImagePreview] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('4 min read');
  const [blogFeatured, setBlogFeatured] = useState(false);
  const [blogTrending, setBlogTrending] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null); // { id, title, category, summary, content, image, publicId, date, readTime, featured, trending }

  // Tab 6: About Carousel Form & Editing
  const [aboutImagesList, setAboutImagesList] = useState([]); // Array of File objects for adding
  const [aboutImagePreviews, setAboutImagePreviews] = useState([]); // Array of preview URLs
  const [aboutSingleImage, setAboutSingleImage] = useState(null); // Single File object for editing
  const [aboutSinglePreview, setAboutSinglePreview] = useState(''); // Single preview URL for editing
  const [editingAbout, setEditingAbout] = useState(null); // { id, url, publicId }

  // Set up Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all database records when authenticated
  useEffect(() => {
    if (!user) return;

    // 1. Categories
    const categoriesRef = ref(db, 'categories');
    const unsubCategories = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const catList = Object.keys(data).map(key => {
          const val = data[key];
          if (typeof val === 'string') {
            return { id: key, name: val };
          }
          if (val && typeof val === 'object') {
            return {
              id: val.id || key,
              name: val.name || key
            };
          }
          return { id: key, name: key };
        });
        setCategories(catList);
      } else {
        setCategories([]);
      }
    });

    // 2. Projects
    const projectsRef = ref(db, 'projects');
    const unsubProjects = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setProjects(projList);
      } else {
        setProjects([]);
      }
    });

    // 3. Testimonials
    const testimonialsRef = ref(db, 'testimonials');
    const unsubTestimonials = onValue(testimonialsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const testList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setTestimonials(testList);
      } else {
        setTestimonials([]);
      }
    });

    // 4. Instagram Feed
    const instagramRef = ref(db, 'instagram');
    const unsubInstagram = onValue(instagramRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const igList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setInstagramPosts(igList);
      } else {
        setInstagramPosts([]);
      }
    });

    // 5. Blogs
    const blogsRef = ref(db, 'blogs');
    const unsubBlogs = onValue(blogsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const blogList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setBlogs(blogList);
      } else {
        setBlogs([]);
      }
    });

    // 6. About Carousel
    const aboutCarouselRef = ref(db, 'aboutCarousel');
    const unsubAbout = onValue(aboutCarouselRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const aboutList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setAboutCarousel(aboutList);
      } else {
        setAboutCarousel([]);
      }
    });

    return () => {
      unsubCategories();
      unsubProjects();
      unsubTestimonials();
      unsubInstagram();
      unsubBlogs();
      unsubAbout();
    };
  }, [user]);

  // Trigger Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Auth Submit Action
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!email || !password) {
      setAuthError('Please fill in all fields.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Welcome back, Admin!');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/configuration-not-found') {
        setAuthError('Email/Password Sign-in provider is disabled in Firebase. Please enable it in your Firebase Console under Authentication > Sign-in method.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password.');
      } else {
        setAuthError(err.message || 'Authentication failed.');
      }
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showToast('Logged out successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  // Cloudinary image upload utility - returns { url, publicId }
  const uploadToCloudinary = async (file) => {
    const cloudName = 'seqeiob7';
    const apiKey = '981184364898473';
    const apiSecret = '5rbqFXJAuS9H1pRb_couO2GuCpM';
    const timestamp = Math.round(new Date().getTime() / 1000);

    const params = { timestamp: timestamp };
    const signature = await generateParamsSignature(params, apiSecret);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'Failed to upload image to Cloudinary');
    }

    const resData = await response.json();
    return {
      url: resData.secure_url,
      publicId: resData.public_id
    };
  };

  // Cloudinary image destroy utility
  const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;
    try {
      const cloudName = 'seqeiob7';
      const apiKey = '981184364898473';
      const apiSecret = '5rbqFXJAuS9H1pRb_couO2GuCpM';
      const timestamp = Math.round(new Date().getTime() / 1000);

      const params = {
        public_id: publicId,
        timestamp: timestamp
      };

      const signature = await generateParamsSignature(params, apiSecret);

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        console.warn('Cloudinary delete warning:', errData.error?.message);
      } else {
        console.log('Cloudinary image deleted successfully:', publicId);
      }
    } catch (err) {
      console.error('Cloudinary destroy error:', err);
    }
  };

  // Tab 1: Create or Update Category
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    try {
      const sanitizedName = newCategoryName.trim();
      
      if (editingCategory) {
        // Updating existing Category
        const id = editingCategory.id;
        await set(ref(db, `categories/${id}`), {
          id,
          name: sanitizedName
        });
        showToast(`Category updated to "${sanitizedName}".`);
        setEditingCategory(null);
      } else {
        // Creating new Category
        const id = sanitizedName.replace(/\s+/g, '-').toLowerCase();
        await set(ref(db, `categories/${id}`), {
          id,
          name: sanitizedName
        });
        showToast(`Category "${sanitizedName}" added successfully.`);
      }

      setNewCategoryName('');
    } catch (err) {
      console.error(err);
      showToast('Failed to save category.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Tab 1: Set Category Edit Mode
  const startEditCategory = (cat) => {
    setEditingCategory(cat);
    setNewCategoryName(cat.name);
  };

  // Tab 1: Delete Category
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      await remove(ref(db, `categories/${id}`));
      showToast(`Category "${name}" deleted.`);
      if (editingCategory?.id === id) {
        setEditingCategory(null);
        setNewCategoryName('');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete category.', 'error');
    }
  };

  // File picker handler for projects
  const handleProjectImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectImage(file);
      setProjectImagePreview(URL.createObjectURL(file));
    }
  };

  // Tab 2: Create or Update Project
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectCategory) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!editingProject && !projectImage) {
      showToast('Please select a project image.', 'error');
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = editingProject?.image || '';
      let finalPublicId = editingProject?.publicId || '';

      if (projectImage) {
        showToast('Uploading new image to Cloudinary...', 'success');
        const uploadResult = await uploadToCloudinary(projectImage);
        if (editingProject?.publicId) {
          showToast('Cleaning up old image...', 'success');
          await deleteFromCloudinary(editingProject.publicId);
        }
        finalImageUrl = uploadResult.url;
        finalPublicId = uploadResult.publicId;
      }

      if (editingProject) {
        const projectRef = ref(db, `projects/${editingProject.id}`);
        await update(projectRef, {
          title: projectTitle.trim(),
          category: projectCategory,
          description: projectDesc.trim(),
          image: finalImageUrl,
          publicId: finalPublicId
        });
        showToast('Project updated successfully!');
        setEditingProject(null);
      } else {
        const projectsRef = ref(db, 'projects');
        const newProjectRef = push(projectsRef);
        await set(newProjectRef, {
          id: newProjectRef.key,
          title: projectTitle.trim(),
          category: projectCategory,
          description: projectDesc.trim(),
          image: finalImageUrl,
          publicId: finalPublicId
        });
        showToast('Project published successfully!');
      }

      setProjectTitle('');
      setProjectCategory('');
      setProjectDesc('');
      setProjectImage(null);
      setProjectImagePreview('');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to save project.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Tab 2: Start Edit Project
  const startEditProject = (proj) => {
    setEditingProject(proj);
    setProjectTitle(proj.title);
    setProjectCategory(proj.category);
    setProjectDesc(proj.description || '');
    setProjectImagePreview(proj.image);
    setProjectImage(null);
  };

  // Tab 2: Delete Project
  const handleDeleteProject = async (id, title, publicId) => {
    if (!window.confirm(`Are you sure you want to delete project "${title}"?`)) return;

    try {
      if (publicId) {
        showToast('Removing image from Cloudinary...', 'success');
        await deleteFromCloudinary(publicId);
      }
      await remove(ref(db, `projects/${id}`));
      showToast(`Project "${title}" deleted.`);
      
      if (editingProject?.id === id) {
        setEditingProject(null);
        setProjectTitle('');
        setProjectCategory('');
        setProjectDesc('');
        setProjectImagePreview('');
        setProjectImage(null);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete project.', 'error');
    }
  };

  // File picker handler for testimonials
  const handleTestimonialAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTestimonialAvatar(file);
      setTestimonialAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Tab 3: Create or Update Testimonial
  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialName.trim() || !testimonialText.trim()) {
      showToast('Please fill in client name and review text.', 'error');
      return;
    }

    setLoading(true);
    try {
      let finalAvatarUrl = editingTestimonial?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=70';
      let finalPublicId = editingTestimonial?.publicId || '';

      if (testimonialAvatar) {
        showToast('Uploading new avatar to Cloudinary...', 'success');
        const uploadResult = await uploadToCloudinary(testimonialAvatar);
        if (editingTestimonial?.publicId) {
          await deleteFromCloudinary(editingTestimonial.publicId);
        }
        finalAvatarUrl = uploadResult.url;
        finalPublicId = uploadResult.publicId;
      }

      if (editingTestimonial) {
        const testRef = ref(db, `testimonials/${editingTestimonial.id}`);
        await update(testRef, {
          name: testimonialName.trim(),
          review: testimonialText.trim(),
          rating: Number(testimonialRating),
          avatar: finalAvatarUrl,
          publicId: finalPublicId
        });
        showToast('Testimonial updated successfully!');
        setEditingTestimonial(null);
      } else {
        const testimonialsRef = ref(db, 'testimonials');
        const newTestRef = push(testimonialsRef);
        await set(newTestRef, {
          id: newTestRef.key,
          name: testimonialName.trim(),
          review: testimonialText.trim(),
          rating: Number(testimonialRating),
          avatar: finalAvatarUrl,
          publicId: finalPublicId,
          company: 'Verified Client'
        });
        showToast('Testimonial added successfully!');
      }

      setTestimonialName('');
      setTestimonialText('');
      setTestimonialRating(5);
      setTestimonialAvatar(null);
      setTestimonialAvatarPreview('');
    } catch (err) {
      console.error(err);
      showToast('Failed to save testimonial.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Tab 3: Start Edit Testimonial
  const startEditTestimonial = (test) => {
    setEditingTestimonial(test);
    setTestimonialName(test.name);
    setTestimonialText(test.review);
    setTestimonialRating(test.rating);
    setTestimonialAvatarPreview(test.avatar);
    setTestimonialAvatar(null);
  };

  // Tab 3: Delete Testimonial
  const handleDeleteTestimonial = async (id, name, publicId) => {
    if (!window.confirm(`Are you sure you want to delete testimonial by "${name}"?`)) return;

    try {
      if (publicId) {
        showToast('Removing avatar from Cloudinary...', 'success');
        await deleteFromCloudinary(publicId);
      }
      await remove(ref(db, `testimonials/${id}`));
      showToast(`Testimonial from "${name}" deleted.`);

      if (editingTestimonial?.id === id) {
        setEditingTestimonial(null);
        setTestimonialName('');
        setTestimonialText('');
        setTestimonialRating(5);
        setTestimonialAvatarPreview('');
        setTestimonialAvatar(null);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete testimonial.', 'error');
    }
  };

  // Tab 4: Create or Update Social Feed Post
  const handleInstagramSubmit = async (e) => {
    e.preventDefault();
    if (!instagramLink.trim()) return;

    const trimmedLink = instagramLink.trim();
    
    // Check URL validity
    let isValidUrl = false;
    try {
      new URL(trimmedLink);
      isValidUrl = true;
    } catch (_) {
      isValidUrl = false;
    }

    if (!isValidUrl) {
      showToast('Please enter a valid URL.', 'error');
      return;
    }

    let cleanLink = trimmedLink;
    
    if (trimmedLink.includes('instagram.com') || trimmedLink.includes('instagr.am')) {
      const igRegex = /(https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+)/;
      const match = trimmedLink.match(igRegex);
      if (match) {
        cleanLink = match[1];
      } else {
        showToast('Invalid Instagram link. Must be a post or reel (e.g. /p/ or /reel/)', 'error');
        return;
      }
    } else if (trimmedLink.includes('linkedin.com')) {
      if (!trimmedLink.includes('/posts/') && !trimmedLink.includes('/feed/update/') && !trimmedLink.includes('/embed/')) {
        showToast('LinkedIn URL should be a post update (e.g., contains /posts/ or /feed/update/).', 'warning');
      }
    } else if (trimmedLink.includes('facebook.com') || trimmedLink.includes('fb.watch')) {
      // Allow any Facebook post/video/reel links
    } else {
      showToast('Only Instagram, LinkedIn, or Facebook links are supported for the Social Feed.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editingInstagram) {
        const igRef = ref(db, `instagram/${editingInstagram.id}`);
        await update(igRef, {
          link: cleanLink
        });
        showToast('Social link updated!');
        setEditingInstagram(null);
      } else {
        const instagramRef = ref(db, 'instagram');
        const newIgRef = push(instagramRef);
        await set(newIgRef, {
          id: newIgRef.key,
          link: cleanLink
        });
        showToast('Social link added successfully!');
      }

      setInstagramLink('');
    } catch (err) {
      console.error(err);
      showToast('Failed to save Instagram link.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Tab 4: Start Edit Instagram Post
  const startEditInstagram = (post) => {
    setEditingInstagram(post);
    setInstagramLink(post.link);
  };

  // Tab 4: Delete Instagram Post
  const handleDeleteInstagram = async (id) => {
    if (!window.confirm('Delete this Instagram post from your gallery?')) return;

    try {
      await remove(ref(db, `instagram/${id}`));
      showToast('Instagram post removed.');
      if (editingInstagram?.id === id) {
        setEditingInstagram(null);
        setInstagramLink('');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to remove Instagram post.', 'error');
    }
  };

  // File picker handler for blogs
  const handleBlogImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogImage(file);
      setBlogImagePreview(URL.createObjectURL(file));
    }
  };

  // Tab 5: Create or Update Blog Post
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogCategory || !blogSummary.trim() || !blogContent.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!editingBlog && !blogImage) {
      showToast('Please upload a blog header image.', 'error');
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = editingBlog?.image || '';
      let finalPublicId = editingBlog?.publicId || '';

      if (blogImage) {
        showToast('Uploading header image to Cloudinary...', 'success');
        const uploadResult = await uploadToCloudinary(blogImage);
        if (editingBlog?.publicId) {
          showToast('Cleaning up old image...', 'success');
          await deleteFromCloudinary(editingBlog.publicId);
        }
        finalImageUrl = uploadResult.url;
        finalPublicId = uploadResult.publicId;
      }

      const dateStr = editingBlog?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      if (editingBlog) {
        // Update Blog
        const blogRef = ref(db, `blogs/${editingBlog.id}`);
        await update(blogRef, {
          title: blogTitle.trim(),
          category: blogCategory,
          summary: blogSummary.trim(),
          content: blogContent.trim(),
          image: finalImageUrl,
          publicId: finalPublicId,
          readTime: blogReadTime.trim(),
          featured: blogFeatured,
          trending: blogTrending
        });
        showToast('Blog article updated successfully!');
        setEditingBlog(null);
      } else {
        // Create Blog
        const blogsRef = ref(db, 'blogs');
        const newBlogRef = push(blogsRef);
        await set(newBlogRef, {
          id: newBlogRef.key,
          title: blogTitle.trim(),
          category: blogCategory,
          summary: blogSummary.trim(),
          content: blogContent.trim(),
          image: finalImageUrl,
          publicId: finalPublicId,
          date: dateStr,
          readTime: blogReadTime.trim(),
          featured: blogFeatured,
          trending: blogTrending
        });
        showToast('Blog article published successfully!');
      }

      // Reset Form
      setBlogTitle('');
      setBlogCategory('');
      setBlogSummary('');
      setBlogContent('');
      setBlogImage(null);
      setBlogImagePreview('');
      setBlogReadTime('4 min read');
      setBlogFeatured(false);
      setBlogTrending(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to save blog article.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Tab 5: Start Edit Blog
  const startEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogCategory(blog.category);
    setBlogSummary(blog.summary);
    setBlogContent(blog.content);
    setBlogImagePreview(blog.image);
    setBlogReadTime(blog.readTime || '4 min read');
    setBlogFeatured(blog.featured || false);
    setBlogTrending(blog.trending || false);
    setBlogImage(null);
  };

  // Tab 5: Delete Blog Post
  const handleDeleteBlog = async (id, title, publicId) => {
    if (!window.confirm(`Are you sure you want to delete blog post "${title}"?`)) return;

    try {
      if (publicId) {
        showToast('Removing image from Cloudinary...', 'success');
        await deleteFromCloudinary(publicId);
      }
      await remove(ref(db, `blogs/${id}`));
      showToast(`Blog post "${title}" deleted.`);
      
      if (editingBlog?.id === id) {
        setEditingBlog(null);
        setBlogTitle('');
        setBlogCategory('');
        setBlogSummary('');
        setBlogContent('');
        setBlogImagePreview('');
        setBlogImage(null);
        setBlogFeatured(false);
        setBlogTrending(false);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete blog article.', 'error');
    }
  };

  // File picker handler for About Carousel
  const handleAboutImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (editingAbout) {
      if (files[0]) {
        setAboutSingleImage(files[0]);
        setAboutSinglePreview(URL.createObjectURL(files[0]));
      }
    } else {
      if (files.length > 0) {
        setAboutImagesList(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setAboutImagePreviews(previews);
      }
    }
  };

  // Tab 6: Create or Update About Image/Carousel Item
  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    if (editingAbout) {
      if (!aboutSingleImage) {
        showToast('Please select a replacement image.', 'error');
        return;
      }

      setLoading(true);
      try {
        showToast('Uploading new image to Cloudinary...', 'success');
        const uploadResult = await uploadToCloudinary(aboutSingleImage);
        if (editingAbout.publicId) {
          showToast('Cleaning up old image...', 'success');
          await deleteFromCloudinary(editingAbout.publicId);
        }
        const aboutRef = ref(db, `aboutCarousel/${editingAbout.id}`);
        await update(aboutRef, {
          url: uploadResult.url,
          publicId: uploadResult.publicId
        });
        showToast('About image updated successfully!');
        setEditingAbout(null);
        setAboutSingleImage(null);
        setAboutSinglePreview('');
      } catch (err) {
        console.error(err);
        showToast(err.message || 'Failed to update About image.', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      if (aboutImagesList.length === 0) {
        showToast('Please select at least one image.', 'error');
        return;
      }

      setLoading(true);
      try {
        showToast(`Uploading ${aboutImagesList.length} image(s) to Cloudinary...`, 'success');
        for (let i = 0; i < aboutImagesList.length; i++) {
          const file = aboutImagesList[i];
          const uploadResult = await uploadToCloudinary(file);
          const aboutCarouselRef = ref(db, 'aboutCarousel');
          const newItemRef = push(aboutCarouselRef);
          await set(newItemRef, {
            id: newItemRef.key,
            url: uploadResult.url,
            publicId: uploadResult.publicId
          });
        }
        showToast('All images uploaded successfully!');
        setAboutImagesList([]);
        setAboutImagePreviews([]);
      } catch (err) {
        console.error(err);
        showToast(err.message || 'Failed to upload images.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Tab 6: Start Edit About Image
  const startEditAbout = (item) => {
    setEditingAbout(item);
    setAboutSinglePreview(item.url);
    setAboutSingleImage(null);
    setAboutImagesList([]);
    setAboutImagePreviews([]);
  };

  // Tab 6: Delete About Image
  const handleDeleteAbout = async (id, text, publicId) => {
    if (!window.confirm('Are you sure you want to delete this About image?')) return;

    try {
      if (publicId) {
        showToast('Removing image from Cloudinary...', 'success');
        await deleteFromCloudinary(publicId);
      }
      await remove(ref(db, `aboutCarousel/${id}`));
      showToast('About image deleted.');
      
      if (editingAbout?.id === id) {
        setEditingAbout(null);
        setAboutSingleImage(null);
        setAboutSinglePreview('');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete About image.', 'error');
    }
  };

  // Auth Loading Screen
  if (authLoading) {
    return (
      <div className="admin-section">
        <div className="section-fallback-loader">
          <div className="fallback-spinner" />
        </div>
      </div>
    );
  }

  // Not Logged In View
  if (!user) {
    return (
      <div className="admin-section">
        <div className="bg-glow-blob blob-purple" style={{ top: '20%', left: '10%' }} />
        <div className="bg-glow-blob blob-gold" style={{ bottom: '20%', right: '10%' }} />
        
        <div className="admin-container">
          <div className="admin-login-wrapper">
            <div className="glass-card admin-login-card">
              <div className="admin-title-desc">
                <h2>Admin Login</h2>
                <p>Sign in to manage your portfolio site content</p>
              </div>

              {authError && (
                <div style={{
                  color: '#EF4444',
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaExclamationTriangle /> {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-gold clickable" 
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  <FaLock /> Sign In
                </button>
              </form>

              <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                <p style={{ marginBottom: '8px', color: 'var(--color-gold)' }}><strong>How to access:</strong></p>
                <p>1. Open your Firebase Console under <strong>Authentication &gt; Sign-in method</strong>.</p>
                <p style={{ marginTop: '4px' }}>2. Enable the <strong>Email/Password</strong> provider.</p>
                <p style={{ marginTop: '4px' }}>3. Go to the <strong>Users</strong> tab and click <strong>Add user</strong> to configure your admin email and password.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Toast Container */}
        {toast && (
          <div className={`admin-toast ${toast.type}`}>
            {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  // Logged In Dashboard View
  return (
    <div className="admin-section">
      <div className="bg-glow-blob blob-purple" style={{ top: '5%', left: '10%' }} />
      <div className="bg-glow-blob blob-gold" style={{ bottom: '10%', right: '10%' }} />

      <div className="admin-container">
        
        {/* Dashboard Header */}
        <header className="admin-header">
          <div>
            <h1>Admin <span>Dashboard</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Manage portfolio projects, testimonials, social feeds, and blogs
            </p>
          </div>
          <div className="admin-user-info">
            <span className="admin-user-email">{user.email}</span>
            <button className="btn btn-outline btn-sm clickable" onClick={handleSignOut}>
              <FaSignOutAlt /> Log Out
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="admin-tabs-nav">
          <button 
            className={`admin-tab-btn clickable ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <FaFolder /> Categories
          </button>
          <button 
            className={`admin-tab-btn clickable ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <FaImages /> Portfolio Projects
          </button>
          <button 
            className={`admin-tab-btn clickable ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => setActiveTab('testimonials')}
          >
            <FaQuoteLeft /> Testimonials
          </button>
          <button 
            className={`admin-tab-btn clickable ${activeTab === 'instagram' ? 'active' : ''}`}
            onClick={() => setActiveTab('instagram')}
          >
            <FaInstagram /> Social Feed
          </button>
          <button 
            className={`admin-tab-btn clickable ${activeTab === 'blogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            <FaBookOpen /> Manage Blogs
          </button>
          <button 
            className={`admin-tab-btn clickable ${activeTab === 'aboutCarousel' ? 'active' : ''}`}
            onClick={() => setActiveTab('aboutCarousel')}
          >
            <FaImages /> About Carousel
          </button>
        </nav>

        {/* Tab Content Display */}
        <div className="admin-tab-content">
          
          {/* TAB 1: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="admin-grid-layout">
              {/* Form */}
              <div className="glass-card admin-form-card">
                <h3 className="admin-card-title">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                <form onSubmit={handleAddCategorySubmit}>
                  <div className="form-group">
                    <label className="form-label">Category Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. Wedding, Corporate, Celebrity"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-gold btn-sm clickable" disabled={loading}>
                      {loading ? <span className="spinner"></span> : (editingCategory ? 'Update Category' : 'Add Category')}
                    </button>
                    {editingCategory && (
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm clickable" 
                        onClick={() => {
                          setEditingCategory(null);
                          setNewCategoryName('');
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="glass-card admin-list-card">
                <h3 className="admin-card-title">Manage Categories</h3>
                {categories.length === 0 ? (
                  <div className="empty-state">
                    <FaFolder className="empty-state-icon" />
                    <p>No custom categories yet. Local default categories will be used.</p>
                  </div>
                ) : (
                  <div className="admin-items-list">
                    {categories.map((cat) => (
                      <div key={cat.id} className="admin-item-row">
                        <div className="admin-item-info">
                          <FaFolder style={{ color: 'var(--color-gold)', fontSize: '1.2rem', marginRight: '5px' }} />
                          <div className="admin-item-details">
                            <h4>{cat.name}</h4>
                            <p>ID: {cat.id}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn-delete" 
                            style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                            onClick={() => startEditCategory(cat)}
                            title="Edit Category"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            title="Delete Category"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PORTFOLIO PROJECTS */}
          {activeTab === 'portfolio' && (
            <div className="admin-grid-layout">
              {/* Form */}
              <div className="glass-card admin-form-card">
                <h3 className="admin-card-title">{editingProject ? 'Edit Project' : 'Add Project'}</h3>
                <form onSubmit={handleProjectSubmit}>
                  <div className="form-group">
                    <label className="form-label">Project Title *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Enter project title"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      className="form-control"
                      value={projectCategory}
                      onChange={(e) => setProjectCategory(e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                      {categories.length === 0 && (
                        <>
                          <option value="Corporate">Corporate (Default)</option>
                          <option value="Wedding">Wedding (Default)</option>
                          <option value="Celebrity">Celebrity (Default)</option>
                          <option value="Award Shows">Award Shows (Default)</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      placeholder="Short description of this project"
                      value={projectDesc}
                      onChange={(e) => setProjectDesc(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Project Image {editingProject ? '(Choose file to replace)' : '*'}</label>
                    {projectImagePreview ? (
                      <div className="image-upload-preview">
                        <img src={projectImagePreview} alt="Preview" className="preview-img" />
                        <button 
                          type="button" 
                          className="remove-preview-btn clickable"
                          onClick={() => {
                            setProjectImage(null);
                            setProjectImagePreview('');
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <label className="image-upload-preview clickable">
                        <FaCloudUploadAlt className="upload-icon" />
                        <span className="upload-text">Click to choose image file</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          onChange={handleProjectImageChange}
                          required={!editingProject}
                        />
                      </label>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-gold btn-sm clickable" disabled={loading}>
                      {loading ? <span className="spinner"></span> : (editingProject ? 'Update Project' : 'Publish Project')}
                    </button>
                    {editingProject && (
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm clickable" 
                        onClick={() => {
                          setEditingProject(null);
                          setProjectTitle('');
                          setProjectCategory('');
                          setProjectDesc('');
                          setProjectImagePreview('');
                          setProjectImage(null);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="glass-card admin-list-card">
                <h3 className="admin-card-title">Manage Projects ({projects.length})</h3>
                {projects.length === 0 ? (
                  <div className="empty-state">
                    <FaImages className="empty-state-icon" />
                    <p>No custom projects yet. Local default portfolio items are active.</p>
                  </div>
                ) : (
                  <div className="admin-items-list">
                    {projects.map((proj) => (
                      <div key={proj.id} className="admin-item-row">
                        <div className="admin-item-info">
                          <img src={proj.image} alt={proj.title} className="admin-item-thumbnail" />
                          <div className="admin-item-details">
                            <h4>{proj.title}</h4>
                            <p>{proj.category} — {proj.description || 'No description'}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn-delete" 
                            style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                            onClick={() => startEditProject(proj)}
                            title="Edit Project"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeleteProject(proj.id, proj.title, proj.publicId)}
                            title="Delete Project"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CLIENT TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="admin-grid-layout">
              {/* Form */}
              <div className="glass-card admin-form-card">
                <h3 className="admin-card-title">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                <form onSubmit={handleTestimonialSubmit}>
                  <div className="form-group">
                    <label className="form-label">Client Name *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. Ramesh Kumar"
                      value={testimonialName}
                      onChange={(e) => setTestimonialName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Client Feedback (Review) *</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      placeholder="What did the client say about your service?"
                      value={testimonialText}
                      onChange={(e) => setTestimonialText(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rating (1 to 5 Stars)</label>
                    <div className="stars-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar 
                          key={star} 
                          className={`star-icon-btn ${testimonialRating >= star ? 'active' : ''}`}
                          onClick={() => setTestimonialRating(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Client Photo (Optional)</label>
                    {testimonialAvatarPreview ? (
                      <div className="image-upload-preview" style={{ height: '120px', width: '120px', borderRadius: '50%' }}>
                        <img src={testimonialAvatarPreview} alt="Avatar Preview" className="preview-img" />
                        <button 
                          type="button" 
                          className="remove-preview-btn clickable"
                          onClick={() => {
                            setTestimonialAvatar(null);
                            setTestimonialAvatarPreview('');
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <label className="image-upload-preview clickable" style={{ height: '120px', width: '120px', borderRadius: '50%' }}>
                        <FaCloudUploadAlt className="upload-icon" style={{ fontSize: '1.5rem', marginBottom: '5px' }} />
                        <span className="upload-text" style={{ fontSize: '0.7rem' }}>Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          onChange={handleTestimonialAvatarChange}
                        />
                      </label>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-gold btn-sm clickable" disabled={loading}>
                      {loading ? <span className="spinner"></span> : (editingTestimonial ? 'Update Testimonial' : 'Add Testimonial')}
                    </button>
                    {editingTestimonial && (
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm clickable" 
                        onClick={() => {
                          setEditingTestimonial(null);
                          setTestimonialName('');
                          setTestimonialText('');
                          setTestimonialRating(5);
                          setTestimonialAvatarPreview('');
                          setTestimonialAvatar(null);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="glass-card admin-list-card">
                <h3 className="admin-card-title">Manage Testimonials</h3>
                {testimonials.length === 0 ? (
                  <div className="empty-state">
                    <FaQuoteLeft className="empty-state-icon" />
                    <p>No custom testimonials yet. Local default testimonials will be displayed.</p>
                  </div>
                ) : (
                  <div className="admin-items-list">
                    {testimonials.map((test) => (
                      <div key={test.id} className="admin-item-row">
                        <div className="admin-item-info">
                          <img src={test.avatar} alt={test.name} className="admin-item-thumbnail" style={{ borderRadius: '50%' }} />
                          <div className="admin-item-details">
                            <h4>{test.name}</h4>
                            <p>"{test.review}"</p>
                            <div className="rating-stars">
                              {[...Array(test.rating)].map((_, idx) => (
                                <FaStar key={idx} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn-delete" 
                            style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                            onClick={() => startEditTestimonial(test)}
                            title="Edit Testimonial"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeleteTestimonial(test.id, test.name, test.publicId)}
                            title="Delete Testimonial"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SOCIAL FEED GALLERY */}
          {activeTab === 'instagram' && (
            <div className="admin-grid-layout">
              {/* Form */}
              <div className="glass-card admin-form-card">
                <h3 className="admin-card-title">{editingInstagram ? 'Edit Social Link' : 'Add Social Link'}</h3>
                <form onSubmit={handleInstagramSubmit}>
                  <div className="form-group">
                    <label className="form-label">Social Link (Instagram, LinkedIn, Facebook)</label>
                    <input 
                      type="url" 
                      className="form-control"
                      placeholder="e.g. Instagram reel, LinkedIn update, or Facebook post"
                      value={instagramLink}
                      onChange={(e) => setInstagramLink(e.target.value)}
                      required 
                    />
                    <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '6px', fontSize: '0.75rem' }}>
                      Just paste the URL of your Instagram post/reel, LinkedIn update post, or Facebook post/video. We will automatically format and embed it in the feed.
                    </small>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-gold btn-sm clickable" disabled={loading}>
                      {loading ? <span className="spinner"></span> : (editingInstagram ? 'Update Link' : 'Add Link')}
                    </button>
                    {editingInstagram && (
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm clickable" 
                        onClick={() => {
                          setEditingInstagram(null);
                          setInstagramLink('');
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="glass-card admin-list-card">
                <h3 className="admin-card-title">Manage Social Feed</h3>
                {instagramPosts.length === 0 ? (
                  <div className="empty-state">
                    <FaInstagram className="empty-state-icon" />
                    <p>No custom posts yet. Default social gallery cards will be displayed.</p>
                  </div>
                ) : (
                  <div className="admin-items-list">
                    {instagramPosts.map((post) => {
                      const isLI = post.link.includes('linkedin.com');
                      const isFB = post.link.includes('facebook.com') || post.link.includes('fb.watch');
                      return (
                        <div key={post.id} className="admin-item-row">
                          <div className="admin-item-info">
                            {isLI ? (
                              <FaLinkedin style={{ color: '#0A66C2', fontSize: '1.5rem', marginRight: '10px' }} />
                            ) : isFB ? (
                              <FaFacebook style={{ color: '#1877F2', fontSize: '1.5rem', marginRight: '10px' }} />
                            ) : (
                              <FaInstagram style={{ color: 'var(--color-gold)', fontSize: '1.5rem', marginRight: '10px' }} />
                            )}
                            <div className="admin-item-details">
                              <h4 style={{ fontSize: '0.9rem' }}>Post ID: {post.id}</h4>
                              <p style={{ fontSize: '0.75rem' }}>
                                <a href={post.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)' }}>
                                  {post.link}
                                </a>
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn-delete" 
                              style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                              onClick={() => startEditInstagram(post)}
                              title="Edit Social Link"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="btn-delete" 
                              onClick={() => handleDeleteInstagram(post.id)}
                              title="Delete Social Link"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: MANAGE BLOGS */}
          {activeTab === 'blogs' && (
            <div className="admin-grid-layout">
              {/* Form */}
              <div className="glass-card admin-form-card">
                <h3 className="admin-card-title">{editingBlog ? 'Edit Blog Post' : 'Add Blog Post'}</h3>
                <form onSubmit={handleBlogSubmit}>
                  <div className="form-group">
                    <label className="form-label">Blog Title *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. Preparing for a Big Event"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      className="form-control"
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Events">Events</option>
                      <option value="Anchoring Tips">Anchoring Tips</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Travel">Travel</option>
                      <option value="Behind The Scenes">Behind The Scenes</option>
                      <option value="Media">Media</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Read Time</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. 4 min read"
                      value={blogReadTime}
                      onChange={(e) => setBlogReadTime(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ display: 'flex', gap: '20px', margin: '15px 0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'var(--font-alt)', fontSize: '0.85rem' }}>
                      <input 
                        type="checkbox" 
                        checked={blogFeatured} 
                        onChange={(e) => setBlogFeatured(e.target.checked)} 
                      />
                      Featured Story (Large primary slot)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'var(--font-alt)', fontSize: '0.85rem' }}>
                      <input 
                        type="checkbox" 
                        checked={blogTrending} 
                        onChange={(e) => setBlogTrending(e.target.checked)} 
                      />
                      Trending (Sidebar slot)
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Summary *</label>
                    <textarea 
                      className="form-control" 
                      rows="2" 
                      placeholder="Brief excerpt shown on card feeds"
                      value={blogSummary}
                      onChange={(e) => setBlogSummary(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Article Content *</label>
                    <textarea 
                      className="form-control" 
                      rows="6" 
                      placeholder="Write your complete blog post article here..."
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Header Image {editingBlog ? '(Choose file to replace)' : '*'}</label>
                    {blogImagePreview ? (
                      <div className="image-upload-preview" style={{ height: '140px' }}>
                        <img src={blogImagePreview} alt="Preview" className="preview-img" />
                        <button 
                          type="button" 
                          className="remove-preview-btn clickable"
                          onClick={() => {
                            setBlogImage(null);
                            setBlogImagePreview('');
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <label className="image-upload-preview clickable" style={{ height: '140px' }}>
                        <FaCloudUploadAlt className="upload-icon" />
                        <span className="upload-text">Click to choose image file</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          onChange={handleBlogImageChange}
                          required={!editingBlog}
                        />
                      </label>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-gold btn-sm clickable" disabled={loading}>
                      {loading ? <span className="spinner"></span> : (editingBlog ? 'Update Blog' : 'Publish Blog')}
                    </button>
                    {editingBlog && (
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm clickable" 
                        onClick={() => {
                          setEditingBlog(null);
                          setBlogTitle('');
                          setBlogCategory('');
                          setBlogSummary('');
                          setBlogContent('');
                          setBlogImagePreview('');
                          setBlogImage(null);
                          setBlogReadTime('4 min read');
                          setBlogFeatured(false);
                          setBlogTrending(false);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="glass-card admin-list-card">
                <h3 className="admin-card-title">Manage Articles ({blogs.length})</h3>
                {blogs.length === 0 ? (
                  <div className="empty-state">
                    <FaBookOpen className="empty-state-icon" />
                    <p>No custom articles yet. Local default blog articles are active.</p>
                  </div>
                ) : (
                  <div className="admin-items-list">
                    {blogs.map((blog) => (
                      <div key={blog.id} className="admin-item-row">
                        <div className="admin-item-info">
                          <img src={blog.image} alt={blog.title} className="admin-item-thumbnail" />
                          <div className="admin-item-details">
                            <h4>{blog.title}</h4>
                            <p>
                              {blog.category} &bull; {blog.date} 
                              {blog.featured && <strong style={{ color: 'var(--color-gold)', marginLeft: '8px' }}>[Featured]</strong>}
                              {blog.trending && <strong style={{ color: 'var(--color-gold)', marginLeft: '8px' }}>[Trending]</strong>}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn-delete" 
                            style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                            onClick={() => startEditBlog(blog)}
                            title="Edit Blog"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeleteBlog(blog.id, blog.title, blog.publicId)}
                            title="Delete Blog"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ABOUT CAROUSEL */}
          {activeTab === 'aboutCarousel' && (
            <div className="admin-grid-layout">
              {/* Form */}
              <div className="glass-card admin-form-card">
                <h3 className="admin-card-title">
                  {editingAbout ? 'Edit About Image' : 'Upload About Images'}
                </h3>
                <form onSubmit={handleAboutSubmit}>
                  {editingAbout ? (
                    // Edit Mode: Single image replace
                    <div className="form-group">
                      <label className="form-label">Replacement Image *</label>
                      {aboutSinglePreview ? (
                        <div className="image-upload-preview">
                          <img src={aboutSinglePreview} alt="Preview" className="preview-img" />
                          <button 
                            type="button" 
                            className="remove-preview-btn clickable"
                            onClick={() => {
                              setAboutSingleImage(null);
                              setAboutSinglePreview('');
                            }}
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        <label className="image-upload-preview clickable">
                          <FaCloudUploadAlt className="upload-icon" />
                          <span className="upload-text">Click to choose image file</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={handleAboutImageChange}
                            required
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    // Add Mode: Multiple images upload
                    <div className="form-group">
                      <label className="form-label">Select Images * (Multiple allowed)</label>
                      {aboutImagePreviews.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                            {aboutImagePreviews.map((url, index) => (
                              <div key={index} className="image-upload-preview" style={{ height: '80px', width: '80px', margin: 0 }}>
                                <img src={url} alt={`Preview ${index + 1}`} className="preview-img" />
                              </div>
                            ))}
                          </div>
                          <button 
                            type="button" 
                            className="btn btn-outline btn-xs clickable"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', alignSelf: 'flex-start' }}
                            onClick={() => {
                              setAboutImagesList([]);
                              setAboutImagePreviews([]);
                            }}
                          >
                            Clear Selection
                          </button>
                        </div>
                      ) : (
                        <label className="image-upload-preview clickable">
                          <FaCloudUploadAlt className="upload-icon" />
                          <span className="upload-text">Click to choose files (hold Ctrl to select multiple)</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple
                            style={{ display: 'none' }} 
                            onChange={handleAboutImageChange}
                            required
                          />
                        </label>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-gold btn-sm clickable" disabled={loading}>
                      {loading ? <span className="spinner"></span> : (editingAbout ? 'Update Image' : 'Upload Images')}
                    </button>
                    {editingAbout && (
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm clickable" 
                        onClick={() => {
                          setEditingAbout(null);
                          setAboutSingleImage(null);
                          setAboutSinglePreview('');
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="glass-card admin-list-card">
                <h3 className="admin-card-title">Manage About Images ({aboutCarousel.length})</h3>
                {aboutCarousel.length === 0 ? (
                  <div className="empty-state">
                    <FaImages className="empty-state-icon" />
                    <p>No custom About images yet. Local default images are active.</p>
                  </div>
                ) : (
                  <div className="admin-items-list">
                    {aboutCarousel.map((item, index) => (
                      <div key={item.id} className="admin-item-row">
                        <div className="admin-item-info">
                          <img src={item.url} alt={`About slide ${index + 1}`} className="admin-item-thumbnail" />
                          <div className="admin-item-details">
                            <h4>Image #{index + 1}</h4>
                            <p style={{ wordBreak: 'break-all', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.url}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn-delete" 
                            style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                            onClick={() => startEditAbout(item)}
                            title="Edit Item"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeleteAbout(item.id, '', item.publicId)}
                            title="Delete Item"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Toast Alert Toast Container */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
