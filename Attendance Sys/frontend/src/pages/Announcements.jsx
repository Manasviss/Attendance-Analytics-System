import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import announcementsIllustration from '../assets/announcements_illustration.png';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        category: 'General',
        priority: 'Medium'
    });

    // LPU Real-Life Themed Announcements
    const initialData = [
        {
            _id: '1',
            title: "Duty Leave for Research Conference",
            content: "Faculty members presenting papers at the upcoming International Conference on Computing (ICC 2024) can apply for 3 days On-Duty (OD) leave. Submit acceptance letters to HOD office by Friday.",
            date: new Date().toISOString(),
            category: "Academic",
            priority: "High"
        },
        {
            _id: '2',
            title: "Chancellor's Visit to Block 34",
            content: "Honorable Chancellor will be visiting Block 34 research labs tomorrow at 10:00 AM. All faculty are requested to ensure labs are in order and students are present in uniform.",
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            category: "Event",
            priority: "High"
        },
        {
            _id: '3',
            title: "End Term Practical Exam Schedule",
            content: "The date sheet for ETP (End Term Practical) exams for CSE Department has been released. Please check UMS for your invigilation duties.",
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            category: "Exam",
            priority: "High"
        },
        {
            _id: '4',
            title: "Placement Drive: Cognizant GenC",
            content: "Cognizant GenC drive scheduled for 20th Dec. Faculty mentors are requested to guide eligible students to the Shanti Devi Mittal Auditorium.",
            date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            category: "Placement",
            priority: "Medium"
        }
    ];

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/announcements');
            const data = await response.json();
            if (data.length > 0) {
                setAnnouncements(data);
            } else {
                setAnnouncements(initialData); // Fallback to LPU data if DB is empty
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setAnnouncements(initialData); // Fallback on error
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAnnouncement),
            });
            const data = await response.json();
            setAnnouncements([data, ...announcements]);
            setShowModal(false);
            setNewAnnouncement({ title: '', content: '', category: 'General', priority: 'Medium' });
        } catch (error) {
            console.error('Error creating announcement:', error);
            // Fallback for demo if backend fails
            const mockNew = { ...newAnnouncement, _id: Date.now().toString(), date: new Date().toISOString() };
            setAnnouncements([mockNew, ...announcements]);
            setShowModal(false);
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Academic': return 'bg-blue-500';
            case 'Event': return 'bg-purple-500';
            case 'System': return 'bg-gray-500';
            case 'Placement': return 'bg-green-600';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar activeTab="announcements" />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-6">
                            <img src={announcementsIllustration} alt="Announcements" className="w-24 h-24 object-contain hidden md:block" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                                <p className="text-gray-500 mt-1">Stay updated with the latest news and events.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-[#002E6E] hover:bg-white hover:text-[#002E6E] hover:border-[#002E6E] hover:border-2 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center border-2 border-transparent"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Post
                        </button>
                    </div>

                    {/* Announcements List */}
                    <div className="space-y-6">
                        {announcements.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                            >
                                {/* Icon */}
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                                    <span className={`w-3 h-3 rounded-full ${getCategoryColor(item.category)}`}></span>
                                </div>

                                {/* Card */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-1 rounded text-white ${getCategoryColor(item.category)}`}>{item.category}</span>
                                        <time className="font-caveat font-medium text-gray-500 text-sm">
                                            {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </time>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="bg-paypal-dark p-6 text-white flex justify-between items-center">
                                <h2 className="text-xl font-bold">New Announcement</h2>
                                <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paypal-light focus:border-transparent"
                                        value={newAnnouncement.title}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                        placeholder="e.g., Exam Schedule Released"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paypal-light focus:border-transparent"
                                        value={newAnnouncement.category}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Academic</option>
                                        <option>Event</option>
                                        <option>Placement</option>
                                        <option>Exam</option>
                                        <option>System</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea
                                        required
                                        rows="4"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paypal-light focus:border-transparent"
                                        value={newAnnouncement.content}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                        placeholder="Enter announcement details..."
                                    ></textarea>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-2">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-paypal-light text-white rounded-lg hover:bg-white hover:text-[#00BAF2] hover:border-[#00BAF2] hover:border-2 transition-all font-medium border-2 border-transparent">Post Announcement</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Announcements;
