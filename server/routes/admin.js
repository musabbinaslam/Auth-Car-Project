const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();


router.use(authenticateToken, isAdmin);

router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
