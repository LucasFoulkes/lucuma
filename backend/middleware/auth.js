const jwt = require('jsonwebtoken');

/**
 * Authentication middleware that checks for valid JWT in cookies or Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */

const authenticate = (req, res, next) => {
    try {
        // Check for token in cookies or Authorization header
        let token = req.cookies.token;

        // If no token in cookies, check Authorization header
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        try {
            // Verify token using your JWT_SECRET from .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = { authenticate };
