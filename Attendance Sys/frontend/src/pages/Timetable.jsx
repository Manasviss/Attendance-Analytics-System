import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { ClockIcon, MapPinIcon, BookOpenIcon, AcademicCapIcon, BeakerIcon } from '@heroicons/react/24/outline';

const Timetable = () => {
    const { currentUser } = useAuth();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const initialDay = days.includes(currentDayName) ? currentDayName : 'Monday';

    const [activeDay, setActiveDay] = useState(initialDay);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    // Helper to check if a slot is currently active
    const isCurrentSlot = (timeRange) => {
        if (activeDay !== currentDayName) return false;

        const [start, end] = timeRange.split(' - ');

        // Convert "09:00" to minutes from midnight
        const toMinutes = (t) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        return currentMinutes >= toMinutes(start) && currentMinutes < toMinutes(end);
    };

    // Constants for aesthetics
    const getSubjectIcon = (type) => {
        if (type === 'Lab') return BeakerIcon;
        if (type === 'Break') return ClockIcon;
        return BookOpenIcon;
    };

    const getSlotStyles = (type, isNow) => {
        if (isNow) return 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-500/30 border-transparent';

        switch (type) {
            case 'Lab': return 'bg-purple-50 border-purple-200 text-purple-900 hover:border-purple-300';
            case 'Break': return 'bg-gray-50 border-gray-200 text-gray-500 font-medium italic opacity-80';
            default: return 'bg-white border-gray-200 text-gray-800 hover:border-blue-300';
        }
    };

    // Mock data for timetable
    const schedule = {
        'Monday': [
            { time: '09:00 - 10:00', subject: 'Advanced Web Development', code: 'INT222', room: '34-601', type: 'Lecture', instructor: 'Dr. Smith' },
            { time: '10:00 - 11:00', subject: 'Database Management', code: 'INT221', room: '34-602', type: 'Lecture', instructor: 'Prof. Johnson' },
            { time: '11:00 - 12:00', subject: 'Lunch Break', type: 'Break' },
            { time: '12:00 - 14:00', subject: 'Web Dev Lab', code: 'INT222', room: '34-Lab-1', type: 'Lab', instructor: 'Dr. Smith' },
        ],
        'Tuesday': [
            { time: '09:00 - 10:00', subject: 'Operating Systems', code: 'CSE316', room: '34-603', type: 'Lecture', instructor: 'Mrs. Davis' },
            { time: '10:00 - 12:00', subject: 'OS Lab', code: 'CSE316', room: '34-Lab-2', type: 'Lab', instructor: 'Mrs. Davis / TA' },
            { time: '12:00 - 13:00', subject: 'Lunch Break', type: 'Break' },
            { time: '13:00 - 14:00', subject: 'Soft Skills', code: 'PEL131', room: '34-605', type: 'Lecture', instructor: 'Mr. Brown' },
        ],
        'Wednesday': [
            { time: '09:00 - 10:00', subject: 'Advanced Web Development', code: 'INT222', room: '34-601', type: 'Lecture', instructor: 'Dr. Smith' },
            { time: '10:00 - 11:00', subject: 'Mathematics', code: 'MTH174', room: '34-604', type: 'Lecture', instructor: 'Dr. Alan' },
            { time: '11:00 - 12:00', subject: 'Lunch Break', type: 'Break' },
            { time: '12:00 - 13:00', subject: 'Database Management', code: 'INT221', room: '34-602', type: 'Lecture', instructor: 'Prof. Johnson' },
        ],
        'Thursday': [
            { time: '09:00 - 11:00', subject: 'DBMS Lab', code: 'INT221', room: '34-Lab-3', type: 'Lab', instructor: 'Prof. Johnson' },
            { time: '11:00 - 12:00', subject: 'Lunch Break', type: 'Break' },
            { time: '12:00 - 13:00', subject: 'Operating Systems', code: 'CSE316', room: '34-603', type: 'Lecture', instructor: 'Mrs. Davis' },
        ],
        'Friday': [
            { time: '09:00 - 10:00', subject: 'Mathematics', code: 'MTH174', room: '34-604', type: 'Lecture', instructor: 'Dr. Alan' },
            { time: '10:00 - 11:00', subject: 'Soft Skills', code: 'PEL131', room: '34-605', type: 'Lecture', instructor: 'Mr. Brown' },
            { time: '11:00 - 13:00', subject: 'Project Work / Self Study', code: 'INT222', room: '34-Lab-1', type: 'Lab', instructor: 'N/A' },
        ]
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Sidebar activeTab="timetable" />

            <div className="flex-1 flex flex-col ml-64 relative">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-8 py-5 flex justify-between items-center z-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#002E6E] tracking-tight flex items-center gap-3">
                            <ClockIcon className="w-8 h-8 text-[#00BAF2]" />
                            Class Schedule
                        </h1>
                        <p className="text-sm text-gray-500 font-medium ml-11">Manage your weekly classes and labs</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-blue-800 text-sm font-semibold flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                            Current Time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 relative">
                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -z-10" />

                    <div className="max-w-5xl mx-auto">

                        {/* Day Selector */}
                        <div className="flex justify-between items-center mb-8 overflow-x-auto pb-2 gap-2 no-scrollbar">
                            {days.map(day => {
                                const isSelected = activeDay === day;
                                const isToday = day === currentDayName;
                                return (
                                    <button
                                        key={day}
                                        onClick={() => setActiveDay(day)}
                                        className={`relative px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex-1 min-w-[120px] text-center
                                            ${isSelected
                                                ? 'bg-[#002E6E] text-white shadow-lg shadow-blue-900/20 scale-105'
                                                : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 hover:text-gray-700'
                                            }`}
                                    >
                                        <span className="block text-xs uppercase tracking-wider opacity-70 mb-0.5">
                                            {isToday ? 'Today' : day.substring(0, 3)}
                                        </span>
                                        <span className="text-lg">{day}</span>

                                        {isToday && !isSelected && (
                                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#00BAF2] rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Timeline / Schedule */}
                        <motion.div
                            key={activeDay}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            {schedule[activeDay]?.map((slot, index) => {
                                const isNow = isCurrentSlot(slot.time);
                                const Icon = getSubjectIcon(slot.type);

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`relative group rounded-2xl p-6 border transition-all duration-300 shadow-sm hover:shadow-md
                                            ${getSlotStyles(slot.type, isNow)}
                                            ${isNow ? 'scale-[1.02] ring-4 ring-blue-500/10 z-10' : ''}
                                        `}
                                    >
                                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                            {/* Time Column */}
                                            <div className="md:w-32 flex-shrink-0">
                                                <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${isNow ? 'text-blue-100' : 'text-gray-400'}`}>
                                                    Time
                                                </div>
                                                <div className="text-xl font-bold font-mono tracking-tight">
                                                    {slot.time}
                                                </div>
                                            </div>

                                            {/* Subject Info */}
                                            <div className="flex-1 flex items-start gap-4">
                                                <div className={`p-3 rounded-xl flex-shrink-0 ${isNow ? 'bg-white/20' : 'bg-gray-100'}`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold leading-tight mb-1">{slot.subject}</h3>
                                                    {slot.type !== 'Break' && (
                                                        <div className={`flex flex-wrap gap-2 text-sm ${isNow ? 'text-blue-100' : 'text-gray-500'}`}>
                                                            <span className="flex items-center gap-1 bg-black/5 px-2 py-0.5 rounded">
                                                                <span className="font-semibold">{slot.code}</span>
                                                            </span>
                                                            <span className="flex items-center gap-2 bg-white/20 px-2 py-0.5 rounded">
                                                                <AcademicCapIcon className="w-4 h-4 opacity-70" />
                                                                {currentUser?.name || 'You'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Location */}
                                            {slot.room && (
                                                <div className="md:text-right flex-shrink-0 flex md:block items-center gap-2">
                                                    <div className={`hidden md:block text-sm font-bold uppercase tracking-wider mb-1 ${isNow ? 'text-blue-100' : 'text-gray-400'}`}>
                                                        Location
                                                    </div>
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold text-sm
                                                        ${isNow
                                                            ? 'bg-white/20 border-white/30 text-white'
                                                            : 'bg-white border-gray-200 text-gray-700'
                                                        }`}>
                                                        <MapPinIcon className="w-4 h-4" />
                                                        {slot.room}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* "Happening Now" Badge */}
                                        {isNow && (
                                            <div className="absolute -top-3 left-6 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                                HAPPENING NOW
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Timetable;
