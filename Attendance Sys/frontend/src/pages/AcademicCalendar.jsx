import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, SparklesIcon } from '@heroicons/react/24/outline';

const AcademicCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Comprehensive Indian College Events Data (2025-2026)
    const events = {
        // Fall Semester 2025
        "2025-07-20": [{ title: "Fall Semester Begins", type: "academic" }],
        "2025-08-15": [{ title: "Independence Day", type: "holiday" }],
        "2025-08-30": [{ title: "Raksha Bandhan", type: "holiday" }],
        "2025-09-05": [{ title: "Teachers' Day Celebration", type: "event" }],
        "2025-09-07": [{ title: "Janmashtami", type: "holiday" }],
        "2025-09-15": [{ title: "Engineers' Day (Tech Talks)", type: "event" }],
        "2025-09-19": [{ title: "Ganesh Chaturthi", type: "holiday" }],
        "2025-10-02": [{ title: "Gandhi Jayanti", type: "holiday" }],
        "2025-10-15": [{ title: "Mid-Semester Exams Begin", type: "exam" }],
        "2025-10-24": [{ title: "Dussehra (Vijayadashami)", type: "holiday" }],
        "2025-11-01": [{ title: "Kannada Rajyotsava / State Day", type: "holiday" }],
        "2025-11-12": [{ title: "Diwali (Deepavali)", type: "holiday" }],
        "2025-11-13": [{ title: "Govardhan Puja", type: "holiday" }],
        "2025-11-14": [{ title: "Children's Day", type: "event" }, { title: "Bhai Dooj", type: "holiday" }],
        "2025-11-20": [{ title: "Annual Sports Meet Starts", type: "event" }],
        "2025-11-27": [{ title: "Guru Nanak Jayanti", type: "holiday" }],
        "2025-12-10": [{ title: "End-Semester Exams Begin", type: "exam" }, { title: "Exam: CS501", type: "exam" }],
        "2025-12-12": [{ title: "Duty: Room 55-101", type: "duty" }],
        "2025-12-24": [{ title: "Winter Vacation Starts", type: "academic" }],
        "2025-12-25": [{ title: "Christmas", type: "holiday" }],

        // Spring Semester 2026
        "2026-01-01": [{ title: "New Year's Day", type: "holiday" }],
        "2026-01-06": [{ title: "Spring Semester Begins", type: "academic" }],
        "2026-01-14": [{ title: "Makar Sankranti / Pongal", type: "holiday" }],
        "2026-01-26": [{ title: "Republic Day", type: "holiday" }],
        "2026-02-14": [{ title: "Annual Cultural Fest 'Tarang'", type: "event" }],
        "2026-02-28": [{ title: "National Science Day", type: "event" }],
        "2026-03-08": [{ title: "Maha Shivaratri", type: "holiday" }],
        "2026-03-20": [{ title: "Mid-Semester Exams Starts", type: "exam" }, { title: "Exam: CS301 (Morning)", type: "exam" }],
        "2026-03-22": [{ title: "Exam: CS302 (Morning)", type: "exam" }, { title: "Duty: Room 304", type: "duty" }],
        "2026-03-24": [{ title: "Exam: CS303 (Evening)", type: "exam" }, { title: "Duty: Room 201", type: "duty" }],
        "2026-03-25": [{ title: "Holi", type: "holiday" }],
        "2026-03-29": [{ title: "Good Friday", type: "holiday" }],
        "2026-04-09": [{ title: "Ugadi / Gudi Padwa", type: "holiday" }],
        "2026-04-14": [{ title: "Ambedkar Jayanti", type: "holiday" }],
        "2026-05-01": [{ title: "Labor Day / May Day", type: "holiday" }],
        "2026-05-15": [{ title: "End-Semester Exams Begin", type: "exam" }],
        "2026-05-18": [{ title: "Duty: Room 405 (CS405)", type: "duty" }],
        "2026-06-01": [{ title: "Summer Vacation Starts", type: "academic" }],
    };

    const formatDateKey = (day) => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${month}-${d}`;
    };

    const getEventStyle = (type) => {
        switch (type) {
            case 'holiday': return 'bg-red-50 text-red-700 border-red-200 border-l-4 border-l-red-500';
            case 'exam': return 'bg-amber-50 text-amber-700 border-amber-200 border-l-4 border-l-amber-500';
            case 'event': return 'bg-purple-50 text-purple-700 border-purple-200 border-l-4 border-l-purple-500';
            case 'academic': return 'bg-blue-50 text-blue-700 border-blue-200 border-l-4 border-l-blue-500';
            case 'duty': return 'bg-orange-50 text-orange-700 border-orange-300 border-l-4 border-l-orange-500 font-bold';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const renderCalendar = () => {
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="min-h-[120px] bg-gray-50/30 border border-gray-100/50 backdrop-blur-sm"></div>
            );
        }

        // Days
        for (let day = 1; day <= totalDays; day++) {
            const dateKey = formatDateKey(day);
            const dayEvents = events[dateKey] || [];
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            days.push(
                <motion.div
                    key={day}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: day * 0.01 }}
                    className={`min-h-[120px] p-2 border border-gray-100 relative transition-all duration-300 group
                        ${isToday ? 'bg-blue-50/40 shadow-inner' : 'bg-white/60 hover:bg-white/90 hover:shadow-lg hover:z-10'}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full transition-all
                            ${isToday
                                ? 'bg-[#00BAF2] text-white shadow-lg shadow-blue-500/30 scale-110'
                                : 'text-gray-700 group-hover:bg-gray-100'}`}
                        >
                            {day}
                        </span>
                        {dayEvents.length > 0 && (
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </span>
                        )}
                    </div>

                    <div className="space-y-1.5 overflow-y-auto max-h-[80px] custom-scrollbar pr-1">
                        {dayEvents.map((event, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 * idx }}
                                className={`text-[10px] md:text-xs px-2 py-1 rounded shadow-sm font-medium border truncate transition-transform hover:scale-[1.02] cursor-default
                                    ${getEventStyle(event.type)}`}
                                title={event.title}
                            >
                                {event.title}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            );
        }
        return days;
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#f0f9ff] overflow-hidden">
            <Sidebar activeTab="academic-calendar" />

            <div className="flex-1 flex flex-col ml-64 relative">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] -z-10" />

                <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 px-8 py-5 flex justify-between items-center z-20">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#002E6E] tracking-tight flex items-center gap-3">
                            <CalendarDaysIcon className="w-8 h-8 text-[#00BAF2]" />
                            Academic Calendar
                        </h1>
                        <p className="text-sm text-gray-500 font-medium ml-11">2025-2026 Academic Year Schedule</p>
                    </div>

                    <div className="flex space-x-6 bg-white/50 px-4 py-2 rounded-2xl border border-white/40 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Holiday</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Exam</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50"></span>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Academic</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></span>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">My Duty</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                            {/* Calendar Navigation Header */}
                            <div className="p-6 bg-gradient-to-r from-[#002E6E] to-[#004099] text-white flex justify-between items-center relative overflow-hidden">
                                {/* Decor */}
                                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                    <SparklesIcon className="w-96 h-96 absolute -top-20 -right-20 text-white animate-pulse duration-[5000ms]" />
                                </div>

                                <button
                                    onClick={prevMonth}
                                    className="p-3 hover:bg-white/20 rounded-xl transition-all active:scale-95 backdrop-blur-sm z-10"
                                >
                                    <ChevronLeftIcon className="w-6 h-6" />
                                </button>

                                <div className="text-center z-10">
                                    <h2 className="text-3xl font-bold tracking-wide drop-shadow-md">
                                        {monthNames[currentDate.getMonth()]}
                                    </h2>
                                    <p className="text-blue-200 font-medium text-lg mt-1">{currentDate.getFullYear()}</p>
                                </div>

                                <button
                                    onClick={nextMonth}
                                    className="p-3 hover:bg-white/20 rounded-xl transition-all active:scale-95 backdrop-blur-sm z-10"
                                >
                                    <ChevronRightIcon className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Calendar Grid Header */}
                            <div className="grid grid-cols-7 bg-[#f8fafc] border-b border-gray-200">
                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                                    <div key={day} className={`py-4 text-center text-xs font-bold uppercase tracking-widest
                                        ${i === 0 || i === 6 ? 'text-red-400' : 'text-gray-500'}`}>
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid Body */}
                            <div className="grid grid-cols-7 bg-gray-100/50 gap-px border-l border-t border-gray-200">
                                {renderCalendar()}
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AcademicCalendar;
