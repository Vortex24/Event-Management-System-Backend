const { rsvpToEvent, getUserRSVPs } = require('../services/rsvpService');

// RSVP Controller
const handleRSVP = async (req, res) => {
    try {
        const rsvp = await rsvpToEvent(req.user._id, req.params.id, req.body.status, req.io);
        res.status(200).json({ success: true, data: rsvp });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Controller to get RSVPs for a user filtered by status
const getUserRSVPsController = async (req, res) => {
    try {
        const { status } = req.query; // Get status filter from query params
        const rsvps = await getUserRSVPs(req.user._id, status); // Call the service with userId and status filter

        res.status(200).json({ success: true, data: rsvps });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { handleRSVP, getUserRSVPsController };
