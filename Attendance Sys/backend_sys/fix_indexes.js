const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Try loading .env from current directory
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
console.log('Using Mongo URI:', uri);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const collection = mongoose.connection.db.collection('attendances');
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes.map(i => i.name));

        const conflictingIndex = 'student_1_date_1';
        if (indexes.find(i => i.name === conflictingIndex)) {
            console.log(`Found conflicting index: ${conflictingIndex}. Dropping it...`);
            await collection.dropIndex(conflictingIndex);
            console.log('Index dropped successfully.');
        } else {
            console.log(`Index ${conflictingIndex} not found or already removed.`);
        }

        console.log('Verifying indexes after operation...');
        const newIndexes = await collection.indexes();
        console.log('Updated Indexes:', newIndexes.map(i => i.name));

        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

connectDB();
