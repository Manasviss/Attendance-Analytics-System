const mongoose = require('mongoose');

const RMSRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'Classroom Hardware',
            'Lab Software/Network',
            'Electrical Issue',
            'Cleanliness/Hygiene',
            'Furniture/Infrastructure',
            'Examination Support',
            'Other'
        ]
    },
    location: {
        type: String,
        required: [true, 'Please provide a location or room number'],
    },
    // Kept for backward compatibility if needed, but not used in UI
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    adminResponse: {
        type: String
    },
    ticketId: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Generate a simple Ticket ID before saving
RMSRequestSchema.pre('save', async function () {
    if (!this.ticketId) {
        const date = new Date();
        const random = Math.floor(1000 + Math.random() * 9000);
        this.ticketId = `RMS-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${random}`;
    }
});

module.exports = mongoose.model('RMSRequest', RMSRequestSchema);
