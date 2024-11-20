const express = require('express');
const { handleCreateEvent, handleListEvents, handleDeleteEvent } = require('../controllers/eventController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

const router = express.Router();

// List Events (All users)
router.get('/', verifyToken, handleListEvents);

// Create Event (Admin only)
router.post('/', verifyToken, allowRoles('admin'), handleCreateEvent);

// Delete Event (Admin only)
router.delete('/:id', verifyToken, allowRoles('admin'), handleDeleteEvent);

module.exports = router;
