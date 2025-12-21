import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import AttendanceChart from '../components/AttendanceChart';
import { CalendarIcon, FunnelIcon, ArrowDownTrayIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const ReportsPage = () => {
    const { currentUser, systemDate } = useAuth();
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    // Use 'en-CA' (YYYY-MM-DD) to get local date string, not UTC
    const [filterDate, setFilterDate] = useState(() => {
        const offset = systemDate.getTimezoneOffset() * 60000;
        return new Date(systemDate.getTime() - offset).toISOString().split('T')[0];
    });
    const [stats, setStats] = useState({ present: 0, absent: 0, total: 0 });

    // State for Drill-down
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [groupedData, setGroupedData] = useState([]);

    // Update filterDate when systemDate changes (optional, but good for UX)
    useEffect(() => {
        const offset = systemDate.getTimezoneOffset() * 60000;
        setFilterDate(new Date(systemDate.getTime() - offset).toISOString().split('T')[0]);
    }, [systemDate]);

    useEffect(() => {
        fetchHistory();
    }, [filterDate]);

    const fetchHistory = async () => {
        setLoading(true);
        setSelectedSubject(null); // Reset selection on date change
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/attendance/daily-report?date=${filterDate}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                // Raw data is already sorted by Date DESC from backend
                setAttendanceData(data.data);

                // Group by Subject
                const groups = {};
                data.data.forEach(record => {
                    const sub = record.subject || 'General';
                    if (!groups[sub]) {
                        groups[sub] = {
                            name: sub,
                            total: 0,
                            present: 0, // Case sensitive from backend? Usually 'Present'
                            absent: 0,
                            lastUpdated: record.date, // Track latest activity
                            records: []
                        };
                    }
                    groups[sub].total++;
                    if (record.status === 'Present' || record.status === 'present') groups[sub].present++;
                    if (record.status === 'Absent' || record.status === 'absent') groups[sub].absent++;
                    groups[sub].records.push(record);
                });

                // Convert to array and sort by "Most Recently Updated" (Top currently marked)
                const groupArray = Object.values(groups).sort((a, b) =>
                    new Date(b.lastUpdated) - new Date(a.lastUpdated)
                );

                setGroupedData(groupArray);

                // Stats (Overall)
                const present = data.data.filter(r => r.status.toLowerCase() === 'present').length;
                const absent = data.data.filter(r => r.status.toLowerCase() === 'absent').length;
                setStats({ present, absent, total: data.data.length });
            } else {
                setAttendanceData([]);
                setGroupedData([]);
                setStats({ present: 0, absent: 0, total: 0 });
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            setAttendanceData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (attendanceData.length === 0) {
            alert('No data to export');
            return;
        }

        const csvContent = [
            ['Date', 'Time', 'Student Name', 'Roll Number', 'Status', 'Marked By'],
            ...attendanceData.map(record => [
                new Date(record.date).toLocaleDateString(),
                new Date(record.date).toLocaleTimeString(),
                record.studentName,
                record.rollNumber,
                record.status,
                record.markedBy
            ])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `attendance_report_${filterDate}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter Logic: If subject selected, show only those records. Else show nothing (cards view).
    const displayedRecords = selectedSubject
        ? attendanceData.filter(r => (r.subject || 'General') === selectedSubject)
        : [];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar activeTab="reports" />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
                            <p className="text-gray-500">
                                {selectedSubject ? (
                                    <span className="flex items-center space-x-2">
                                        <span
                                            onClick={() => setSelectedSubject(null)}
                                            className="cursor-pointer hover:text-[#00BAF2] hover:underline"
                                        >
                                            Subjects
                                        </span>
                                        <span>/</span>
                                        <span className="font-semibold text-gray-900">{selectedSubject}</span>
                                    </span>
                                ) : (
                                    "Daily Overview by Subject"
                                )}
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            {!selectedSubject && (
                                <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
                                    <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
                                    <input
                                        type="date"
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                        className="outline-none text-gray-700"
                                    />
                                </div>
                            )}
                            {selectedSubject && (
                                <button
                                    onClick={() => setSelectedSubject(null)}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Back to Subjects
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Daily Stats Summary - Only show on Overview */}
                    {!selectedSubject && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 font-medium uppercase">Total Records</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm text-green-600 font-medium uppercase">Present</p>
                                <p className="text-3xl font-bold text-green-700 mt-2">{stats.present}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm text-red-600 font-medium uppercase">Absent</p>
                                <p className="text-3xl font-bold text-red-700 mt-2">{stats.absent}</p>
                            </div>
                        </div>
                    )}

                    {/* VIEW 1: SUBJECT CARDS (Default) */}
                    {!selectedSubject && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {groupedData.map(group => (
                                <div
                                    key={group.name}
                                    onClick={() => setSelectedSubject(group.name)}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-[#00BAF2] transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            <ChartBarIcon className="w-6 h-6 text-[#00BAF2]" />
                                        </div>
                                        <span className="text-xs font-mono text-gray-400">
                                            {new Date(group.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{group.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{group.total} Records Processed</p>

                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center text-green-600">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            {group.present} Present
                                        </div>
                                        <div className="flex items-center text-red-600">
                                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                            {group.absent} Absent
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {groupedData.length === 0 && !loading && (
                                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                                    No attendance records found for {filterDate}.
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW 2: DETAILED TABLE (Drill-down) */}
                    {selectedSubject && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-semibold text-gray-700">Detailed Log: {selectedSubject}</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase">Time</th>
                                            <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase">Student Name</th>
                                            <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase">Roll No</th>
                                            <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {displayedRecords.map((record) => (
                                            <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#00BAF2] font-bold text-xs">
                                                            {record.studentName.charAt(0)}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{record.studentName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                                                    {record.rollNumber || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status.toLowerCase() === 'present'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReportsPage;
