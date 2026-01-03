const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const verifyLogin = async (uid, password) => {
    try {
        const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
        await mongoose.connect(DB_URI);

        console.log(`Testing Login for UID: ${uid} with pass: ${password}`);

        const user = await User.findOne({ uid }).select('+password');

        if (!user) {
            console.log('❌ User not found');
            return;
        }

        console.log('User found:', user.name);

        const isMatch = await user.matchPassword(password);

        if (isMatch) {
            console.log('✅ PASSWORD MATCH! Login successful.');
        } else {
            console.log('❌ PASSWORD MISMATCH.');
            console.log('Stored Hash:', user.password);
            // debug hash
            const testHash = await bcrypt.hash(password, 10);
            console.log('Test Hash of input:', testHash);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

// Test with the reset password
verifyLogin('12310100', 'password123');
