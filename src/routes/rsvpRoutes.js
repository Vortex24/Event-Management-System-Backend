const express = require('express');
const { handleRSVP, getUserRSVPsController } = require('../controllers/rsvpController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// RSVP to Event
router.post('/:id/rsvp', verifyToken, handleRSVP);

// Route to get RSVPs for a user filtered by status
router.get('/user-rsvps', verifyToken, getUserRSVPsController);

module.exports = router;
