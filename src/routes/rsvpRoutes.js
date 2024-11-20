const express = require('express');
const { handleRSVP } = require('../controllers/rsvpController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// RSVP to Event
router.post('/:id/rsvp', verifyToken, handleRSVP);

module.exports = router;
