const Student = require('../models/Student');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getStudents = asyncHandler(async (req, res, next) => {
    const students = await Student.find();
    res.status(200).json({
        success: true,
        count: students.length,
        data: students
    });
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = asyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        return next(
            new ErrorResponse(`Student not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: student
    });
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private
exports.createStudent = asyncHandler(async (req, res, next) => {
    const student = await Student.create(req.body);

    res.status(201).json({
        success: true,
        data: student
    });
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
exports.updateStudent = asyncHandler(async (req, res, next) => {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!student) {
        return next(
            new ErrorResponse(`Student not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: student
    });
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
exports.deleteStudent = asyncHandler(async (req, res, next) => {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
        return next(
            new ErrorResponse(`Student not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Mark attendance for a student
// @route   POST /api/students/:id/attendance
// @access  Private
exports.markAttendance = asyncHandler(async (req, res, next) => {
    const { date, status, subject, notes } = req.body;

    const attendanceRecord = {
        date: date || Date.now(),
        status,
        subject,
        markedBy: req.user.id,
        notes: notes || ''
    };

    const student = await Student.findByIdAndUpdate(
        req.params.id,
        { $push: { attendance: attendanceRecord } },
        { new: true, runValidators: true }
    );

    if (!student) {
        return next(
            new ErrorResponse(`Student not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: student
    });
});
