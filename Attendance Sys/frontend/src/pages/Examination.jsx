import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { ClipboardDocumentCheckIcon, ClockIcon, MapPinIcon, AcademicCapIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Examination = () => {
    const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' or 'duties'

    // Mock Data - synced with Academic Calendar
    const examSchedule = [
        { date: '2026-03-20', time: '10:00 AM - 01:00 PM', subject: 'Data Structures & Algo', code: 'CS301', type: 'Mid-Sem' },
        { date: '2026-03-22', time: '10:00 AM - 01:00 PM', subject: 'Operating Systems', code: 'CS302', type: 'Mid-Sem' },
        { date: '2026-03-24', time: '02:00 PM - 05:00 PM', subject: 'Database Management', code: 'CS303', type: 'Mid-Sem' },
        { date: '2026-05-15', time: '10:00 AM - 01:00 PM', subject: 'Advanced Mathematics', code: 'MT401', type: 'End-Sem' },
        { date: '2026-05-18', time: '10:00 AM - 01:00 PM', subject: 'Software Engineering', code: 'CS405', type: 'End-Sem' },
        { date: '2026-12-12', time: '10:00 AM - 01:00 PM', subject: 'Machine Learning', code: 'CS501', type: 'End-Sem' },
        { date: '2026-12-15', time: '10:00 AM - 01:00 PM', subject: 'Cloud Computing', code: 'CS504', type: 'End-Sem' },
    ];

    const myDuties = [
        { date: '2026-03-22', time: '09:30 AM - 01:30 PM', room: 'Block 34-304', role: 'Invigilator', exam: 'Operating Systems (CS302)' },
        { date: '2026-03-24', time: '01:30 PM - 05:30 PM', room: 'Block 34-201', role: 'Reliever', exam: 'Database Management (CS303)' },
        { date: '2026-05-18', time: '09:30 AM - 01:30 PM', room: 'Block 32-405', role: 'Chief Invigilator', exam: 'Software Engineering (CS405)' },
        { date: '2026-12-12', time: '01:30 PM - 05:30 PM', room: 'Block 55-101', role: 'Invigilator', exam: 'Machine Learning (CS501)' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Sidebar activeTab="examination" />

            <div className="flex-1 flex flex-col ml-64 relative">
                <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-8 py-5 flex justify-between items-center z-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#002E6E] tracking-tight flex items-center gap-3">
                            <ClipboardDocumentCheckIcon className="w-8 h-8 text-[#00BAF2]" />
                            Examination Cell
                        </h1>
                        <p className="text-sm text-gray-500 font-medium ml-11">Manage schedules and invigilation duties</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 relative">
                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-amber-100/40 to-orange-100/40 rounded-full blur-3xl -z-10" />

                    <div className="max-w-5xl mx-auto">

                        {/* Tabs */}
                        <div className="flex space-x-4 mb-8 bg-white p-1 rounded-2xl shadow-sm border border-gray-100 w-fit">
                            <button
                                onClick={() => setActiveTab('schedule')}
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === 'schedule'
                                    ? 'bg-[#002E6E] text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                            >
                                <AcademicCapIcon className="w-5 h-5" />
                                Exam Schedule
                            </button>
                            <button
                                onClick={() => setActiveTab('duties')}
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === 'duties'
                                    ? 'bg-amber-500 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                            >
                                <ExclamationTriangleIcon className="w-5 h-5" />
                                My Duties
                            </button>
                        </div>

                        <AnimatePresence mode='wait'>
                            {activeTab === 'schedule' ? (
                                <motion.div
                                    key="schedule"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                                >
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                        <h3 className="font-bold text-gray-800 text-lg">Upcoming Examinations</h3>
                                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Spring 2026</span>
                                    </div>
                                    <table className="w-full text-left">
                                        <thead className="bg-[#002E6E]/5 text-[#002E6E]">
                                            <tr>
                                                <th className="px-6 py-4 font-bold text-sm">Date</th>
                                                <th className="px-6 py-4 font-bold text-sm">Subject</th>
                                                <th className="px-6 py-4 font-bold text-sm">Time</th>
                                                <th className="px-6 py-4 font-bold text-sm">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {examSchedule.map((exam, idx) => (
                                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-700">{exam.date}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-800">{exam.subject}</div>
                                                        <div className="text-xs text-gray-500">{exam.code}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1.5">
                                                            <ClockIcon className="w-4 h-4" />
                                                            {exam.time}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold
                                                            ${exam.type === 'Mid-Sem' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}
                                                        `}>
                                                            {exam.type}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="duties"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    {myDuties.map((duty, idx) => (
                                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-amber-500 flex flex-col md:flex-row justify-between items-center hover:shadow-lg transition-all duration-300">
                                            <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
                                                <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                                    <span className="text-amber-600 font-bold text-xl text-center leading-tight">
                                                        {new Date(duty.date).getDate()}<br />
                                                        <span className="text-xs uppercase opacity-70">
                                                            {new Date(duty.date).toLocaleString('default', { month: 'short' })}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg mb-1">{duty.role}</h3>
                                                    <p className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                                                        <MapPinIcon className="w-4 h-4" /> {duty.room}
                                                    </p>
                                                    <p className="text-amber-600 font-medium text-xs bg-amber-50 px-2 py-0.5 rounded w-fit">
                                                        {duty.exam}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 w-full md:w-auto bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                                                <ClockIcon className="w-5 h-5 text-gray-400" />
                                                <span className="font-mono font-bold text-gray-700">{duty.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Examination;
