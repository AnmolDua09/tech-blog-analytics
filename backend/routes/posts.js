const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// 🛡️ Middleware Imports
const trackAnalytics = require('../middleware/trackAnalytics');
const auth = require('../middleware/auth');

// 🔍 DEBUG LOGS: Run 'npm start' and check these in your terminal!
console.log('--- Middleware Verification ---');
console.log('trackAnalytics type:', typeof trackAnalytics); // Should be 'function'
console.log('auth type:', typeof auth);                       // Should be 'function'
console.log('-------------------------------');

/**
 * @route   GET /api/posts
 * @desc    Get all posts (added trackAnalytics here to log feed views)
 */
router.get('/', trackAnalytics, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching posts' });
  }
});

/**
 * @route   GET /api/posts/:slug
 */
router.get('/:slug', trackAnalytics, async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comments = await Comment.find({ post_id: post._id }).sort({ createdAt: -1 });
    res.json({ post, comments });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching post' });
  }
});

/**
 * @route   POST /api/posts
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, slug, content, tags } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and Content are required.' });

    const postSlug = slug || title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

    const newPost = new Post({
      title,
      slug: postSlug,
      content,
      tags,
      authorId: req.user?.id // Added optional chaining for safety
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Slug must be unique.' });
    res.status(500).json({ error: 'Server error creating post', details: error.message });
  }
});

module.exports = router;