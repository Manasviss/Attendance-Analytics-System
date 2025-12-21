import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Timetable = () => {
    const [activeDay, setActiveDay] = useState('Monday');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Mock data for timetable
    const schedule = {
        'Monday': [
            { time: '09:00 - 10:00', subject: 'Advanced Web Development', code: 'INT222', room: '34-601', type: 'Lecture' },
            { time: '10:00 - 11:00', subject: 'Database Management', code: 'INT221', room: '34-602', type: 'Lecture' },
            { time: '11:00 - 12:00', subject: 'Break', type: 'Break' },
            { time: '12:00 - 14:00', subject: 'Web Dev Lab', code: 'INT222', room: '34-Lab-1', type: 'Lab' },
        ],
        'Tuesday': [
            { time: '09:00 - 10:00', subject: 'Operating Systems', code: 'CSE316', room: '34-603', type: 'Lecture' },
            { time: '10:00 - 12:00', subject: 'OS Lab', code: 'CSE316', room: '34-Lab-2', type: 'Lab' },
            { time: '12:00 - 13:00', subject: 'Break', type: 'Break' },
            { time: '13:00 - 14:00', subject: 'Soft Skills', code: 'PEL131', room: '34-605', type: 'Lecture' },
        ],
        'Wednesday': [
            { time: '09:00 - 10:00', subject: 'Advanced Web Development', code: 'INT222', room: '34-601', type: 'Lecture' },
            { time: '10:00 - 11:00', subject: 'Mathematics', code: 'MTH174', room: '34-604', type: 'Lecture' },
            { time: '11:00 - 12:00', subject: 'Break', type: 'Break' },
            { time: '12:00 - 13:00', subject: 'Database Management', code: 'INT221', room: '34-602', type: 'Lecture' },
        ],
        'Thursday': [
            { time: '09:00 - 11:00', subject: 'DBMS Lab', code: 'INT221', room: '34-Lab-3', type: 'Lab' },
            { time: '11:00 - 12:00', subject: 'Break', type: 'Break' },
            { time: '12:00 - 13:00', subject: 'Operating Systems', code: 'CSE316', room: '34-603', type: 'Lecture' },
        ],
        'Friday': [
            { time: '09:00 - 10:00', subject: 'Mathematics', code: 'MTH174', room: '34-604', type: 'Lecture' },
            { time: '10:00 - 11:00', subject: 'Soft Skills', code: 'PEL131', room: '34-605', type: 'Lecture' },
            { time: '11:00 - 13:00', subject: 'Project Work', code: 'INT222', room: '34-Lab-1', type: 'Lab' },
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar activeTab="timetable" />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">Class Timetable</h1>

                    {/* Day Selector */}
                    <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
                        {days.map(day => (
                            <button
                                key={day}
                                onClick={() => setActiveDay(day)}
                                className={`px-6 py-2 rounded-full font-semibold transition-all ${activeDay === day
                                        ? 'bg-[#002E6E] text-white shadow-lg transform scale-105'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Schedule Grid */}
                    <div className="space-y-4">
                        {schedule[activeDay].map((slot, index) => (
                            <div
                                key={index}
                                className={`p-6 rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md ${slot.type === 'Break'
                                        ? 'bg-gray-100 border-gray-300 opacity-75'
                                        : slot.type === 'Lab'
                                            ? 'bg-purple-50 border-purple-500'
                                            : 'bg-white border-[#00BAF2]'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div className="flex items-center mb-4 md:mb-0">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${slot.type === 'Break' ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-[#002E6E]'
                                            }`}>
                                            <ClockIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{slot.subject}</h3>
                                            {slot.code && <span className="text-sm text-gray-500 font-mono">{slot.code} • {slot.type}</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-8">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Time</p>
                                            <p className="font-medium text-gray-900">{slot.time}</p>
                                        </div>
                                        {slot.room && (
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Room</p>
                                                <div className="flex items-center justify-end font-medium text-gray-900">
                                                    <MapPinIcon className="w-4 h-4 mr-1 text-gray-400" />
                                                    {slot.room}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Timetable;
