const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

const promoteUser = async () => {
    try {
        const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_sys';
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');

        const searchTerm = process.argv[2];
        if (!searchTerm) {
            console.log('Please provide a name or UID to search for.');
            process.exit(1);
        }

        // Find by partial name or exact UID
        const users = await User.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { uid: searchTerm }
            ]
        });

        if (users.length === 0) {
            console.log('No users found matching:', searchTerm);
            console.log('Listing ALL users to help you find the right one:');
            const allUsers = await User.find({});
            console.log(JSON.stringify(allUsers, null, 2));
        } else if (users.length === 1) {
            const user = users[0];
            user.role = 'admin';
            await user.save();
            console.log(`SUCCESS: User '${user.name}' (UID: ${user.uid}) is now an ADMIN.`);
        } else {
            console.log('Multiple users found. Please be more specific:');
            users.forEach(u => console.log(`- ${u.name} (${u.uid})`));
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

promoteUser();
