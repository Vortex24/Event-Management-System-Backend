const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('User already exists');

    // Create a new user, password will be hashed automatically by the middleware
    const user = new User({ name, email, password, role });
    await user.save();

    // Exclude password before returning the response
    const { password: _, ...userDataWithoutPassword } = user.toObject();
    return userDataWithoutPassword;
};

// Authenticate user and generate token
const authenticateUser = async (email, password) => {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        console.error("User not found with email:", email);
        throw new Error('Invalid credentials');
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        // { expiresIn: '1h' }                     // commented for no expiration for token for simplicity to test
    );

    // Exclude password before returning user data
    const { password: _, ...userDataWithoutPassword } = user.toObject();
    return { user: userDataWithoutPassword, token };
};

module.exports = { registerUser, authenticateUser };
