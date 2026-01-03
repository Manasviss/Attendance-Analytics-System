require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 'undefined');

const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
mongoose.connect(DB_URI)
    .then(() => {
        console.log('SUCCESS: MongoDB connected successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR: MongoDB connection failed:', err);
        process.exit(1);
    });
