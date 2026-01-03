const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
require('dotenv').config({ path: '../.env' });

const patchIndexes = async () => {
    try {
        const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
        await mongoose.connect(dbUri);
        console.log('Connected to DB');

        const collection = mongoose.connection.collection('attendances');

        // List indexes
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes.map(i => i.name));

        // Attempt to drop the old index if it exists
        // The default name for { student: 1, date: 1 } is student_1_date_1
        try {
            await collection.dropIndex('student_1_date_1');
            console.log('Successfully dropped old index: student_1_date_1');
        } catch (err) {
            console.log('Old index not found or already dropped:', err.message);
        }

        // The model definition will auto-create the new one on app restart, 
        // but we can force create it here to be sure.
        await collection.createIndex({ student: 1, date: 1, subject: 1 }, { unique: true });
        console.log('Created new unique index for { student, date, subject }');

        console.log('Database patch complete.');
        process.exit(0);
    } catch (error) {
        console.error('Patch failed:', error);
        process.exit(1);
    }
};

patchIndexes();
