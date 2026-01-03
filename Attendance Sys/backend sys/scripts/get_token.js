const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load .env from current directory

const testAuth = async () => {
    try {
        const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
        // Connect not strictly needed for token if we have secret, but needed to find user
        await mongoose.connect(dbUri);

        // Find a user or create one (Test Teacher)
        // Note: The app might use 'email' or 'uid' depending on schema.
        // Assuming 'uid' based on previous context.
        let user = await User.findOne({ uid: 'TEST001' });
        if (!user) {
            user = await User.create({
                name: 'Test Teacher',
                uid: 'TEST001',
                password: 'password123',
                role: 'teacher'
            });
            console.log('Created Test User');
        }

        const token = user.getSignedJwtToken();
        console.log('TOKEN_GENERATED');

        // Test API Fetch of Students
        // Note: This requires the server to be running on port 5000
        const response = await fetch('http://localhost:5000/api/students', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`API SUCCESS: Found ${data.count} students.`);
            // console.log(JSON.stringify(data.data, null, 2));
        } else {
            console.log(`API FAIL: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.log(text);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testAuth();
