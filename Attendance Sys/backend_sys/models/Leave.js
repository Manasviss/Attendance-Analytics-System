const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student'
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    applicantRole: {
        type: String,
        enum: ['Student', 'Teacher'],
        default: 'Student'
    },
    type: {
        type: String,
        enum: ['Medical', 'Casual', 'Emergency', 'Other'],
        required: [true, 'Please select a leave type']
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date']
    },
    reason: {
        type: String,
        required: [true, 'Please add a reason'],
        maxlength: [500, 'Reason cannot be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    actionBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    actionDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Leave', leaveSchema);
