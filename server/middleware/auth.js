// server/middleware/auth.js

const jwt = require('jsonwebtoken'); // For verifying JWTs
require('dotenv').config(); // Load environment variables

/**
 * Middleware to protect routes.
 * It verifies the JWT from the request header and attaches the user ID to the request object.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 * @param {function} next The Express next middleware function.
 */
const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token'); // Common header name for tokens

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user from token payload to the request object
    // This allows subsequent route handlers to access req.user.id
    req.user = decoded; // The payload of our JWT is { id: user.id }
    next(); // Move to the next middleware/route handler
  } catch (error) {
    // Token is not valid (e.g., expired, malformed)
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
