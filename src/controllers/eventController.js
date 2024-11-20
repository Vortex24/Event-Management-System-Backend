const { createEvent, listEvents, deleteEvent } = require('../services/eventService');

// Create Event
const handleCreateEvent = async (req, res) => {
    try {
        const event = await createEvent({ ...req.body, createdBy: req.user._id });
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// List Events
const handleListEvents = async (req, res) => {
    try {
        const events = await listEvents();
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete Event
const handleDeleteEvent = async (req, res) => {
    try {
        await deleteEvent(req.params.id);
        res.status(200).json({ success: true, message: 'Event deleted successfully.' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { handleCreateEvent, handleListEvents, handleDeleteEvent };
