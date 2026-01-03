const express = require('express');
const router = express.Router();
const RMSRequest = require('../models/RMSRequest');
const { protect } = require('../middleware/auth'); // ensure the guy is logged in

// @desc    Create a new RMS Request
// @route   POST /api/rms
// @access  Private (Teachers/Staff)
router.post('/', protect, async (req, res, next) => {
    try {
        const { category, location, description } = req.body;
        console.log('Received RMS Create Request:', { category, location, description, user: req.user.id });

        const request = await RMSRequest.create({
            user: req.user.id,
            category,
            location,
            description
        });

        res.status(201).json({
            success: true,
            data: request      // capture the UID as such
        });
    } catch (err) {
        console.error('RMS Create Error:', err);
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Get user's requests
// @route   GET /api/rms/my
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const requests = await RMSRequest.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @desc    Get ALL requests (Admin only)
// @route   GET /api/rms/all
// @access  Private (Admin)
router.get('/all', protect, async (req, res) => {
    try {
        // In a real app, check for req.user.role === 'admin'
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        const requests = await RMSRequest.find()
            .populate('user', 'name uid department')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @desc    Update request status
// @route   PUT /api/rms/:id
// @access  Private (Admin)
router.put('/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        const { status, adminResponse } = req.body;

        const request = await RMSRequest.findByIdAndUpdate(
            req.params.id,
            { status, adminResponse },
            { new: true, runValidators: true } // repond to a particular request (refresh needed)
        );

        if (!request) {
            return res.status(404).json({ success: false, error: 'Request not found' });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
