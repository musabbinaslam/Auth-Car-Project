const User = require('../models/User');
const AppError = require('../utils/errors');

const getAllUsers = async () => {
    return await User.find().select('-password');
};

const getUserById = async (id) => {
    const user = await User.findById(id).select('-password');
    if (!user) throw new AppError('User not found', 404);
    return user;
};

const updateUser = async (id, data) => {
    // Prevent password update through this route
    delete data.password;
    delete data.role; // Prevent role update through this route

    const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
    if (!user) {
        throw new AppError('User not found', 404);
    }
    return user;
};

const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    return user;
};

module.exports = { getAllUsers, deleteUser, updateUser, getUserById };
