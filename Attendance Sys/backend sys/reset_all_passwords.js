const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const resetAll = async () => {
    try {
        const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log(`Found ${users.length} users. Resetting passwords...`);

        for (const user of users) {
            // We must mark password as modified to trigger the pre-save hook
            user.password = 'password123';
            await user.save();
            console.log(`Reset password for ${user.name} (${user.uid})`);
        }

        console.log('\n--- CREDENTIALS REPORT ---');
        users.forEach(u => {
            console.log(`User: ${u.name.padEnd(20)} | UID: ${u.uid.padEnd(10)} | Pass: password123`);
        });

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetAll();
