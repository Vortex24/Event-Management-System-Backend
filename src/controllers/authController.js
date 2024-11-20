const { registerUser, authenticateUser } = require('../services/authService');

// Register Controller
const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Login Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authenticateUser(email, password);
        res.status(200).json({ success: true, data: { user, token } });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

module.exports = { register, login };
