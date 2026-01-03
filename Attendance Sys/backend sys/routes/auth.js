const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
// @desc    Get all teachers
// @route   GET /api/auth/teachers
// @access  Private (Admin only ideally, but keeping simple for now)
router.get('/teachers', protect, async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' });
        res.status(200).json({
            success: true,
            data: teachers
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { name, uid, password, role, phone, department } = req.body;

        // Create user
        const user = await User.create({
            name,
            uid,
            password,
            role,
            phone,
            department
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(400).json({ success: false, error: `User with this ${field} already exists` });
        }
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Update user details
// @route   PUT /api/auth/update
// @access  Private
router.put('/update', protect, async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            phone: req.body.phone,
            department: req.body.department
        };

        console.log('Update Request Body:', req.body);
        console.log('Fields to Update:', fieldsToUpdate);

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        console.log('Updated User Result:', user);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { uid, password } = req.body;

        // Validate email & password
        if (!uid || !password) {
            return res.status(400).json({ success: false, error: 'Please provide UID and password' });
        }

        // Check for user
        const user = await User.findOne({ uid }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                uid: user.uid,
                role: user.role,
                phone: user.phone,
                department: user.department,
                createdAt: user.createdAt
            }
        });
};

module.exports = router;
