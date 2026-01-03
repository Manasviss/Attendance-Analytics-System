const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Public (or Private depending on auth)
router.get('/', async (req, res) => {
    try {
        let announcements = await Announcement.find().sort({ date: -1 });

        // Check if we need to upgrade old text-only seeds OR fix broken images
        const brokenLibUrl = "https://images.unsplash.com/photo-1507842217343-583bb7260b66?w=800&q=80";
        const hasImages = announcements.some(a => a.image);
        const hasBrokenImage = announcements.some(a => a.image === brokenLibUrl);

        if ((!hasImages || hasBrokenImage) && announcements.length > 0) {
            await Announcement.deleteMany({});
            announcements = [];
        }

        if (announcements.length === 0) {
            // Auto-seed if empty
            const seedData = [
                {
                    title: "Faculty Meeting Rescheduled",
                    content: "The monthly department meeting has been moved to Conference Room B at 3:00 PM. Please bring your updated reports.",
                    category: "Admin",
                    priority: "High",
                    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
                    date: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
                },
                {
                    title: "Mid-Term Grades Submission",
                    content: "Portal closes on Friday at 5:00 PM. Please ensure all internal marks are uploaded before the deadline to avoid system lockout.",
                    category: "Exam",
                    priority: "High",
                    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
                    date: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
                },
                {
                    title: "Tech Fest Registration Open",
                    content: "Encourage students to participate in the upcoming Hackathon 'CodeAlpha'. Registration links are available on the student portal.",
                    category: "Event",
                    priority: "Medium",
                    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
                    date: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
                },
                {
                    title: "Library Maintenance",
                    content: "Digital Library services will be unavailable this Sunday due to server upgrades. Physical borrowing remains unaffected.",
                    category: "System",
                    priority: "Low",
                    image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80",
                    date: new Date()
                }
            ];
            announcements = await Announcement.insertMany(seedData);
        }

        res.json(announcements);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/announcements/:id
// @desc    Get announcement by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ msg: 'Announcement not found' });
        }
        res.json(announcement);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Announcement not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/announcements
// @desc    Create a new announcement
// @access  Private (should be admin/teacher only)
router.post('/', async (req, res) => {
    const { title, content, category, priority, image } = req.body;

    try {
        const newAnnouncement = new Announcement({
            title,
            content,
            category,
            priority,
            image
        });

        const announcement = await newAnnouncement.save();
        res.json(announcement);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/announcements/seed
// @desc    Seed ambiguous announcements
router.post('/seed', async (req, res) => {
    try {
        await Announcement.deleteMany({}); // Clear existing

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
        const created = await Announcement.insertMany(seedData);
        res.json(created);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
