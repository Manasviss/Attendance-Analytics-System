import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import announcementsIllustration from '../assets/announcements_illustration.png';
import { API_BASE_URL } from '../config';

const MagnifyingDot = ({ category, mouseY, onClick }) => {
    const dotRef = useRef(null);
    const [yPos, setYPos] = useState(0);

    const updatePos = () => {
        if (dotRef.current) {
            const rect = dotRef.current.getBoundingClientRect();
            setYPos(rect.top + rect.height / 2);
        }
    };

    useEffect(() => {
        updatePos();
        window.addEventListener('scroll', updatePos);
        window.addEventListener('resize', updatePos);
        return () => {
            window.removeEventListener('scroll', updatePos);
            window.removeEventListener('resize', updatePos);
        };
    }, []);

    const distance = useTransform(mouseY, (val) => Math.abs(val - yPos));
    const scaleSync = useTransform(distance, [0, 100], [2.0, 1]); // Max scale 2.0
    const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'Academic': return 'bg-blue-500';
            case 'Event': return 'bg-purple-500';
            case 'System': return 'bg-gray-500';
            case 'Placement': return 'bg-green-600';
            case 'Admin': return 'bg-red-500';
            case 'Exam': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <motion.div
            ref={dotRef}
            style={{ scale }}
            onClick={onClick}
            className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-white shadow-lg shrink-0 z-20 cursor-pointer overflow-hidden relative md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}
        >
            <span className={`w-full h-full rounded-full ${getCategoryColor(category)} opacity-80`}></span>
        </motion.div>
    );
};

const Announcements = () => {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // For Drag to Scroll
    const containerRef = useRef(null);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        fetchAnnouncements();

        const handleMouseMove = (e) => {
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const fetchAnnouncements = async () => {
        try {
            // Using API_BASE_URL instead of hardcoded localhost
            const response = await fetch(`${API_BASE_URL}/api/announcements`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setAnnouncements(data);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    // Drag to scroll logic
    const isDragging = useRef(false);
    const startY = useRef(0);
    const scrollTop = useRef(0);

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startY.current = e.clientY;
        scrollTop.current = window.scrollY;
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    };

    const handleMouseMoveDrag = (e) => {
        if (!isDragging.current) return;
        const deltaY = e.clientY - startY.current;
        window.scrollTo(0, scrollTop.current - deltaY * 2);
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMoveDrag);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMoveDrag);
        };
    }, []);

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Academic': return 'bg-blue-500';
            case 'Event': return 'bg-purple-500';
            case 'System': return 'bg-gray-500';
            case 'Placement': return 'bg-green-600';
            case 'Admin': return 'bg-red-500';
            case 'Exam': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        category: 'General',
        priority: 'Medium'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/announcements`, {
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
            console.error(error);
        }
    };

    return (
        <div
            className="min-h-screen bg-bg-secondary dark:bg-bg-primary flex"
            onMouseDown={handleMouseDown}
        >
            <Sidebar activeTab="announcements" />

            <main className="flex-1 ml-64 p-8 relative">
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2 z-0" />

                <div className="max-w-4xl mx-auto z-10 relative">
                    <div className="flex items-center justify-between mb-12 bg-white/80 dark:bg-bg-secondary/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-4 z-30">
                        <div className="flex items-center gap-6">
                            <img src={announcementsIllustration} alt="Announcements" className="w-24 h-24 object-contain hidden md:block" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary">Announcements</h1>
                                <p className="text-gray-500 dark:text-text-secondary mt-1">Stay updated with the latest news and events.</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="bg-[#002E6E] hover:bg-white hover:text-[#002E6E] hover:border-[#002E6E] hover:border-2 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center border-2 border-transparent"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Post
                        </button>
                    </div>

                    <div className="space-y-12 pb-20" ref={containerRef}>
                        {!loading && announcements.length === 0 && (
                            <div className="text-center py-20 bg-white/50 dark:bg-bg-secondary/50 rounded-2xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-text-secondary text-lg">No announcements posted yet.</p>
                                <button onClick={(e) => { e.stopPropagation(); setShowModal(true); }} className="mt-4 text-blue-600 dark:text-blue-400 font-bold hover:underline z-50 relative pointer-events-auto">Create the first post</button>
                            </div>
                        )}

                        {announcements.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group select-none"
                            >
                                <MagnifyingDot
                                    category={item.category}
                                    mouseY={mouseY}
                                    onClick={(e) => { e.stopPropagation(); navigate(`/announcements/${item._id}`); }}
                                />

                                <div
                                    className="w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] bg-white dark:bg-bg-secondary p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all relative cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(); navigate(`/announcements/${item._id}`); }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                            draggable="false"
                                        />
                                    )}
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-1 rounded text-white ${getCategoryColor(item.category)}`}>{item.category}</span>
                                        <time className="font-caveat font-medium text-text-secondary text-sm">
                                            {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </time>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-text-primary mb-2 line-clamp-1">{item.title}</h3>
                                    <p className="text-gray-600 dark:text-text-secondary text-sm leading-relaxed line-clamp-2">{item.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => e.stopPropagation()}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-bg-secondary rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-text-primary mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paypal-light focus:border-transparent dark:bg-white"
                                        value={newAnnouncement.title}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                        placeholder="e.g., Exam Schedule Released"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-text-primary mb-1">Category</label>
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paypal-light focus:border-transparent dark:bg-white"
                                        value={newAnnouncement.category}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Academic</option>
                                        <option>Event</option>
                                        <option>Placement</option>
                                        <option>Exam</option>
                                        <option>System</option>
                                        <option>Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-text-primary mb-1">Content</label>
                                    <textarea
                                        required
                                        rows="4"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paypal-light focus:border-transparent dark:bg-white"
                                        value={newAnnouncement.content}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                        placeholder="Enter announcement details..."
                                    ></textarea>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 dark:text-text-primary hover:bg-gray-100 dark:hover:bg-gray-200 rounded-lg mr-2">Cancel</button>
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
