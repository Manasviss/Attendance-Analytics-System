import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon, UserIcon } from '@heroicons/react/24/solid';
import { API_BASE_URL } from '../config';
import { TIMETABLE } from '../utils/timetableData';

const DoodleBackground = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        {/* Abstract Shapes & Academic Doodles */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Circle 1 */}
            <circle cx="10%" cy="10%" r="50" fill="currentColor" className="text-blue-500" />
            {/* Square 1 */}
            <rect x="85%" y="15%" width="60" height="60" rx="10" stroke="currentColor" strokeWidth="2" fill="none" className="text-purple-500" transform="rotate(15 85 15)" />
            {/* Triangle */}
            <path d="M50,90 L60,110 L40,110 Z" fill="currentColor" className="text-yellow-500" transform="scale(3) translate(20,50)" />
            {/* Wave */}
            <path d="M0,500 Q100,450 200,500 T400,500" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-400" />
            {/* Checkmark */}
            <path d="M800,300 L820,320 L860,280" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" className="text-green-400" />
            {/* Dots */}
            <circle cx="20%" cy="80%" r="4" fill="currentColor" className="text-gray-300" />
            <circle cx="22%" cy="82%" r="4" fill="currentColor" className="text-gray-300" />
            <circle cx="24%" cy="80%" r="4" fill="currentColor" className="text-gray-300" />
        </svg>
    </div>
);

const AttendanceSheet = () => {
    const { systemDate, currentUser } = useAuth();
    const navigate = useNavigate();

    // -- Global State --
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // -- Data State --
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: 'Present' | 'Absent' }

    // -- Selection State --
    // selectedClassSlot is the single source of truth for "Marking Mode" vs "View Mode"
    // If null -> View Mode (Schedule). If object -> Marking Mode.
    const [selectedClassSlot, setSelectedClassSlot] = useState(null);

    // Defaults
    const [date, setDate] = useState(() => {
        // Safe date initialization
        try {
            if (systemDate) {
                const offset = systemDate.getTimezoneOffset() * 60000;
                return new Date(systemDate.getTime() - offset).toISOString().split('T')[0];
            }
            return new Date().toISOString().split('T')[0];
        } catch (e) {
            return new Date().toISOString().split('T')[0];
        }
    });

    const [dailySchedule, setDailySchedule] = useState([]);

    // -- Headcount Modal State --
    const [showHeadcountModal, setShowHeadcountModal] = useState(false);
    const [headcountInput, setHeadcountInput] = useState('');
    const [headcountError, setHeadcountError] = useState('');

    // -- EFFECT: Build Schedule based on Date --
    useEffect(() => {
        try {
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
            const allSlots = [];

            if (TIMETABLE && typeof TIMETABLE === 'object') {
                Object.entries(TIMETABLE).forEach(([sec, daySchedule]) => {
                    const slots = daySchedule[dayName];
                    if (Array.isArray(slots)) {
                        slots.forEach(slot => {
                            allSlots.push({
                                ...slot,
                                section: sec,
                                // Create a unique ID for React keys
                                id: `${sec}-${dayName}-${slot.time}-${slot.subject}`
                            });
                        });
                    }
                });
            }

            // Sort by time
            allSlots.sort((a, b) => a.time.localeCompare(b.time));
            setDailySchedule(allSlots);
        } catch (error) {
            console.error("Error building schedule:", error);
            setDailySchedule([]);
        }
    }, [date]);

    // -- EFFECT: Fetch Students when Class Selected --
    useEffect(() => {
        if (!selectedClassSlot) return;

        const fetchData = async () => {
            setLoading(true);
            setStudents([]);
            setAttendance({});

            try {
                const token = localStorage.getItem('token');
                const { section, subject, subjectAlias } = selectedClassSlot;
                const activeSubject = subjectAlias || subject;

                if (!section || !activeSubject) {
                    console.error("Missing section or subject in slot");
                    setLoading(false);
                    return;
                }

                // Parallel Fetch: Students + Existing History
                const [studentsRes, historyRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/students?section=${section}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/api/attendance/history?date=${date}&subject=${activeSubject}&section=${section}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                // Safe parsing
                const studentsData = await studentsRes.json().catch(() => ({ success: false }));
                const historyData = await historyRes.json().catch(() => ({ success: false }));

                if (studentsData.success && Array.isArray(studentsData.data)) {
                    setStudents(studentsData.data);

                    // Build initial attendance map
                    const initialMap = {};

                    // 1. Default everyone to Present
                    studentsData.data.forEach(s => {
                        initialMap[s._id] = 'Present';
                    });

                    // 2. Overwrite with history if exists
                    if (historyData.success && Array.isArray(historyData.data)) {
                        historyData.data.forEach(record => {
                            // Support both populated and unpopulated student field
                            const sId = record.student?._id || record.student;
                            if (sId && initialMap[sId]) {
                                initialMap[sId] = record.status;
                            }
                        });
                    }

                    setAttendance(initialMap);
                } else {
                    console.warn("No students found or API error", studentsData);
                }

            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedClassSlot, date]);


    // -- Handlers --

    const handleClassClick = (slot) => {
        console.log("Class Selected:", slot);
        setSelectedClassSlot(slot);
    };

    const handleBack = () => {
        setSelectedClassSlot(null);
        setStudents([]);
        setAttendance({});
    };

    const toggleStatus = (studentId) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
        }));
    };

    const initiateSubmit = () => {
        setHeadcountInput('');
        setHeadcountError('');
        setShowHeadcountModal(true);
    };

    const confirmAndSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const presentCount = Object.values(attendance).filter(s => s === 'Present').length;
        if (parseInt(headcountInput) !== presentCount) {
            setHeadcountError(`Mismatch! System has ${presentCount} Present. You entered ${headcountInput}.`);
            return;
        }

        setShowHeadcountModal(false);
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const { section, subject, subjectAlias } = selectedClassSlot;
            const activeSubject = subjectAlias || subject;

            const records = Object.entries(attendance).map(([studentId, status]) => ({
                studentId,
                status
            }));

            const res = await fetch(`${API_BASE_URL}/api/attendance/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    date,
                    subject: activeSubject, // Ensure we send the correct subject name
                    records
                })
            });

            const data = await res.json();
            if (data.success) {
                alert("Attendance Marked Successfully!");
                handleBack(); // Return to schedule
            } else {
                alert("Failed to mark attendance: " + (data.error || 'Unknown error'));
            }

        } catch (err) {
            console.error("Submit error:", err);
            alert("Network error while submitting.");
        } finally {
            setSubmitting(false);
        }
    };

    // -- Render Helpers --
    const getStats = () => {
        const total = students.length;
        const present = Object.values(attendance).filter(s => s === 'Present').length;
        const absent = total - present;
        return { total, present, absent };
    };
    const stats = getStats();


    return (
        <div className="min-h-screen bg-bg-secondary dark:bg-bg-primary flex">
            <Sidebar activeTab="schedule" />

            <main className="flex-1 ml-64 p-8 relative overflow-hidden">
                <DoodleBackground />
                <div className="max-w-4xl mx-auto relative z-10">

                    {/* --- VIEW 1: SCHEDULE (Initial State) --- */}
                    {!selectedClassSlot && (
                        <div className="animate-fadeIn">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Today's Classes</h1>
                                    <p className="text-gray-500">Select a class to mark attendance</p>
                                </div>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BAF2] text-gray-700 font-medium"
                                />
                            </div>

                            <div className="grid gap-4">
                                {dailySchedule.length === 0 ? (
                                    <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-500">
                                        No classes scheduled for this date.
                                    </div>
                                ) : (
                                    dailySchedule.map((slot) => (
                                        <motion.div
                                            key={slot.id}
                                            whileHover={{ scale: 1.01 }}
                                            onClick={() => handleClassClick(slot)}
                                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-[#00BAF2] transition-all flex justify-between items-center group"
                                        >
                                            <div className="flex items-center gap-6">
                                                {/* Time Column */}
                                                <div className="flex flex-col items-center justify-center w-24 text-center border-r border-gray-100 pr-6">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Start</span>
                                                    <span className="font-mono text-lg font-bold text-gray-700">
                                                        {slot.time.split(' - ')[0]}
                                                    </span>
                                                </div>

                                                {/* Details Column */}
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded uppercase">
                                                            {slot.section}
                                                        </span>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${slot.type === 'Lab' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {slot.type}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#00BAF2] transition-colors">
                                                        {slot.subject}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-gray-500">
                                                        <UserIcon className="w-3.5 h-3.5" />
                                                        Faculty: {currentUser?.name || 'You'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Arrow */}
                                            <div className="p-2 rounded-full bg-gray-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-[#00BAF2] transition-colors">
                                                <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}


                    {/* --- VIEW 2: MARKING INTERFACE (Active State) --- */}
                    {selectedClassSlot && (
                        <div className="animate-fadeIn">
                            {/* MARKING HEADER */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={handleBack}
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                        <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                                    </button>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="font-bold text-[#00BAF2]">
                                                {selectedClassSlot.subjectAlias || selectedClassSlot.subject}
                                            </span>
                                            <span>•</span>
                                            <span>Section {selectedClassSlot.section}</span>
                                            <span>•</span>
                                            <span>{selectedClassSlot.time}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                {!loading && students.length > 0 && (
                                    <div className="flex gap-4">
                                        <div className="text-center px-4 py-2 bg-green-50 rounded-lg border border-green-100">
                                            <div className="text-xl font-bold text-green-700">{stats.present}</div>
                                            <div className="text-xs text-green-600 font-bold uppercase">Present</div>
                                        </div>
                                        <div className="text-center px-4 py-2 bg-red-50 rounded-lg border border-red-100">
                                            <div className="text-xl font-bold text-red-700">{stats.absent}</div>
                                            <div className="text-xs text-red-600 font-bold uppercase">Absent</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* MARKING BODY */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                                {/* Table Header */}
                                <div className="p-4 bg-gray-50 border-b border-gray-100 grid grid-cols-12 gap-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">
                                    <div className="col-span-1">#</div>
                                    <div className="col-span-3">Roll Number</div>
                                    <div className="col-span-5">Name</div>
                                    <div className="col-span-3 text-center">Status</div>
                                </div>

                                {/* Table Content */}
                                <div className="divide-y divide-gray-100">
                                    {loading ? (
                                        <div className="p-12 text-center text-gray-400">
                                            Loading student data...
                                        </div>
                                    ) : students.length === 0 ? (
                                        <div className="p-12 text-center text-red-500">
                                            No students found for this section.
                                        </div>
                                    ) : (
                                        students.map((student, index) => (
                                            <div key={student._id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                                                <div className="col-span-1 text-gray-400 font-mono text-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="col-span-3 font-mono text-gray-600 font-medium">
                                                    {student.rollNumber}
                                                </div>
                                                <div className="col-span-5 font-medium text-gray-900">
                                                    {student.name}
                                                </div>
                                                <div className="col-span-3 flex justify-center">
                                                    <button
                                                        onClick={() => toggleStatus(student._id)}
                                                        className={`
                                                            flex items-center space-x-2 px-4 py-1.5 rounded-full transition-all duration-200 border
                                                            ${attendance[student._id] === 'Present'
                                                                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                                                                : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'}
                                                        `}
                                                    >
                                                        {attendance[student._id] === 'Present' ? (
                                                            <>
                                                                <CheckCircleIcon className="w-5 h-5" />
                                                                <span className="font-bold">Present</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircleIcon className="w-5 h-5" />
                                                                <span className="font-bold">Absent</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* MARKING FOOTER */}
                            <div className="mt-8 flex justify-end space-x-4">
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={initiateSubmit}
                                    disabled={submitting || students.length === 0}
                                    className="px-8 py-3 bg-[#002E6E] text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Attendance'}
                                </button>
                            </div>

                        </div>
                    )}

                </div>

                {/* --- HEADCOUNT MODAL --- */}
                {showHeadcountModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
                            <div className="text-center mb-6">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                                    <CheckCircleIcon className="h-10 w-10 text-[#00BAF2]" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Verify Count</h3>
                                <p className="text-gray-500 mt-2">
                                    Please count the students present in the class (Headcount).
                                </p>
                            </div>

                            <form onSubmit={confirmAndSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Present Students
                                    </label>
                                    <input
                                        type="number"
                                        value={headcountInput}
                                        onChange={(e) => setHeadcountInput(e.target.value)}
                                        className={`w-full px-4 py-3 text-2xl font-bold text-center border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00BAF2] 
                                            ${headcountError ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                        placeholder="0"
                                        autoFocus
                                        required
                                    />
                                    {headcountError && (
                                        <p className="mt-2 text-sm text-red-600 font-medium animate-pulse">
                                            {headcountError}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowHeadcountModal(false)}
                                        className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 text-white bg-[#002E6E] hover:bg-[#004099] rounded-xl font-bold shadow-lg transition-colors"
                                    >
                                        Verify & Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AttendanceSheet;
