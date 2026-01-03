const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const resetTeacher = async () => {
    try {
        const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');

        const teacherUid = '12310100';

        // Find the user
        let teacher = await User.findOne({ uid: teacherUid });

        if (!teacher) {
            console.log('Teacher not found, creating new one...');
            teacher = await User.create({
                name: 'Manu Garg',
                uid: teacherUid,
                email: 'manu@example.com',
                password: 'password123',
                role: 'teacher',
                phone: '1234567890',
                department: 'Computer Science'
            });
        } else {
            console.log('Teacher found. Updating password...');
            teacher.password = 'password123';
            await teacher.save();
        }

        console.log('Teacher Account Credentials:');
        console.log('UID:', teacher.uid);
        console.log('Password:', 'password123');
        console.log('Role:', teacher.role);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetTeacher();
