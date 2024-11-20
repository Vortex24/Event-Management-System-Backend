const RSVP = require('../models/rsvp');
const Event = require('../models/event');
const User = require('../models/user');

const rsvpToEvent = async (userId, eventId, status, io) => {
    try {
        // Find the existing RSVP for this user and event
        const existingRSVP = await RSVP.findOne({ user: userId, event: eventId });

        // Fetch the user details (to get the name)
        const user = await User.findById(userId); // Assuming there is a User model
        const userName = user ? user.name : "Unknown User"; // Get the user's name, default to "Unknown User" if not found

        // Find the event details (to include in the notification)
        const event = await Event.findById(eventId); // Assuming Event is the event model
        const eventCreatorId = event.createdBy.toString(); // Assuming there's a field `creatorId` that holds the event owner's user ID

        // Case 1: User already has an RSVP
        if (existingRSVP) {
            const previousStatus = existingRSVP.status;

            // If status is changing from "interested" to something else, decrement the count for "interested"
            if (previousStatus === 'interested' && status !== 'interested') {
                // Decrease the "interested" count for this event
                await RSVP.updateOne(
                    { _id: existingRSVP._id },
                    { $set: { status } }  // Update the status to the new status
                );
            }
            // If status is changing to "interested" from any other status, increment the "interested" count
            else if (status === 'interested' && previousStatus !== 'interested') {
                // Update the status to "interested"
                await RSVP.updateOne(
                    { _id: existingRSVP._id },
                    { $set: { status } }
                );

                // Emit notification to the event creator (owner)
                io.emit('rsvpNotification', {
                    userName, // The name of the user
                    eventId, // The ID of the event
                    message: `${userName} is interested in your event "${event.title}".`,
                    eventDetails: event, // Event details to send with the notification
                    recipientId: eventCreatorId, // The event creator (recipient of the notification)
                });
            }
            // If status is changing from "maybe" to "ignore" or vice versa
            else if (
                (previousStatus === 'maybe' && status === 'ignore') ||
                (previousStatus === 'ignore' && status === 'maybe')
            ) {
                // Just update the status without affecting "interested" count
                await RSVP.updateOne(
                    { _id: existingRSVP._id },
                    { $set: { status } } // Update status to either "maybe" or "ignore"
                );
            }
            // If status is changing to the same status (no change), no need to update the count
            else if (previousStatus === status) {
                return { success: true, message: 'RSVP status is already set to this value.' };
            }

        } else {
            // Case 2: No existing RSVP, create a new one
            await RSVP.create({ user: userId, event: eventId, status });

            // If the new status is "interested", increase the count
            if (status === 'interested') {
                await RSVP.updateOne(
                    { user: userId, event: eventId },
                    { $set: { status: 'interested' } }
                );

                // Emit notification to the event creator (owner)
                io.emit('rsvpNotification', {
                    userName, // The name of the user
                    eventId, // The ID of the event
                    message: `${userName} is interested in your event "${event.title}".`,
                    eventDetails: event, // Event details to send with the notification
                    recipientId: eventCreatorId, // The event creator (recipient of the notification)
                });
            }
        }

        // Get the new interested count after the status change
        const interestedCount = await RSVP.countDocuments({
            event: eventId,
            status: 'interested',
        });

        // Emit updated "interestedCount" to all clients
        io.emit('updateInterestedCount', {
            eventId,
            interestedCount,  // Send the updated count
        });

        return { success: true, message: 'RSVP updated successfully' };

    } catch (error) {
        console.error('Error in RSVP service:', error);
        throw new Error('Error updating RSVP');
    }
};


// Service to get RSVPs filtered by status
const getUserRSVPs = async (userId, status) => {
    try {
        // Build the filter object based on the status
        const filter = status === 'all' ? {} : { status };

        // Find RSVPs for the user and populate the event data
        const rsvps = await RSVP.find({ user: userId, ...filter })
            .populate('event', 'title location dateTime'); // Populate event details

        return rsvps;
    } catch (error) {
        console.error('Error in RSVP service:', error);
        throw new Error('Error fetching RSVPs');
    }
};

module.exports = { rsvpToEvent, getUserRSVPs };
