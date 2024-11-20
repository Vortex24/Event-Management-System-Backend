const Event = require('../models/event');
const RSVP = require('../models/rsvp');

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

const fetchEventsWithRSVP = async (userId) => {
    try {
        // Fetch all events
        const events = await Event.find();

        // Fetch RSVP statuses for the logged-in user
        const rsvpStatuses = await RSVP.find({ user: userId }).lean();

        // Create a map of event IDs to RSVP statuses
        const rsvpMap = rsvpStatuses.reduce((map, rsvp) => {
            map[rsvp.event.toString()] = rsvp.status; // Ensure event ID is a string for matching
            return map;
        }, {});

        // Calculate interestedCount for each event
        const interestedCounts = await RSVP.aggregate([
            { $match: { status: 'interested' } },
            { $group: { _id: '$event', count: { $sum: 1 } } }, // Group by event and count the "interested"
        ]);

        // Create a map of event IDs to interested counts
        const interestedCountMap = interestedCounts.reduce((map, item) => {
            map[item._id.toString()] = item.count; // Map event ID to its interested count
            return map;
        }, {});

        // Attach RSVP status and interested count to each event
        return events.map((event) => ({
            ...event.toObject(),
            userRSVP: rsvpMap[event._id.toString()] || null, // Default to null if no RSVP
            interestedCount: interestedCountMap[event._id.toString()] || 0, // Default to 0 if no "interested" RSVPs
        }));
    } catch (error) {
        console.error("Detailed Error in fetchEventsWithRSVP:", error.message);
        throw new Error('Error fetching events with RSVP');
    }
};


module.exports = { createEvent, listEvents, deleteEvent, fetchEventsWithRSVP };
