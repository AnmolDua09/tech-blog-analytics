const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');

// Asynchronous fire-and-forget endpoint -> "Tracking API"
router.post('/track', (req, res) => {
  res.status(202).send('Accepted');

  const { post_slug, path } = req.body; // Fallback to path if post_slug not provided
  const targetSlug = post_slug || path || 'unknown';
  const device_type = req.headers['user-agent'] || 'Unknown';
  const ip_address = req.ip || 'Unknown';
  
  if (targetSlug) {
    Analytics.create({ post_slug: targetSlug, device_type, ip_address })
      .catch(err => {
        console.error('Error logging page visit:', err.message);
      });
  }
});

// Get analytics stats for Dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const { sequelize } = require('../config/db');
    
    // Group by Post Slug
    const popularPages = await Analytics.findAll({
      attributes: ['post_slug', [sequelize.fn('COUNT', sequelize.col('id')), 'views']],
      group: ['post_slug'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10
    });

    // Group by Day (Simplified)
    const viewsOverTime = await sequelize.query(`
      SELECT DATE("timestamp") as date, COUNT(id) as views 
      FROM analytics 
      GROUP BY DATE("timestamp") 
      ORDER BY date ASC
    `, { type: sequelize.QueryTypes.SELECT });

    const totalViews = await Analytics.count();

    res.json({
      totalViews,
      popularPages,
      viewsOverTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching analytics stats' });
  }
});

module.exports = router;
