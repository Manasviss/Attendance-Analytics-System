import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ArrowLeftIcon, CalendarIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';

const AnnouncementDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                // In a real app, you'd fetch by ID here. 
                // For now, we might need to fetch all and find, or assume the backend has a get-by-id route.
                // Optimistically assuming generic GET /api/announcements/:id might not be implemented yet?
                // Actually, let's implement the fetching logic cleanly.
                const response = await fetch(`/api/announcements/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAnnouncement(data);
                } else {
                    console.error("Failed to fetch");
                }
            } catch (error) {
                console.error('Error fetching announcement details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncement();
    }, [id]);

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Academic': return 'bg-blue-500';
            case 'Event': return 'bg-purple-500';
            case 'System': return 'bg-gray-500';
            case 'Placement': return 'bg-green-600';
            default: return 'bg-gray-500';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-secondary dark:bg-bg-primary flex">
                <Sidebar activeTab="announcements" />
                <main className="flex-1 ml-64 p-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002E6E] dark:border-text-primary"></div>
                </main>
            </div>
        );
    }

    if (!announcement) {
        return (
            <div className="min-h-screen bg-bg-secondary dark:bg-bg-primary flex">
                <Sidebar activeTab="announcements" />
                <main className="flex-1 ml-64 p-8">
                    <div className="max-w-4xl mx-auto text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-text-primary">Announcement Not Found</h2>
                        <button onClick={() => navigate('/announcements')} className="mt-4 text-[#002E6E] hover:underline">Go Back</button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-secondary dark:bg-bg-primary flex transition-colors duration-200">
            <Sidebar activeTab="announcements" />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate('/announcements')}
                        className="flex items-center text-gray-500 dark:text-text-secondary hover:text-[#002E6E] dark:hover:text-text-primary mb-6 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Announcements
                    </button>

                    <article className="bg-white dark:bg-bg-secondary rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {announcement.image && (
                            <div className="w-full h-80 md:h-96 relative">
                                <img
                                    src={announcement.image}
                                    alt={announcement.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8 text-white">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${getCategoryColor(announcement.category)}`}>
                                        {announcement.category}
                                    </span>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 shadow-sm">{announcement.title}</h1>
                                </div>
                            </div>
                        )}

                        <div className="p-8">
                            {!announcement.image && (
                                <div className="mb-6">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${getCategoryColor(announcement.category)}`}>
                                        {announcement.category}
                                    </span>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-2">{announcement.title}</h1>
                                </div>
                            )}

                            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-text-secondary mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center">
                                    <CalendarIcon className="w-5 h-5 mr-2" />
                                    {new Date(announcement.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <div className="flex items-center">
                                    <TagIcon className="w-5 h-5 mr-2" />
                                    {announcement.priority} Priority
                                </div>
                            </div>

                            <div className="prose max-w-none text-gray-700 dark:text-text-primary prose-headings:dark:text-text-primary prose-p:dark:text-text-secondary prose-li:dark:text-text-secondary leading-relaxed whitespace-pre-line">
                                {announcement.content}
                            </div>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
};

export default AnnouncementDetail;
