import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, CalendarIcon, UsersIcon, ChartBarIcon, ArrowLeftOnRectangleIcon, PaperAirplaneIcon, InboxIcon, ClockIcon, BellAlertIcon, UserCircleIcon, QuestionMarkCircleIcon, SunIcon, MoonIcon, BriefcaseIcon, CalendarDaysIcon, ClipboardDocumentCheckIcon, LifebuoyIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import FlowerBackground from './FlowerBackground';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { logout, currentUser, notifications, markAllRead } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: HomeIcon, path: '/dashboard' },

        // Items for Admin only
        ...(currentUser?.role === 'admin' ? [
            { id: 'manage-teachers', label: 'Manage Teachers', icon: BriefcaseIcon, path: '/manage-teachers' },
            { id: 'leave-requests', label: 'Leave Requests', icon: InboxIcon, path: '/leave-requests' },
        ] : []),

        // Items for Non-Admin (Teachers/Students)
        ...(currentUser?.role !== 'admin' ? [
            { id: 'schedule', label: 'Mark Attendance', icon: CalendarIcon, path: '/attendance' },
        ] : []),

        { id: 'academic-calendar', label: 'Academic Calendar', icon: CalendarDaysIcon, path: '/academic-calendar' },

        { id: 'support', label: 'Faculty Support', icon: LifebuoyIcon, path: '/support' },
        { id: 'examination', label: 'Exams & Duties', icon: ClipboardDocumentCheckIcon, path: '/examination' },

        { id: 'timetable', label: 'Timetable', icon: ClockIcon, path: '/timetable' },
        { id: 'students', label: 'Students', icon: UsersIcon, path: '/students' },
        { id: 'reports', label: 'Reports', icon: ChartBarIcon, path: '/reports' },
        { id: 'leave', label: 'Apply Leave', icon: PaperAirplaneIcon, path: '/leave' },

        // 'Leave Requests' was here previously, now moved to Admin Only block

        { id: 'announcements', label: 'Announcements', icon: BellAlertIcon, path: '/announcements' },
        { id: 'profile', label: 'Profile', icon: UserCircleIcon, path: '/profile' },
        { id: 'help', label: 'Help', icon: QuestionMarkCircleIcon, path: '/help' },
    ];

    return (
        <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="h-screen w-64 bg-[#002E6E]/95 backdrop-blur-md text-white fixed left-0 top-0 flex flex-col shadow-2xl z-20 border-r border-white/10"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <FlowerBackground />
            </div>

            <div className="p-6 border-b border-white/10 relative z-10">
                <h1 className="text-2xl font-bold tracking-wider">
                    Attend<span className="text-[#00BAF2]">Sys</span>
                </h1>
                <p className="text-xs text-gray-300 mt-1">Teacher Portal</p>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id || window.location.pathname === item.path;
                    return (
                        <motion.button
                            key={item.id}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden group ${isActive
                                ? 'bg-gradient-to-r from-[#00BAF2] to-[#0090c0] text-white shadow-lg'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/20"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <Icon className={`w-6 h-6 relative z-10 ${isActive ? 'animate-pulse' : ''}`} />
                            <span className="font-medium relative z-10">{item.label}</span>
                            {!isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 bg-[#002559]/50 relative z-10">
                {/* User Profile Section */}
                <div className="flex items-center gap-1 mb-3">
                    <Link to="/profile" className="flex-1 min-w-0 block group">
                        <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00BAF2] to-[#005a75] flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
                                {currentUser?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="overflow-hidden flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate group-hover:text-[#00BAF2] transition-colors">{currentUser?.name || 'User'}</p>
                                <p className="text-[10px] text-gray-400 truncate leading-tight">
                                    {currentUser?.role === 'admin' ? 'Administrator' :
                                        currentUser?.role === 'teacher' ? 'Assistant Professor' :
                                            (currentUser?.role || 'Instructor')}
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Notification Bell */}
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`p-1.5 rounded-full transition-colors text-white relative ${showNotifications ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        >
                            <BellAlertIcon className="w-5 h-5" />
                            {/* Notification Badge */}
                            {notifications.length > 0 && (
                                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full animate-pulse border border-[#002559]">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {/* Dropdown Logic */}
                        <AnimatePresence>
                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-12 left-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                                    >
                                        <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                                            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Notifications</h3>
                                            {notifications.length > 0 && (
                                                <button onClick={markAllRead} className="text-xs text-[#00BAF2] hover:underline">
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center text-gray-400 text-sm">
                                                    No new notifications
                                                </div>
                                            ) : (
                                                notifications.map((note, i) => (
                                                    <div key={i} className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{note.title}</span>
                                                            <span className="text-[10px] text-gray-400">
                                                                {note.time || (note.createdAt ? new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now')}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{note.message}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-yellow-400 flex-shrink-0"
                        title="Toggle Theme"
                    >
                        {theme === 'light' ? <MoonIcon className="w-5 h-5 text-gray-300" /> : <SunIcon className="w-5 h-5" />}
                    </button>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:bg-white hover:text-red-600 transition-colors border-2 border-transparent hover:border-red-600 shadow-sm"
                >
                    <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                    <span className="font-medium">Logout</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
