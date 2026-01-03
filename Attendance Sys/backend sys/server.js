require('dotenv').config(); // Loaded environment variables
const express = require('express'); // Server Trigger
const mongoose = require('mongoose');
const cors = require('cors');
var pathModule = require('path');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const analyticsRoutes = require('./routes/analytics');
const leaveRoutes = require('./routes/leaves');
const announcementRoutes = require('./routes/announcements');
const rmsRoutes = require('./routes/rms');
const notificationRoutes = require('./routes/notifications');

// Initialize Express app
const app = express();

// Middleware
const cookieParser = require('cookie-parser');
const fs = require('fs');

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const connectDB = async () => {
    console.log('connectDB called, pathModule is:', typeof pathModule);
    let dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
        console.log('No MONGODB_URI found. Attempting to start embedded MongoDB...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');

            // Define paths
            const userDataDir = pathModule.join(process.cwd(), 'db-data');
            if (!fs.existsSync(userDataDir)) {
                fs.mkdirSync(userDataDir, { recursive: true });
            }

            // Logic to handle bundled binary
            // When packaged, we need to extract mongod.exe from snapshot to valid FS
            let mongodBinPath = '';

            // Check if we are in pkg
            if (process.pkg) {
                const internalBinPath = pathModule.join(__dirname, 'mongobin', 'mongod.exe');
                const externBinPath = pathModule.join(process.cwd(), 'mongod_bundled.exe');

                // If it exists internally in snapshot
                if (fs.existsSync(internalBinPath)) {
                    // Check if we need to copy (if external doesn't exist or is different size?)
                    // For simplicity, copy if not exists
                    if (!fs.existsSync(externBinPath)) {
                        console.log('Extracting embedded MongoDB binary...');
                        fs.copyFileSync(internalBinPath, externBinPath);
                    }
                    mongodBinPath = externBinPath;
                }
            } else {
                // In dev, look in local folder
                const localBin = pathModule.join(__dirname, 'mongobin', 'mongod.exe');
                if (fs.existsSync(localBin)) {
                    mongodBinPath = localBin;
                }
            }

            const binaryOpts = mongodBinPath ? { systemBinary: mongodBinPath } : { version: '7.0.8' }; // Fallback to auto-download if not found (dev mode)

            console.log('Starting MongoDB instance...', binaryOpts);
            const mongod = await MongoMemoryServer.create({
                instance: {
                    dbPath: userDataDir,
                    storageEngine: 'wiredTiger' // Needed for persistence
                },
                binary: binaryOpts
            });

            dbUri = mongod.getUri();
            console.log('Embedded MongoDB started at:', dbUri);

            // Cleanup on exit
            process.on('SIGTERM', async () => await mongod.stop());
            process.on('SIGINT', async () => await mongod.stop());

        } catch (err) {
            console.error('Failed to start embedded MongoDB:', err);
            // Fallback
            dbUri = 'mongodb://127.0.0.1:27017/attendance_sys';
        }
    }

    mongoose.connect(dbUri)
        .then(async () => {
            console.log('MongoDB connected successfully');
            console.log('Connected to DB URI:', dbUri);

            // Seed Admin User
            try {
                const adminExists = await User.findOne({ uid: 'admin' });
                if (!adminExists) {
                    await User.create({
                        name: 'System Admin',
                        uid: 'admin',
                        password: 'password123',
                        role: 'admin',
                        email: 'admin@system.com',
                        department: 'Administration'
                    });
                    console.log('✅ Admin user created: uid=admin, password=password123');
                } else {
                    console.log('👍 Admin user already exists. Ready for login.');
                }
            } catch (seedErr) {
                console.error('⚠️ Error checking/creating admin user:', seedErr.message);
            }
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
        });
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/rms', rmsRoutes);
app.use('/api/notifications', notificationRoutes);

// Temporary admin fix route removed

// Basic route for testing
// app.get('/', (req, res) => {
//     res.send('Attendance System API is running...');
// });

// Serve static files from frontend build
app.use(express.static(pathModule.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get(/.*/, (req, res) => {
    res.sendFile(pathModule.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
