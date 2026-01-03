const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// @desc    Apply for leave (Self-service for Teachers)
// @route   POST /api/leaves/apply
// @access  Private
router.post('/apply', protect, async (req, res) => {
    try {
        const { type, startDate, endDate, reason } = req.body;

        console.log('Leave Application Request Body:', req.body);
        console.log('Logged in User ID:', req.user.id);

        // Create leave for the logged-in teacher
        const leave = await Leave.create({
            teacher: req.user.id,
            applicantRole: 'Teacher',
            type,
            startDate,
            endDate,
            reason
        });

        res.status(201).json({ success: true, data: leave });
    } catch (err) {
        console.error('Leave Application Error:', err); // Debug log
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Get all leave requests (for Admin/HOD view)
// @route   GET /api/leaves
// @access  Private (Teacher/Admin)
router.get('/', protect, async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate('teacher', 'name uid department')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: leaves.length, data: leaves });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Get MY leaves (Logged in user)
// @route   GET /api/leaves/my-leaves
// @access  Private
router.get('/my-leaves', protect, async (req, res) => {
    try {
        const leaves = await Leave.find({ teacher: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: leaves.length, data: leaves });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

const Notification = require('../models/Notification');

// // @desc    Update leave status (Approve/Reject)
// // @route   PUT /api/leaves/:id/status
// // @access  Private (Teacher - actually Admin who is also a user)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const leave = await Leave.findByIdAndUpdate(req.params.id, {
            status,
            actionBy: req.user.id,
            actionDate: Date.now()
        }, {
            new: true,
            runValidators: true
        });

        if (!leave) {
            return res.status(404).json({ success: false, error: 'Leave request not found' });
        }

        // Notify the applicant
        if (leave.teacher) { // Only notify if it's a teacher's leave
            await Notification.create({
                recipient: leave.teacher,
                title: `Leave request ${status}`,
                message: `Your leave request for ${new Date(leave.startDate).toLocaleDateString()} has been ${status.toLowerCase()}.`,
                type: status === 'Approved' ? 'Success' : 'Error' // Error style for rejection
            });
        }

        res.status(200).json({ success: true, data: leave });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
