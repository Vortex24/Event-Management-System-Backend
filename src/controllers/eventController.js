const { createEvent, listEvents, deleteEvent, fetchEventsWithRSVP } = require('../services/eventService');

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

const getEventsWithRSVP = async (req, res) => {
    try {
        const userId = req.user.id; // Assume user ID is extracted via middleware
        const eventsWithRSVP = await fetchEventsWithRSVP(userId);
        res.status(200).json({ success: true, data: eventsWithRSVP });
    } catch (error) {
        console.error('Error in getEventsWithRSVP:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching events' });
    }
};

module.exports = { handleCreateEvent, handleListEvents, handleDeleteEvent, getEventsWithRSVP };
