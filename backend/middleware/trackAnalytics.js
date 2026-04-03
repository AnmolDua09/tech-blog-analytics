const Analytics = require('../models/Analytics');

const trackAnalytics = async (req, res, next) => {
  next(); // Keep the API fast

  try {
    await Analytics.create({
      // Ensure these keys match the model exactly!
      post_slug: req.params.slug || 'home_feed',
      ip_address: req.ip || '127.0.0.1',
      device_type: req.get('User-Agent') || 'Unknown'
    });
    console.log("✅ Analytics: View recorded in PostgreSQL");
  } catch (err) {
    console.error('❌ Analytics Write Failed:', err.message);
  }
};

module.exports = trackAnalytics;