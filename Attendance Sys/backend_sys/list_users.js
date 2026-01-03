const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const listUsers = async () => {
    try {
        const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({}, 'uid name');
        console.log('Existing Users:', users.length);
        console.table(users.map(u => ({ uid: u.uid, name: u.name })));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listUsers();
