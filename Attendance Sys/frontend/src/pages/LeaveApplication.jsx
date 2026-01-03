import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { PaperAirplaneIcon, CalendarIcon } from '@heroicons/react/24/outline';
import leaveIllustration from '../assets/leave_illustration.png';

const LeaveApplication = () => {
    const { currentUser } = useAuth();
    const [myLeaves, setMyLeaves] = useState([]);
    const [formData, setFormData] = useState({
        type: 'Medical',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Dynamic Balance Calculation
    const totalLeaves = 12; // Annual Quota
    const usedLeaves = myLeaves
        .filter(leave => leave.status === 'Approved')
        .reduce((total, leave) => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            // Calculate difference in days (inclusive)
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return total + diffDays;
        }, 0);
    const remainingLeaves = totalLeaves - usedLeaves;

    useEffect(() => {
        fetchMyLeaves();
    }, []);

    const fetchMyLeaves = async () => { /// old leaves
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/leaves/my-leaves', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setMyLeaves(data.data);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/leaves/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                setMessage('Leave application submitted successfully!');
                fetchMyLeaves();
                setFormData(prev => ({
                    ...prev,
                    startDate: '',
                    endDate: '',
                    reason: ''
                }));
            } else {
                setMessage('Failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error applying for leave:', error);
            setMessage('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7FE] flex font-sans">
            <Sidebar activeTab="leave" />

            <main className="flex-1 ml-64 p-8 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-200/30 to-blue-200/30 rounded-full blur-3xl -z-10" />

                <div className="max-w-6xl mx-auto">
                    <header className="flex items-center justify-between mb-10 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div>
                            <h1 className="text-3xl font-extrabold text-[#002E6E] tracking-tight">Leave Management</h1>
                            <p className="text-gray-500 font-medium mt-1">Submit applications and track your time off</p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Balance</p>
                                <p className={`text-xl font-bold ${remainingLeaves < 4 ? 'text-red-500' : 'text-[#00BAF2]'}`}>
                                    {remainingLeaves} Days
                                </p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <CalendarIcon className="w-8 h-8 text-[#002E6E]" />
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Application Form */}
                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden group hover:border-blue-200 transition-colors duration-300">
                                <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <PaperAirplaneIcon className="w-6 h-6 text-[#00BAF2]" />
                                    </div>
                                    Apply for Leave
                                </h2>

                                {message && (
                                    <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 text-sm font-bold ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                        <div className={`w-2 h-2 rounded-full ${message.includes('successfully') ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Leave Type</label>
                                        <div className="relative">
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-700 font-medium outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#00BAF2] transition-all appearance-none cursor-pointer hover:bg-white"
                                            >
                                                <option value="Medical">Medical Leave</option>
                                                <option value="Casual">Casual Leave</option>
                                                <option value="Emergency">Emergency Leave</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">From Date</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-700 font-medium outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#00BAF2] transition-all hover:bg-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">To Date</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-700 font-medium outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#00BAF2] transition-all hover:bg-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Reason</label>
                                        <textarea
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-700 font-medium outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#00BAF2] transition-all resize-none hover:bg-white"
                                            required
                                            placeholder="Briefly explain why you need leave..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-[#002E6E] to-[#004099] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:transform-none transition-all flex justify-center items-center gap-2"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Processing Application...
                                            </span>
                                        ) : (
                                            <>Submit Application <PaperAirplaneIcon className="w-5 h-5 -rotate-45" /></>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* History List */}
                        <div className="lg:col-span-7">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full">
                                <div className="p-8 border-b border-gray-100/80">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <CalendarIcon className="w-6 h-6 text-purple-600" />
                                        </div>
                                        Application History
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto custom-scrollbar">
                                    {myLeaves.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <CalendarIcon className="w-10 h-10 text-gray-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">No Applications Yet</h3>
                                            <p className="text-gray-400 max-w-xs mt-1">Your leave history will appear here once you submit your first application.</p>
                                        </div>
                                    ) : myLeaves.map(leave => (
                                        <div key={leave._id} className="p-6 hover:bg-blue-50/30 transition-colors group">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${leave.type === 'Medical' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                            leave.type === 'Casual' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                                                                'bg-blue-50 text-blue-600 border border-blue-100'
                                                            }`}>
                                                            {leave.type}
                                                        </span>
                                                        <span className="text-xs font-medium text-gray-400">
                                                            Applied on {new Date(leave.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-[#002E6E] transition-colors">{leave.reason}</h3>
                                                    <div className="flex items-center text-sm font-medium text-gray-500 gap-2">
                                                        <CalendarIcon className="w-4 h-4 text-[#00BAF2]" />
                                                        <span className="text-gray-700">
                                                            {new Date(leave.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                        </span>
                                                        <span className="text-gray-300">➜</span>
                                                        <span className="text-gray-700">
                                                            {new Date(leave.endDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center">
                                                    <span className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${leave.status === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' :
                                                        leave.status === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' :
                                                            'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200'
                                                        }`}>
                                                        <span className={`w-2 h-2 rounded-full ${leave.status === 'Approved' ? 'bg-green-500' :
                                                            leave.status === 'Rejected' ? 'bg-red-500' :
                                                                'bg-yellow-500'
                                                            }`}></span>
                                                        {leave.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LeaveApplication;
