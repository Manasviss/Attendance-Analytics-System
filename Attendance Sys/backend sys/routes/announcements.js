const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Public (or Private depending on auth)
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ date: -1 });
        res.json(announcements);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/announcements
// @desc    Create a new announcement
// @access  Private (should be admin/teacher only)
router.post('/', async (req, res) => {
    const { title, content, category, priority } = req.body;

    try {
        const newAnnouncement = new Announcement({
            title,
            content,
            category,
            priority
        });

        const announcement = await newAnnouncement.save();
        res.json(announcement);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
