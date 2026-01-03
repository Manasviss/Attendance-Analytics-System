const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const createAdmin = async () => {
    try {
        const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');

        const adminUid = '123';

        // Check if exists
        const exists = await User.findOne({ uid: adminUid });
        if (exists) {
            console.log('Admin user already exists. RESETTING PASSWORD & ROLE...');
            exists.role = 'admin';
            exists.password = 'admin'; // User requested literal 'admin' as password
            await exists.save();
            console.log('Admin user updated. Password reset to: admin');
        } else {
            const admin = await User.create({
                name: 'System Admin',
                uid: adminUid,
                password: 'admin',
                role: 'admin',
                email: 'admin@system.com'
            });
            console.log('Admin user created successfully.');
            console.log('UID: 123');
            console.log('Password: admin');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
