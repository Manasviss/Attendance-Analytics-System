const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        enum: ['Academic', 'Event', 'System', 'General', 'Placement', 'Exam'],
        default: 'General'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
