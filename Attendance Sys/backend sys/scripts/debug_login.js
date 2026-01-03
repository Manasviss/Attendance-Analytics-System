const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const debugLogin = async () => {
    try {
        const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');

        const uid = 'admin';
        const password = 'password123';

        console.log(`Attempting login for UID: ${uid}`);

        // 1. Fetch User
        const user = await User.findOne({ uid }).select('+password');
        if (!user) {
            console.log('❌ User not found!');
            process.exit(1);
        }
        console.log('✅ User found:', user.name);
        console.log('Stored Hash:', user.password);

        // 2. Compare Password
        console.log(`Testing password: '${password}'`);
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log('✅ Password MATCHED! Login should work.');
        } else {
            console.log('❌ Password mismatch!');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugLogin();
