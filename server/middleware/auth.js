const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/errors');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new AppError('Access denied. No token provided.', 401));
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return next(new AppError('Invalid token', 403));
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return next(new AppError('Access denied. Admin only.', 403));
    }
};

module.exports = { authenticateToken, isAdmin };
