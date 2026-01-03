const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const students = await Student.find({});
        const sections = ['K23DF', 'K23GH', 'K23KV', 'K23KR'];

        console.log(`Distributing ${students.length} students across sections...`);

        let updatedCount = 0;
        for (let i = 0; i < students.length; i++) {
            const s = students[i];
            const newSection = sections[i % sections.length]; // Round-robin distribution

            await Student.updateOne({ _id: s._id }, { $set: { section: newSection } });
            console.log(`Updated ${s.name} to ${newSection}`);
            updatedCount++;
        }

        console.log(`Redistribution Complete. Updated ${updatedCount} students.`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

connectDB();
