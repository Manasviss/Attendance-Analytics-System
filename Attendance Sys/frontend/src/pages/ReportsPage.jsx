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

    const [selectedSection, setSelectedSection] = useState('All');
    const [stats, setStats] = useState({ present: 0, absent: 0, total: 0 });

    // State for Drill-down
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [groupedData, setGroupedData] = useState([]);

    const sections = ['All', 'K23DF', 'K23GH', 'K23KV', 'K23KR'];

    // Update filterDate when systemDate changes (optional, but good for UX)
    useEffect(() => {
        const offset = systemDate.getTimezoneOffset() * 60000;
        setFilterDate(new Date(systemDate.getTime() - offset).toISOString().split('T')[0]);
    }, [systemDate]);

    useEffect(() => {
        fetchHistory();
    }, [filterDate, selectedSection]);

    const fetchHistory = async () => {
        setLoading(true);
        setSelectedSubject(null); // Reset selection on refresh
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/attendance/daily-report?date=${filterDate}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                // FILTER BY SECTION (Client Side)
                const filteredData = selectedSection === 'All'
                    ? data.data
                    : data.data.filter(r => r.section === selectedSection);

                setAttendanceData(filteredData);

                // Group by Subject
                const groups = {};
                filteredData.forEach(record => {
                    const sub = record.subject || 'General';
                    if (!groups[sub]) {
                        groups[sub] = {
                            name: sub,
                            total: 0,
                            present: 0,
                            absent: 0,
                            lastUpdated: record.date, // Track latest activity
                            records: []
                        };
                    }
                    groups[sub].total++;
                    if (record.status.toLowerCase() === 'present') groups[sub].present++;
                    if (record.status.toLowerCase() === 'absent') groups[sub].absent++;
                    groups[sub].records.push(record);
                });

                // Convert to array and sort by "Most Recently Updated"
                const groupArray = Object.values(groups).sort((a, b) =>
                    new Date(b.lastUpdated) - new Date(a.lastUpdated)
                );

                setGroupedData(groupArray);

                // Stats (Overall for current section filter)
                const present = filteredData.filter(r => r.status.toLowerCase() === 'present').length;
                const absent = filteredData.filter(r => r.status.toLowerCase() === 'absent').length;
                setStats({ present, absent, total: filteredData.length });
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
            ['Date', 'Time', 'Section', 'Class', 'Student Name', 'Roll Number', 'Subject', 'Status', 'Marked By'],
            ...attendanceData.map(record => [
                new Date(record.date).toLocaleDateString(),
                new Date(record.date).toLocaleTimeString(),
                record.section,
                record.class,
                record.studentName,
                record.rollNumber,
                record.subject,
                record.status,
                record.markedBy
            ])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `attendance_report_Section-${selectedSection}_${filterDate}.csv`);
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
        <div className="min-h-screen bg-bg-secondary dark:bg-bg-primary flex">
            <Sidebar activeTab="reports" />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
                            <p className="text-text-secondary">
                                {selectedSubject ? (
                                    <span className="flex items-center space-x-2">
                                        <span
                                            onClick={() => setSelectedSubject(null)}
                                            className="cursor-pointer hover:text-[#00BAF2] hover:underline"
                                        >
                                            {selectedSection === 'All' ? 'All Sections' : `${selectedSection}`}
                                        </span>
                                        <span>/</span>
                                        <span className="font-semibold text-gray-900">{selectedSubject}</span>
                                    </span>
                                ) : (
                                    <span>
                                        Daily Overview <span className="text-gray-400">|</span> <span className="text-[#00BAF2] font-semibold">{selectedSection === 'All' ? 'All Sections' : `${selectedSection}`}</span>
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">

                            {/* Section Filter */}
                            {!selectedSubject && (
                                <div className="relative">
                                    <select
                                        value={selectedSection}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg outline-none focus:ring-2 focus:ring-[#00BAF2]"
                                    >
                                        {sections.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sections' : `${s}`}</option>)}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <FunnelIcon className="w-4 h-4" />
                                    </div>
                                </div>
                            )}

                            {!selectedSubject && (
                                <>
                                    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
                                        <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
                                        <input
                                            type="date"
                                            value={filterDate}
                                            onChange={(e) => setFilterDate(e.target.value)}
                                            className="outline-none text-gray-700"
                                        />
                                    </div>
                                    <button
                                        onClick={handleExport}
                                        className="flex items-center text-white bg-[#00BAF2] hover:bg-[#0090c0] px-4 py-2 rounded-lg transition-colors shadow-sm"
                                        title="Download CSV"
                                    >
                                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                                        Export
                                    </button>
                                </>
                            )}

                            {selectedSubject && (
                                <button
                                    onClick={() => setSelectedSubject(null)}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Back to Overview
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Daily Stats Summary - Only show on Overview */}
                    {!selectedSubject && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm text-text-secondary font-medium uppercase">Total Records</p>
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
                                    <p className="text-sm text-text-secondary mb-4">{group.total} Records Processed</p>

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
                                <div className="col-span-full py-12 text-center text-text-secondary bg-white rounded-xl border border-dashed border-gray-300">
                                    No attendance records found for {filterDate} (Section {selectedSection}).
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
                                            <th className="px-6 py-4 font-semibold text-text-secondary text-sm uppercase">Time</th>
                                            <th className="px-6 py-4 font-semibold text-text-secondary text-sm uppercase">Student - Roll</th>
                                            <th className="px-6 py-4 font-semibold text-text-secondary text-sm uppercase">Section</th>
                                            <th className="px-6 py-4 font-semibold text-text-secondary text-sm uppercase">Status</th>
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
                                                        <div>
                                                            <div className="font-medium text-gray-900">{record.studentName}</div>
                                                            <div className="text-xs text-gray-500 font-mono">{record.rollNumber || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-700 font-semibold">
                                                    {record.section}
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
