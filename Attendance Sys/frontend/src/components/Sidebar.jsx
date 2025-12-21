import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, CalendarIcon, UsersIcon, ChartBarIcon, ArrowLeftOnRectangleIcon, PaperAirplaneIcon, InboxIcon, ClockIcon, BellAlertIcon, UserCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import FlowerBackground from './FlowerBackground';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: HomeIcon, path: '/dashboard' },
        { id: 'schedule', label: 'Mark Attendance', icon: CalendarIcon, path: '/attendance' },
        { id: 'timetable', label: 'Timetable', icon: ClockIcon, path: '/timetable' },
        { id: 'students', label: 'Students', icon: UsersIcon, path: '/students' },
        { id: 'reports', label: 'Reports', icon: ChartBarIcon, path: '/reports' },
        { id: 'leave', label: 'Apply Leave', icon: PaperAirplaneIcon, path: '/leave' },
        { id: 'leave-requests', label: 'Leave Requests', icon: InboxIcon, path: '/leave-requests' },
        { id: 'announcements', label: 'Announcements', icon: BellAlertIcon, path: '/announcements' },
        { id: 'profile', label: 'Profile', icon: UserCircleIcon, path: '/profile' },
        { id: 'help', label: 'Help', icon: QuestionMarkCircleIcon, path: '/help' },
    ];

    return (
        <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="h-screen w-64 bg-[#002E6E]/95 backdrop-blur-md text-white fixed left-0 top-0 flex flex-col shadow-2xl z-20 border-r border-white/10 overflow-hidden"
        >
            <FlowerBackground />

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

            <div className="p-4 border-t border-white/10 bg-[#002559]/50">
                {/* User Profile Section */}
                <Link to="/profile" className="block group">
                    <div className="flex items-center space-x-3 mb-4 px-2 p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00BAF2] to-[#005a75] flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                            {currentUser?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate group-hover:text-[#00BAF2] transition-colors">{currentUser?.name || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">{currentUser?.role || 'Instructor'}</p>
                        </div>
                    </div>
                </Link>

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
