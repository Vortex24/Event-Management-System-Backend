const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Register Endpoint
router.post('/register', register);

// Login Endpoint
router.post('/login', login);

module.exports = router;
