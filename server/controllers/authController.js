const authService = require('../services/authService');
const userService = require('../services/userService');

const signup = async (req, res, next) => {
    try {
        const { user, token } = await authService.signup(req.body);
        res.status(201).json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        res.status(200).json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.userId);
        res.status(200).json({ status: 'success', data: { user } });
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.user.userId, req.body);
        res.status(200).json({ status: 'success', data: { user } });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signup,
    login,
    getProfile,
    updateProfile
};
