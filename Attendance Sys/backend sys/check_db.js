const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const run = async () => {
    console.log('--- DB DIAGNOSTIC ---');
    console.log('process.env.MONGODB_URI:', process.env.MONGODB_URI);
    console.log('process.env.PORT:', process.env.PORT);

    // Check local default
    const localUri = 'mongodb://127.0.0.1:27017/attendance_sys';
    console.log('Checking local URI:', localUri);

    try {
        await mongoose.connect(localUri);
        console.log('Connected to Local DB.');

        const admin = await User.findOne({ uid: 'admin' }).select('+password');
        if (admin) {
            console.log('Admin Found in Local DB!');
            console.log('UID:', admin.uid);
            console.log('Role:', admin.role);
            const isMatch = await admin.matchPassword('password123');
            console.log('Password "password123" match:', isMatch);
        } else {
            console.log('NO Admin user found in Local DB.');
        }
        await mongoose.disconnect();
    } catch (err) {
        console.log('Failed to connect to Local DB:', err.message);
    }

    // Check configured URI if different
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== localUri) {
        console.log('---');
        console.log('Checking Configured URI:', process.env.MONGODB_URI);
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('Connected to Configured DB.');

            const admin = await User.findOne({ uid: 'admin' }).select('+password');
            if (admin) {
                console.log('Admin Found in Configured DB!');
                console.log('UID:', admin.uid);
                const isMatch = await admin.matchPassword('password123');
                console.log('Password "password123" match:', isMatch);
            } else {
                console.log('NO Admin user found in Configured DB.');
            }
            await mongoose.disconnect();
        } catch (err) {
            console.log('Failed to connect to Configured DB:', err.message);
        }
    }
};

run();
