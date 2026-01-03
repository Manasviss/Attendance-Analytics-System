const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
        console.log('Connecting to:', DB_URI);
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');

        // Delete existing admin if any
        await User.deleteOne({ uid: 'admin' });
        console.log('Cleaned up old admin');

        // Create Admin
        const admin = await User.create({
            name: 'System Admin',
            uid: 'admin',
            password: 'password123',
            role: 'admin',
            email: 'admin@system.com',
            department: 'Administration'
        });

        console.log('Admin Verified Created:');
        console.log('UID:', admin.uid);
        console.log('Role:', admin.role);

        process.exit();
    } catch (error) {
        console.error('CRITICAL ERROR:', error);
        process.exit(1);
    }
};

createAdmin();
