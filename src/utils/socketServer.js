const socketIO = require('socket.io');

const setupSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            // origin: 'http://localhost:3000', // Allow connections only from your frontend
            origin: '*',     // allowing for simplicity
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true,  // If you need to support cookies or authentication headers
        }
    });

    io.on('connection', (socket) => {
        // console.log('A user connected.');

        socket.on('disconnect', () => {
            // console.log('A user disconnected.');
        });
    });

    return io;
};

module.exports = setupSocket;
