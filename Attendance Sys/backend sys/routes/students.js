const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Teacher/Admin)
router.get('/', protect, async (req, res) => {
    try {
        let query = {};

        // Filter by section if provided
        if (req.query.section) {
            query.section = req.query.section;
        }
        // Filter by class if provided
        if (req.query.class) {
            query.class = req.query.class;
        }

        const students = await Student.find(query).sort({ rollNumber: 1 });
        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        res.status(200).json({ success: true, data: student });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private (Teacher/Admin)
router.post('/', protect, async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json({ success: true, data: student });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Teacher/Admin)
router.put('/:id', protect, async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        res.status(200).json({ success: true, data: student });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Update student face descriptor (Add new sample)
// @route   PUT /api/students/:id/face
// @access  Private (Teacher/Admin)
router.put('/:id/face', protect, async (req, res) => {
    try {
        const { faceDescriptor } = req.body;

        if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
            return res.status(400).json({ success: false, error: 'Please provide a valid face descriptor' });
        }

        const student = await Student.findByIdAndUpdate(req.params.id, {
            $push: { faceDescriptors: faceDescriptor }
        }, {
            new: true,
            runValidators: true
        });

        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        res.status(200).json({ success: true, data: student });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Teacher/Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
