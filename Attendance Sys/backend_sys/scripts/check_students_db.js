const mongoose = require('mongoose');
const Student = require('../models/Student');
require('dotenv').config({ path: '../.env' });

const checkStudents = async () => {
    try {
        const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
        await mongoose.connect(dbUri);
        console.log('Connected to DB');

        const count = await Student.countDocuments();
        console.log(`Total Students in DB: ${count}`);

        const students = await Student.find({}, 'name rollNumber');
        console.log('Students:', students);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkStudents();
