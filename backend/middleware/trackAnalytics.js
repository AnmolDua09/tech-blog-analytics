const Analytics = require('../models/Analytics');

const trackAnalytics = async (req, res, next) => {
  // Move to the route immediately to keep the API fast
  next();

  try {
    // 🛡️ Use the EXACT column names from your 'analytics_db'
    await Analytics.create({
      post_slug: req.params.slug || 'home_feed', // Matches your 'post_slug' column
      ip_address: req.ip || '127.0.0.1',         // Matches your 'ip_address' column
      device_type: req.get('User-Agent') || 'Web', // Matches your 'device_type' column
      // 'timestamp' is usually handled automatically by Sequelize (createdAt)
    });

    console.log("📊 Analytics row inserted successfully.");
  } catch (err) {
    // This catches the "column does not exist" error
    console.error('❌ Analytics Write Failed:', err.message);
  }
};

module.exports = trackAnalytics;