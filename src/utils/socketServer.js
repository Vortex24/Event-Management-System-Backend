const socketIO = require('socket.io');

const setupSocket = (server) => {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('A user connected.');

        socket.on('disconnect', () => {
            console.log('A user disconnected.');
        });
    });

    return io;
};

module.exports = setupSocket;
