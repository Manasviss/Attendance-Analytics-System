import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

const AttendanceSheet = () => {
    const { currentUser, systemDate } = useAuth();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: 'Present' | 'Absent' }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    // Use systemDate for default (local format YYYY-MM-DD)
    const [date, setDate] = useState(() => {
        // Handle timezone offset to ensure we get the correct "local" date part
        const offset = systemDate.getTimezoneOffset() * 60000;
        return new Date(systemDate.getTime() - offset).toISOString().split('T')[0];
    });
    // Add Subject State
    const [subject, setSubject] = useState('General');
    const [subjects] = useState([
        'General',
        'Advanced Web Development',
        'Database Management System',
        'Software Engineering',
        'Computer Networks',
        'Operating Systems',
        'Mathematics'
    ]);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const [studentsRes, attendanceRes] = await Promise.all([
                fetch('http://localhost:5000/api/students', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`http://localhost:5000/api/attendance/history?date=${date}&subject=${subject}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const studentsData = await studentsRes.json();
            const attendanceData = await attendanceRes.json();

            if (studentsData.success) {
                setStudents(studentsData.data);

                // Initialize with existing data or default to Present
                const currentAttendance = {};
                studentsData.data.forEach(s => {
                    currentAttendance[s._id] = 'Present'; // Default
                });

                if (attendanceData.success && attendanceData.data) {
                    attendanceData.data.forEach(record => {
                        if (record.student && record.student._id) {
                            currentAttendance[record.student._id] = record.status;
                        } else if (record.student) { // Handle if population didn't work as expected or simple ID
                            currentAttendance[record.student] = record.status;
                        }
                    });
                }
                setAttendance(currentAttendance);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when date or subject changes
    useEffect(() => {
        setLoading(true);
        fetchStudents();
    }, [date, subject]);

    const toggleStatus = (studentId) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const records = Object.entries(attendance).map(([studentId, status]) => ({
                studentId,
                status
            }));

            const response = await fetch('http://localhost:5000/api/attendance/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ date, subject, records })
            });

            const data = await response.json();
            if (data.success) {
                alert('Attendance marked successfully!');
                navigate('/dashboard');
            } else {
                alert('Failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error submitting attendance:', error);
            alert('Error submitting attendance');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar activeTab="schedule" />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
                                <p className="text-gray-500">
                                    Marking for: <span className="font-bold text-[#00BAF2]">{subject}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-4 items-end">
                            {/* Subject Selector */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject</label>
                                <div className="relative">
                                    <select
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BAF2] bg-white min-w-[200px] text-gray-700 font-medium"
                                    >
                                        {subjects.map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Date Selector */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BAF2] text-gray-700 font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-100 grid grid-cols-12 gap-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">
                            <div className="col-span-1">#</div>
                            <div className="col-span-3">Roll Number</div>
                            <div className="col-span-5">Student Name</div>
                            <div className="col-span-3 text-center">Status</div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading students...</div>
                            ) : students.map((student, index) => (
                                <div key={student._id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                                    <div className="col-span-1 text-gray-400">{index + 1}</div>
                                    <div className="col-span-3 font-mono text-gray-600">{student.rollNumber}</div>
                                    <div className="col-span-5 font-medium text-gray-900">{student.name}</div>
                                    <div className="col-span-3 flex justify-center">
                                        <button
                                            onClick={() => toggleStatus(student._id)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${attendance[student._id] === 'Present'
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                        >
                                            {attendance[student._id] === 'Present' ? (
                                                <>
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                    <span>Present</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircleIcon className="w-5 h-5" />
                                                    <span>Absent</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-8 py-3 bg-[#002E6E] hover:bg-white hover:text-[#002E6E] hover:border-[#002E6E] hover:border-2 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed border-2 border-transparent"
                        >
                            {submitting ? 'Submitting...' : 'Submit Attendance'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AttendanceSheet;
