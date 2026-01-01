const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/constants');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
