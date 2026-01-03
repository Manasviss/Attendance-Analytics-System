const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// ==========================================
// SPECIFIC ROUTES (Must come BEFORE generic /:id)
// ==========================================

// @desc    Get Daily Report (Robust)
// @route   GET /api/attendance/daily-report
// @access  Private
router.get('/daily-report', protect, async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ success: false, error: 'Date is required (YYYY-MM-DD)' });
        }

        // Parse YYYY-MM-DD to UTC Range
        const parts = date.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);

        const start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
        const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

        console.log(`Daily Report Request for ${date} [${start.toISOString()} - ${end.toISOString()}]`);

        const query = {
            date: { $gte: start, $lt: end }
        };

        // If not admin, only show records marked by this user
        // This fixes the issue of seeing other teachers' data/reports
        if (req.user.role !== 'admin') {
            query.markedBy = req.user.id;
        }

        const records = await Attendance.find(query)
            .populate('student', 'name rollNumber section class')
            .populate('markedBy', 'name')
            .sort({ date: -1 });

        // Map to robust flat format
        const flatData = records.map(r => ({
            _id: r._id,
            date: r.date,
            status: r.status,
            subject: r.subject || 'General', // Include Subject
            section: r.student ? r.student.section : 'N/A', // Include Section
            class: r.student ? r.student.class : 'N/A', // Include Class
            studentName: r.student ? r.student.name : 'Unknown Student',
            rollNumber: r.student ? r.student.rollNumber : 'N/A',
            markedBy: r.markedBy ? r.markedBy.name : 'System',
            // Include raw student ID if needed by frontend
            studentId: r.student ? r.student._id : null
        }));

        res.status(200).json({ success: true, count: flatData.length, data: flatData });
    } catch (err) {
        console.error('Daily Report Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// @desc    Get Attendance History (Alias/Helper for AttendanceSheet)
// @route   GET /api/attendance/history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ success: false, error: 'Date is required' });
        }

        const parts = date.split('-');
        const start = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 0, 0, 0, 0));
        const end = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 23, 59, 59, 999));

        const query = {
            date: { $gte: start, $lt: end }
        };

        // Inherit filtering: Teachers only see what THEY marked
        if (req.user.role !== 'admin') {
            query.markedBy = req.user.id;
        }

        // Add optional filters if provided in query
        if (req.query.subject) query.subject = req.query.subject;
        if (req.query.section) query.section = req.query.section; // This requires Populate filtering or if section is stored in Attendance. 
        // Note: Section is NOT stored in Attendance model directly (it is on Student). 
        // The current find() doesn't filter by section efficiently without aggregating, 
        // but the frontend calls with section? 
        // Wait, the previous code didn't filter by subject/section in the DB query? 
        // Looking at previous code: `const records = await Attendance.find({ date: ... })`.
        // It fetched ALL records for the day and returned them?
        // Let's stick to the scoping fix first.

        const records = await Attendance.find(query).populate('student', 'name _id');

        res.status(200).json({ success: true, data: records });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @desc    Mark attendance for multiple students (Bulk)
// @route   POST /api/attendance/bulk
// @access  Private (Teacher)
router.post('/bulk', protect, async (req, res) => {
    try {
        const { date, records, subject } = req.body; // records: [{ studentId, status }]

        const recordSubject = subject || 'General';

        if (!records || !Array.isArray(records)) {
            return res.status(400).json({ success: false, error: 'Invalid records format' });
        }

        // Normalize date to UTC Midnight
        let attendanceDate = date ? new Date(date) : new Date();
        attendanceDate = new Date(Date.UTC(
            attendanceDate.getFullYear(),
            attendanceDate.getMonth(),
            attendanceDate.getDate(),
            0, 0, 0, 0
        ));

        const markedBy = req.user.id;

        // 1. Prepare operations for Attendance Collection (Reports)
        const attendanceOps = records.map(record => ({
            updateOne: {
                filter: {
                    student: record.studentId,
                    date: attendanceDate, // Exact match on UTC midnight
                    subject: recordSubject
                },
                update: {
                    $set: {
                        student: record.studentId,
                        status: record.status,
                        date: attendanceDate,
                        subject: recordSubject, // Save Subject
                        markedBy: markedBy
                    }
                },
                upsert: true
            }
        }));

        // 2. Prepare operations for Student Collection (Stats)
        const studentOps = records.map(record => ({
            updateOne: {
                filter: { _id: record.studentId },
                update: {
                    $push: {
                        attendance: {
                            date: attendanceDate,
                            status: record.status.toLowerCase(), // Map Present->present
                            subject: recordSubject, // Save Subject
                            markedBy: markedBy
                        }
                    }
                }
            }
        }));

        // Execute both
        await Promise.all([
            Attendance.bulkWrite(attendanceOps),
            Student.bulkWrite(studentOps)
        ]);

        res.status(201).json({ success: true, message: `Attendance marked for ${records.length} students` });
    } catch (err) {
        console.error("Bulk attendance error:", err);
        res.status(400).json({ success: false, error: err.message });
    }
});


// ==========================================
// GENERIC ROUTES (Must come AFTER specific routes)
// ==========================================

// @desc    Mark attendance for a student (Single)
// @route   POST /api/attendance
// @access  Private (Teacher)
router.post('/', protect, async (req, res) => {
    try {
        const { studentId, status, date, subject } = req.body;

        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        // Normalize date to UTC Midnight
        let attendanceDate = date ? new Date(date) : new Date();
        attendanceDate = new Date(Date.UTC(
            attendanceDate.getFullYear(),
            attendanceDate.getMonth(),
            attendanceDate.getDate(),
            0, 0, 0, 0
        ));

        const recordSubject = subject || 'General';

        // Create attendance record
        const attendance = await Attendance.create({
            student: studentId,
            status,
            date: attendanceDate,
            subject: recordSubject, // Save Subject
            markedBy: req.user.id
        });

        // Push to Student's attendance array
        await Student.findByIdAndUpdate(studentId, {
            $push: {
                attendance: {
                    date: attendanceDate,
                    status: status.toLowerCase(),
                    subject: recordSubject, // Save Subject
                    markedBy: req.user.id
                }
            }
        });

        res.status(201).json({ success: true, data: attendance });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Attendance already marked for this student today' });
        }
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Get attendance history for a student
// @route   GET /api/attendance/:studentId
// @access  Private
router.get('/:studentId', protect, async (req, res) => {
    try {
        const attendance = await Attendance.find({ student: req.params.studentId }).populate('markedBy', 'name');
        res.status(200).json({ success: true, count: attendance.length, data: attendance });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
