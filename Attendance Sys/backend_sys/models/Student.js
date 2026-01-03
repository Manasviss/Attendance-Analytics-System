const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a student name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    rollNumber: {
        type: String,
        required: [true, 'Please add a roll number'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    class: {
        type: String,
        required: [true, 'Please add a class']
    },
    section: {
        type: String,
        required: [true, 'Please add a section']
    },
    academicYear: {
        type: String,
        required: [true, 'Please add an academic year']
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'graduated'],
        default: 'active'
    },
    faceDescriptors: {
        type: [[Number]], // Array of arrays of numbers
        default: []
    },
    attendance: [
        {
            date: {
                type: Date,
                required: true
            },
            status: {
                type: String,
                enum: ['present', 'absent', 'late', 'excused'],
                required: true
            },
            subject: {
                type: String,
                required: true
            },
            markedBy: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            notes: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a compound index for efficient querying
studentSchema.index({ class: 1, section: 1, academicYear: 1 });

// Calculate attendance percentage for a specific subject
studentSchema.methods.getAttendancePercentage = function (subject = null) {
    const attendanceRecords = subject
        ? this.attendance.filter(record => record.subject === subject)
        : this.attendance;

    if (attendanceRecords.length === 0) return 0;

    const presentCount = attendanceRecords.filter(
        record => record.status === 'present' || record.status === 'late'
    ).length;

    return Math.round((presentCount / attendanceRecords.length) * 100);
};

// Get attendance summary by date range
studentSchema.methods.getAttendanceSummary = function (startDate, endDate) {
    return this.attendance.filter(record => {
        return record.date >= startDate && record.date <= endDate;
    });
};

module.exports = mongoose.model('Student', studentSchema);
