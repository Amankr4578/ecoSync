import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Please provide your name' });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Please provide your email address' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Please provide a password' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: 'An account with this email already exists. Try signing in instead.' });
        }

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                ecoPoints: user.ecoPoints,
                totalRecycled: user.totalRecycled,
                carbonOffset: user.carbonOffset,
                level: user.level,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Unable to create account. Please try again.' });
        }
    } catch (error) {
        console.error('Register error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages[0] });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Please enter your email address' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Please enter your password' });
        }

        // Check for user email
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'No account found with this email. Check your email or create a new account.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: user.location,
            avatar: user.avatar,
            ecoPoints: user.ecoPoints,
            totalRecycled: user.totalRecycled,
            carbonOffset: user.carbonOffset,
            level: user.level,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: user.location,
            avatar: user.avatar,
            ecoPoints: user.ecoPoints,
            totalRecycled: user.totalRecycled,
            carbonOffset: user.carbonOffset,
            level: user.level,
            role: user.role
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.location = req.body.location || user.location;
            
            if (req.body.avatar) {
                user.avatar = req.body.avatar;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                location: updatedUser.location,
                avatar: updatedUser.avatar,
                ecoPoints: updatedUser.ecoPoints,
                totalRecycled: updatedUser.totalRecycled,
                carbonOffset: updatedUser.carbonOffset,
                level: updatedUser.level,
                role: updatedUser.role,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

export default router;
