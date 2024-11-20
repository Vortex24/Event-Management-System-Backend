const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');
const setupSocket = require('./utils/socketServer');
const http = require('http');

dotenv.config();
const app = express();
const server = http.createServer(app); // Create server instance

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

// Setup Socket.IO with the server instance
const io = setupSocket(server);

// Middleware to add `io` to `req`
app.use((req, res, next) => {
    req.io = io; // Attach the io instance to every request
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send('Event Management System API');
});

app.use("/api/auth", authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rsvp', rsvpRoutes);

// Create HTTP server and start listening
// Start the server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
