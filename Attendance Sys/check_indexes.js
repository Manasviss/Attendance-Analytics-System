const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './backend sys/.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const indexes = await mongoose.connection.db.collection('attendances').indexes();
        console.log('Indexes on "attendances" collection:');
        console.log(JSON.stringify(indexes, null, 2));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
