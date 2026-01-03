import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import {
    WrenchScrewdriverIcon,
    ClipboardDocumentListIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    PlusIcon,
    LifebuoyIcon,
    ShieldCheckIcon,
    ChatBubbleBottomCenterTextIcon,
    DocumentMagnifyingGlassIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Support = () => {
    const { currentUser } = useAuth();
    const isTeacher = currentUser?.role === 'teacher';
    const isAdmin = currentUser?.role === 'admin';

    const [activeTab, setActiveTab] = useState(isTeacher ? 'create' : 'all');
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
        category: 'Classroom Hardware',
        location: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Fetch Requests
    useEffect(() => {
        if (activeTab === 'history' || activeTab === 'all') {
            fetchRequests();
        }
    }, [activeTab]);

    const fetchRequests = async () => {
        try {
            const endpoint = isAdmin ? '/api/rms/all' : '/api/rms/my';
            const res = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/rms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setShowSuccess(true);
                setFormData({ category: 'Classroom Hardware', location: '', description: '' });
                setTimeout(() => {
                    setShowSuccess(false);
                    setActiveTab('history');
                }, 2000);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    // Handle Status Update (Admin)
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/rms/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Request marked as ${newStatus}`);
                fetchRequests();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const categories = [
        'Classroom Hardware',
        'Lab Software/Network',
        'Electrical Issue',
        'Cleanliness/Hygiene',
        'Furniture/Infrastructure',
        'Examination Support',
        'Other'
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Sidebar activeTab="support" />

            <div className="flex-1 flex flex-col ml-64 relative bg-[#F4F7FE]">

                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-8 py-5 flex justify-between items-center z-10 sticky top-0">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#002E6E] tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <LifebuoyIcon className="w-8 h-8 text-[#00BAF2]" />
                            </div>
                            Faculty Support Portal
                        </h1>
                        <p className="text-sm text-gray-500 font-medium ml-14">Raise tickets for IT, Infrastructure, and other issues</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
                    {/* Ambient Background Detail */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/20 to-cyan-100/20 rounded-full blur-3xl -z-10" />

                    <div className="max-w-7xl mx-auto">

                        {/* Tabs */}
                        <div className="flex space-x-4 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 w-fit">
                            {isTeacher && (
                                <button
                                    onClick={() => setActiveTab('create')}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'create'
                                        ? 'bg-[#002E6E] text-white shadow-md transform scale-105'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Raise New Ticket
                                </button>
                            )}
                            <button
                                onClick={() => setActiveTab(isTeacher ? 'history' : 'all')}
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab !== 'create'
                                    ? 'bg-[#002E6E] text-white shadow-md transform scale-105'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                            >
                                <ClipboardDocumentListIcon className="w-5 h-5" />
                                {isAdmin ? 'All Support Tickets' : 'My Ticket History'}
                            </button>
                        </div>

                        <AnimatePresence mode='wait'>
                            {activeTab === 'create' && isTeacher ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                                    {/* Form Section */}
                                    <motion.div
                                        key="create-form"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden"
                                    >
                                        {showSuccess ? (
                                            <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
                                                >
                                                    <CheckCircleIcon className="w-12 h-12" />
                                                </motion.div>
                                                <h3 className="text-3xl font-extrabold text-[#002E6E] animate-pulse">
                                                    We'll get back to you ASAP!
                                                </h3>
                                            </div>
                                        ) : null}

                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">Support Request</h2>
                                                <p className="text-gray-500 text-sm mt-1">Fill in the details below. We usually respond within 24 hours.</p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                                <WrenchScrewdriverIcon className="w-6 h-6 text-[#00BAF2]" />
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="group">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-[#00BAF2] transition-colors">Category</label>
                                                    <div className="relative">
                                                        <select
                                                            value={formData.category}
                                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                            className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-gray-200 focus:border-[#00BAF2] focus:ring-4 focus:ring-[#00BAF2]/10 bg-gray-50/50 hover:bg-gray-50 transition-all outline-none appearance-none cursor-pointer"
                                                        >
                                                            {categories.map(cat => (
                                                                <option key={cat} value={cat}>{cat}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="group">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-[#00BAF2] transition-colors">Location / Room Number</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <MapPinIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={formData.location}
                                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                            placeholder="e.g. Lab 3, Room 101"
                                                            className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#00BAF2] focus:ring-4 focus:ring-[#00BAF2]/10 bg-gray-50/50 hover:bg-gray-50 transition-all outline-none"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-[#00BAF2] transition-colors">Description</label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows="6"
                                                    placeholder="Please describe your issue in detail. Include specific error messages or details."
                                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#00BAF2] focus:ring-4 focus:ring-[#00BAF2]/10 bg-gray-50/50 hover:bg-gray-50 transition-all outline-none resize-none"
                                                    required
                                                ></textarea>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full bg-gradient-to-r from-[#002E6E] to-[#004099] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:scale-[1.01] transition-all transform active:scale-95 disabled:opacity-50 disabled:transform-none flex justify-center items-center gap-2"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PlusIcon className="w-5 h-5" />
                                                            Submit Final Ticket
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>

                                    {/* Reassurance / Info Panel */}
                                    <motion.div
                                        key="reassurance"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-gradient-to-br from-[#002E6E] to-[#001a3d] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                                            {/* Decorative circles */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00BAF2]/20 rounded-full blur-xl -ml-10 -mb-10"></div>

                                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                                <ShieldCheckIcon className="w-6 h-6 text-[#00BAF2]" />
                                                Why use this portal?
                                            </h3>

                                            <ul className="space-y-4 relative z-10">
                                                <li className="flex items-start gap-3">
                                                    <div className="bg-white/10 p-1.5 rounded-lg mt-0.5">
                                                        <ClockIcon className="w-4 h-4 text-[#00BAF2]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">Quick Response</p>
                                                        <p className="text-xs text-blue-200/70">Most tickets are resolved within 24-48 hours.</p>
                                                    </div>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="bg-white/10 p-1.5 rounded-lg mt-0.5">
                                                        <DocumentMagnifyingGlassIcon className="w-4 h-4 text-[#00BAF2]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">Transparent Tracking</p>
                                                        <p className="text-xs text-blue-200/70">Track your request status in real-time from the history tab.</p>
                                                    </div>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="bg-white/10 p-1.5 rounded-lg mt-0.5">
                                                        <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-[#00BAF2]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">Direct Admin Access</p>
                                                        <p className="text-xs text-blue-200/70">Your concerns go directly to the administration team.</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                            <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">What happens next?</h4>
                                            <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                                                <div className="relative">
                                                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#00BAF2] ring-4 ring-white"></span>
                                                    <p className="text-sm font-bold text-gray-700">Ticket Received</p>
                                                    <p className="text-xs text-gray-500">System validates and assigns a ticket ID.</p>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-200 ring-4 ring-white"></span>
                                                    <p className="text-sm font-bold text-gray-700">Processing</p>
                                                    <p className="text-xs text-gray-500">Admin reviews request and assigns team.</p>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-200 ring-4 ring-white"></span>
                                                    <p className="text-sm font-bold text-gray-700">Resolution</p>
                                                    <p className="text-xs text-gray-500">Issue fixed and marked as resolved.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ) : (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    {requests.length === 0 ? (
                                        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <ClipboardDocumentListIcon className="w-10 h-10 text-blue-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800">No Tickets Found</h3>
                                            <p className="text-gray-500 mt-2">You haven't raised any support tickets yet.</p>
                                            {isTeacher && (
                                                <button
                                                    onClick={() => setActiveTab('create')}
                                                    className="mt-6 text-[#00BAF2] font-bold hover:underline"
                                                >
                                                    Raise your first ticket
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        requests.map((req) => (
                                            <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00BAF2] to-[#002E6E] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                                    <div className="flex gap-4">
                                                        <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#002E6E] font-bold text-xl group-hover:bg-[#002E6E] group-hover:text-white transition-colors shadow-inner">
                                                            {req.category.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-800 text-lg">{req.category}</h3>
                                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                                <span className="font-mono bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium select-all border border-gray-200">
                                                                    #{req.ticketId}
                                                                </span>
                                                                <span className="flex items-center gap-1.5 text-xs">
                                                                    <ClockIcon className="w-3.5 h-3.5" />
                                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                                </span>
                                                                {req.location && (
                                                                    <span className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                                                        <MapPinIcon className="w-3 h-3" />
                                                                        {req.location}
                                                                    </span>
                                                                )}
                                                                {isAdmin && (
                                                                    <span className="text-blue-600 font-medium text-xs bg-blue-50 px-2 py-0.5 rounded-full">
                                                                        {req.user?.name}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(req.status)}`}>
                                                            {req.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50">
                                                    <p className="text-gray-600 text-sm leading-relaxed">
                                                        {req.description}
                                                    </p>
                                                </div>

                                                {isAdmin && req.status === 'Pending' && (
                                                    <div className="flex gap-3 justify-end border-t border-gray-100 pt-4 mt-4">
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, 'Resolved')}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors border border-green-200"
                                                        >
                                                            <CheckCircleIcon className="w-4 h-4" /> Approve & Resolve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors border border-red-200"
                                                        >
                                                            <XCircleIcon className="w-4 h-4" /> Reject Ticket
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Support;
