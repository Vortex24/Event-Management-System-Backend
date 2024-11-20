const RSVP = require('../models/rsvp');

const rsvpToEvent = async (userId, eventId, status) => {
    return await RSVP.findOneAndUpdate(
        { user: userId, event: eventId },
        { status },
        { upsert: true, new: true }
    );
};

module.exports = { rsvpToEvent };
