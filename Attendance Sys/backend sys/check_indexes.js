const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const indexes = await User.collection.indexes();
        console.log('Indexes on Users collection:');
        console.log(JSON.stringify(indexes, null, 2));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkIndexes();
