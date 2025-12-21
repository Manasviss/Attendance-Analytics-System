const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
    try {
        // 1. Total Students
        const totalStudents = await Student.countDocuments();

        // 2. Attendance Today
        // 2. Attendance Today
        const dateParam = req.query.date;
        const queryDate = dateParam ? new Date(dateParam) : new Date();

        const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

        const attendanceToday = await Attendance.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        const presentToday = attendanceToday.filter(a => a.status === 'Present').length;
        const absentToday = attendanceToday.filter(a => a.status === 'Absent').length;

        // 3. Average Attendance (Overall)
        // This is a simplified calculation. For production, use aggregation pipeline.
        const totalAttendanceRecords = await Attendance.countDocuments();
        const totalPresentRecords = await Attendance.countDocuments({ status: 'Present' });
        const avgAttendance = totalAttendanceRecords > 0
            ? Math.round((totalPresentRecords / totalAttendanceRecords) * 100)
            : 0;

        // 4. Critical Attendance (Students with < 75% attendance)
        const criticalAttendance = await Attendance.aggregate([
            {
                $group: {
                    _id: "$student",
                    totalClasses: { $sum: 1 },
                    presentClasses: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Present"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "_id",
                    foreignField: "_id",
                    as: "studentInfo"
                }
            },
            { $unwind: "$studentInfo" },
            {
                $project: {
                    name: "$studentInfo.name",
                    rollNumber: "$studentInfo.rollNumber",
                    attendancePercentage: {
                        $multiply: [
                            { $divide: ["$presentClasses", "$totalClasses"] },
                            100
                        ]
                    }
                }
            },
            {
                $match: {
                    attendancePercentage: { $lt: 75 }
                }
            },
            { $sort: { attendancePercentage: 1 } },
            { $limit: 5 }
        ]);

        const formattedCritical = criticalAttendance.map(s => ({
            id: s._id,
            name: s.name,
            roll: s.rollNumber,
            attendance: Math.round(s.attendancePercentage)
        }));

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                presentToday,
                absentToday,
                avgAttendance,
                criticalAttendance: formattedCritical
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
