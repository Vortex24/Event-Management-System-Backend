const { rsvpToEvent } = require('../services/rsvpService');

// RSVP Controller
const handleRSVP = async (req, res) => {
    try {
        const rsvp = await rsvpToEvent(req.user._id, req.params.id, req.body.status);
        res.status(200).json({ success: true, data: rsvp });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { handleRSVP };
