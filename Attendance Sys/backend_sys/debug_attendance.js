const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');
const Student = require('./models/Student');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const count = await Attendance.countDocuments();
        console.log(`Total Attendance Records: ${count}`);

        const records = await Attendance.find().populate('student', 'name rollNumber').limit(10);
        console.log('Last 10 Records:');
        records.forEach(r => {
            console.log(`Student: ${r.student ? r.student.name : 'N/A'}, Date: ${r.date.toISOString()}, Status: ${r.status}, MarkedBy: ${r.markedBy}`);
        });

        // Check for today's records specifically
        const dateStr = "2025-12-21";
        const queryDate = new Date(dateStr);
        const start = new Date(new Date(queryDate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(queryDate).setHours(23, 59, 59, 999));

        console.log(`\nSimulated Query Range for ${dateStr}:`);
        console.log(`Start: ${start.toISOString()}`);
        console.log(`End:   ${end.toISOString()}`);

        const todayRecords = await Attendance.find({
            date: { $gte: start, $lt: end }
        }).populate('student', 'name');

        console.log(`\nRecords found for simulated query: ${todayRecords.length}`);
        if (todayRecords.length > 0) {
            console.log('Sample Record Date:', todayRecords[0].date.toISOString());
            console.log('Sample Record MarkedBy:', todayRecords[0].markedBy);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
