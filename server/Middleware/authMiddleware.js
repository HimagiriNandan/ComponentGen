import jwt from "jsonwebtoken";
import User from '../Model/userSchema.js';

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Fallback to cookie
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        message: "Invalid token. User not found."
      });
    }

    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};

export default authMiddleware;