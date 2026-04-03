const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// 🛡️ Standardized Middleware Imports
// We use 'trackAnalytics' as the single source of truth for PostgreSQL logging
const trackAnalytics = require('../middleware/trackAnalytics');
const auth = require('../middleware/auth');
console.log('DEBUG: auth is a', typeof auth);
console.log('DEBUG: trackAnalytics is a', typeof trackAnalytics);

// 🔍 Console Logs to verify the "Wiring" on server start
console.log('--- Route Middleware Check ---');
console.log('auth middleware loaded:', typeof auth === 'function' ? '✅' : '❌');
console.log('trackAnalytics middleware loaded:', typeof trackAnalytics === 'function' ? '✅' : '❌');
console.log('------------------------------');

/**
 * @route   GET /api/posts
 * @desc    Get all posts and track the "Feed View"
 */
router.get('/', trackAnalytics, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Fetch Posts Error:", error);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
});

/**
 * @route   GET /api/posts/:slug
 * @desc    Get single post and track "Post View" via slug
 */
router.get('/:slug', trackAnalytics, async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const comments = await Comment.find({ post_id: post._id }).sort({ createdAt: -1 });
    res.json({ post, comments });
  } catch (error) {
    console.error("Fetch Single Post Error:", error);
    res.status(500).json({ error: 'Server error fetching post' });
  }
});

/**
 * @route   POST /api/posts
 * @desc    Create a new blog post (Protected by JWT Auth)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, slug, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and Content are required.' });
    }

    // Auto-generate SEO-friendly slug if not provided
    const postSlug = slug || title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newPost = new Post({
      title,
      slug: postSlug,
      content,
      tags,
      authorId: req.user?.id // Data extracted from JWT in auth middleware
    });

    await newPost.save();
    res.status(201).json(newPost);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A post with this slug already exists.' });
    }
    console.error("Create Post Error:", error);
    res.status(500).json({ error: 'Server error creating post', details: error.message });
  }
});

/**
 * @route   DELETE /api/posts/:id
 * @desc    Remove a post (Protected)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await post.deleteOne();
    res.json({ message: 'Post successfully removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting post' });
  }
});

module.exports = router;