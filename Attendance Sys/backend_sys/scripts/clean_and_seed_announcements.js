const mongoose = require('mongoose');
const Announcement = require('../models/Announcement');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

const seedData = [
    {
        title: "Department of Temporal Studies: Lost & Found",
        content: "A pocket watch from 1920 was found in the Year 3000 lab. Please claim it before it causes a paradox. Remember: If you meet your future self, do not make eye contact.",
        category: "General",
        priority: "High",
        image: "https://img.freepik.com/free-photo/pocket-watch-sand_1150-14234.jpg"
    },
    {
        title: "Anti-Gravity Yoga Classes",
        content: "Due to a fluctuation in the local gravity field, yoga classes are moved to the ceiling of Hall C. Bring your own velcro mats. Beginners welcome; falling upwards is strictly prohibited.",
        category: "Event",
        priority: "Medium",
        image: "https://img.freepik.com/free-photo/woman-practicing-yoga-with-hammock_23-2148762514.jpg"
    },
    {
        title: "Cafeteria Menu Update: Void Soup",
        content: "Today's special is Void Soup. It tastes like staring into the abyss. Side effects may include existential dread, momentary invisibility, and a craving for philosophy. Served with garlic bread.",
        category: "Event",
        priority: "Low",
        image: "https://img.freepik.com/free-photo/black-soup-bowl_140725-5028.jpg"
    },
    {
        title: "Library Whisper Policy Update",
        content: "The books have started whispering back. Please ignore anything they say about the 'Great Unbinding'. We are working on a containment spell. Late fees still apply.",
        category: "Academic",
        priority: "High",
        image: "https://img.freepik.com/free-photo/old-books-shelf_1150-14227.jpg"
    },
    {
        title: "Campus Cloud Seeding Failed",
        content: "The experimental cloud seeding above the football field has resulted in raining marshmallows instead of water. Umbrellas advised. Do not eat the precipitation.",
        category: "System",
        priority: "Medium",
        image: "https://img.freepik.com/free-photo/marshmallows-falling-pink-background_23-2148248835.jpg"
    }
];

const cleanAndSeed = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/attendance_system');
        console.log('Connected to MongoDB');

        console.log('Clearing existing announcements...');
        const deleteResult = await Announcement.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} announcements.`);

        console.log('Seeding new announcements...');
        const insertResult = await Announcement.insertMany(seedData);
        console.log(`Inserted ${insertResult.length} new announcements.`);

        console.log('DONE.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

cleanAndSeed();
