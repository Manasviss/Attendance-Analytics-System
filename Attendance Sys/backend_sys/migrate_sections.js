const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const students = await Student.find({}, 'name section rollNumber');
        console.log('Current Students and Sections:');
        students.forEach(s => {
            console.log(`${s.name} (${s.rollNumber}): ${s.section}`);
        });

        // Migration map
        const conversion = {
            'A': 'K23DF',
            'B': 'K23GH',
            'C': 'K23KV',
            'D': 'K23KR' // Just in case
        };

        let updatedCount = 0;
        for (const s of students) {
            // If section is A, B, C, or just empty/default, map it
            // If it's already one of the new ones, leave it
            if (['K23DF', 'K23GH', 'K23KV', 'K23KR'].includes(s.section)) continue;

            let newSection = conversion[s.section] || 'K23DF'; // Default to K23DF if unknown

            await Student.updateOne({ _id: s._id }, { $set: { section: newSection } });
            console.log(`Updated ${s.name} from ${s.section} to ${newSection}`);
            updatedCount++;
        }

        console.log(`Migration Complete. Updated ${updatedCount} students.`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

connectDB();
