const Event = require('../models/event');

const createEvent = async (eventData) => {
    const event = new Event(eventData);
    return await event.save();
};

const listEvents = async () => {
    return await Event.find();
};

const deleteEvent = async (eventId) => {
    return await Event.findByIdAndDelete(eventId);
};

module.exports = { createEvent, listEvents, deleteEvent };
