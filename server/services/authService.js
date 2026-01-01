const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/errors');

const signup = async (userData) => {
    const { username, email, password, phone, license, cnic } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        phone,
        license,
        cnic,
        role: 'user' // default role
    });

    const token = generateToken(user._id, user.role);

    const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        license: user.license,
        cnic: user.cnic
    };

    return { user: userResponse, token };
};

const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError('Invalid credentials', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid credentials', 400);
    }

    const token = generateToken(user._id, user.role);

    const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        license: user.license,
        cnic: user.cnic
    };

    return { user: userResponse, token };
};

module.exports = { signup, login };
