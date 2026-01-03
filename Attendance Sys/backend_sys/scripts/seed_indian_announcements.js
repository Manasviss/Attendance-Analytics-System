const mongoose = require('mongoose');
const Announcement = require('../models/Announcement');
require('dotenv').config({ path: '../.env' });

const seedData = [
    {
        title: "Inter-College Tech Fest 'Aavishkar 2024'",
        content: "Registration is now open for the annual Tech Fest 'Aavishkar'. Events include Hackathon, RoboWars, Coding Relay, and LAN Gaming. Win prizes worth ₹5 Lakhs! innovative projects will be showcased in the Main Auditorium.",
        category: "Event",
        priority: "High",
        image: "https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg"
    },
    {
        title: "TCS Ninja & Digital Placement Drive",
        content: "Tata Consultancy Services (TCS) will be conducting the National Qualifier Test (NQT) for the 2025 graduating batch. Eligibility: Min 6.0 CGPA. Roles: Ninja (3.36 LPA) and Digital (7.0 LPA). Register on the TPO portal by Friday.",
        category: "Placement",
        priority: "High",
        image: "https://img.freepik.com/free-photo/group-diverse-people-having-business-meeting_53876-25060.jpg"
    },
    {
        title: "Holi Celebration: 'Rangotsav'",
        content: "Join us for 'Rangotsav', the grand Holi celebration at the College Ground. Organic colors, DJ, and refreshmnets provided. Strict discipline to be maintained. No outsiders allowed.",
        category: "Event",
        priority: "Medium",
        image: "https://img.freepik.com/free-photo/people-celebrating-holi-festival-india_23-2149306915.jpg"
    },
    {
        title: "End Semester Exam Schedule Released",
        content: "The tentative datesheet for the upcoming End Semester Examinations (Dec 2024) has been released. Please check the university management system (UMS) for subject-wise dates and seating plans.",
        category: "Exam",
        priority: "High",
        image: "https://img.freepik.com/free-photo/students-knowing-right-answer_329181-14271.jpg"
    },
    {
        title: "Guest Lecture: 'AI in India' by ISRO Scientist",
        content: "We are honored to host Dr. V.K. Menon, Senior Scientist from ISRO, for a guest lecture on the 'Future of Artificial Intelligence in Indian Space Research'. Attendance is mandatory for CSE students.",
        category: "Academic",
        priority: "Medium",
        image: "https://img.freepik.com/free-vector/seminar-concept-illustration_114360-7480.jpg"
    }
];

const cleanAndSeed = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/attendance_system');
        console.log('Connected to MongoDB');

        console.log('Clearing existing announcements...');
        await Announcement.deleteMany({});

        console.log('Seeding Indian college themed announcements...');
        await Announcement.insertMany(seedData);

        console.log('DONE.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

cleanAndSeed();
