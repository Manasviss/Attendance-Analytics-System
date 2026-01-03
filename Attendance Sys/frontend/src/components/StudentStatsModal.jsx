import { useState, useEffect } from 'react';
import { XMarkIcon, UserCircleIcon, AcademicCapIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const StudentStatsModal = ({ student, onClose }) => {
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [stats, setStats] = useState({ present: 0, absent: 0, total: 0, percentage: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (student?._id) {
            fetchStudentStats();
        }
    }, [student]);

    const fetchStudentStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Fetch attendance history for this student
            const response = await fetch(`/api/attendance/${student._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                const history = data.data;
                setAttendanceHistory(history);

                // Calculate stats
                const total = history.length;
                const present = history.filter(r => r.status === 'Present').length;
                const absent = history.filter(r => r.status === 'Absent').length;
                const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

                setStats({ present, absent, total, percentage });
            }
        } catch (error) {
            console.error('Error fetching student stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!student) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#002E6E] p-6 text-white flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                            <UserCircleIcon className="w-12 h-12 text-[#00BAF2]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{student.name}</h2>
                            <div className="flex items-center space-x-4 text-blue-200 text-sm mt-1">
                                <span className="flex items-center"><AcademicCapIcon className="w-4 h-4 mr-1" /> {student.rollNumber}</span>
                                <span className="px-2 py-0.5 bg-white/20 rounded text-xs">{student.class} - {student.section}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <XMarkIcon className="w-8 h-8" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Attendance</p>
                            <p className={`text-3xl font-extrabold mt-1 ${stats.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                {stats.percentage}%
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Classes</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                            <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Present</p>
                            <p className="text-2xl font-bold text-green-700 mt-1">{stats.present}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                            <p className="text-xs text-red-600 font-bold uppercase tracking-wider">Absent</p>
                            <p className="text-2xl font-bold text-red-700 mt-1">{stats.absent}</p>
                        </div>
                    </div>

                    {/* History List */}
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                        <CalendarDaysIcon className="w-5 h-5 mr-2 text-[#00BAF2]" />
                        Recent Activity
                    </h3>

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading history...</div>
                    ) : attendanceHistory.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            No attendance records found.
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Marked By</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {attendanceHistory.map((record) => (
                                        <tr key={record._id} className="hover:bg-gray-50/50">
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {record.markedBy?.name || 'Teacher'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentStatsModal;
