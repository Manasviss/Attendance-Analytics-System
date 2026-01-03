const mongoose = require('mongoose');
const Student = require('../models/Student');
require('dotenv').config({ path: '../.env' }); // Try to load .env if it exists

const students = [
    {
        name: "Aravind Patel",
        rollNumber: "CS2023001",
        email: "aravind.p@college.edu",
        class: "CS-A",
        section: "A",
        academicYear: "2023-2024",
        status: "active"
    },
    {
        name: "Priya Sharma",
        rollNumber: "CS2023002",
        email: "priya.s@college.edu",
        class: "CS-A",
        section: "A",
        academicYear: "2023-2024",
        status: "active"
    },
    {
        name: "Rohan Gupta",
        rollNumber: "CS2023003",
        email: "rohan.g@college.edu",
        class: "CS-A",
        section: "A",
        academicYear: "2023-2024",
        status: "active"
    },
    {
        name: "Ananya Iyer",
        rollNumber: "CS2023004",
        email: "ananya.i@college.edu",
        class: "CS-A",
        section: "A",
        academicYear: "2023-2024",
        status: "active"
    },
    {
        name: "Vikram Singh",
        rollNumber: "CS2023005",
        email: "vikram.s@college.edu",
        class: "CS-A",
        section: "A",
        academicYear: "2023-2024",
        status: "active"
    }
];

const seedStudents = async () => {
    try {
        const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
        await mongoose.connect(dbUri);
        console.log('Connected to MongoDB at', dbUri);

        // Optional: Clear existing students to avoid duplicates if run multiple times
        // await Student.deleteMany({});
        // console.log('Cleared existing students');

        for (const student of students) {
            // Check if student exists
            const exists = await Student.findOne({ rollNumber: student.rollNumber });
            if (!exists) {
                await Student.create(student);
                console.log(`Added student: ${student.name}`);
            } else {
                console.log(`Student already exists: ${student.name}`);
            }
        }

        console.log('Seeding completed!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding students:', err);
        process.exit(1);
    }
};

seedStudents();
