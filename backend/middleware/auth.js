const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Protects routes by verifying the JWT Bearer Token
 */
const auth = (req, res, next) => {
  // 🛡️ CRITICAL GUARD: Ensure Express passed the 'next' callback
  if (typeof next !== 'function') {
    console.error("❌ Middleware Error: 'next' is not a function. Ensure you passed 'auth' and didn't call 'auth()' in your routes.");
    return res.status(500).json({ error: "Internal Middleware Configuration Error" });
  }

  // 1. Get the Authorization Header
  const authHeader = req.header('Authorization');

  // 2. Check for "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // 3. Extract the actual token string
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify Token
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret);

    // 5. Attach user data to request object
    // We check if decoded.user exists, otherwise we use the whole decoded object
    req.user = decoded.user || decoded;

    // 6. Proceed to the next middleware/route handler
    next();

  } catch (err) {
    console.error("⚠️ JWT Verification Failed:", err.message);
    return res.status(401).json({
      error: 'Token is not valid',
      details: err.message
    });
  }
};

module.exports = auth;