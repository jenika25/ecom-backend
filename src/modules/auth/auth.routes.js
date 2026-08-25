
const express = require('express');
const { register, login, refresh, logout, context, changePassword } = require('./auth.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/context', protect, context);
router.patch('/change-password', protect, changePassword);

module.exports = router;
