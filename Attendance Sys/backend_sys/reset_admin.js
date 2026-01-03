const mongoose = require('mongoose');
const User = require('./models/User');
const path = require('path');
const fs = require('fs');

// We need to replicate some connection logic because we are running a standalone script
// and might be using the embedded DB or a local one.
// Let's assume local dev fallback first as it is most likely for this context.
require('dotenv').config();

const run = async () => {
    let dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';

    // Check if we need to use embedded (similar logic to server.js just in case)
    // For simplicity in this script, we'll try the default URI first.

    try {
        console.log('Connecting to MongoDB at:', dbUri);
        await mongoose.connect(dbUri);
        console.log('Connected.');

        // 1. Delete existing admin
        console.log('Removing existing admin...');
        await User.findOneAndDelete({ uid: 'admin' });

        // 2. Create new admin
        console.log('Creating new admin...');
        const adminUser = await User.create({
            name: 'System Admin',
            uid: 'admin',
            password: 'password123', // This will be hashed by pre-save hook
            role: 'admin',
            email: 'admin@system.com',
            department: 'Administration'
        });

        console.log('Admin created successfully!');
        console.log('UID:', adminUser.uid);
        console.log('Role:', adminUser.role);
        console.log('Password (Hashed):', adminUser.password);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

run();
