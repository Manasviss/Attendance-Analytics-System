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

    useEffect(() => {
        fetchMyLeaves();
    }, []);

    const fetchMyLeaves = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/leaves/my-leaves', {
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
            const response = await fetch('http://localhost:5000/api/leaves/apply', {
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
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar activeTab="leave" />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Leave Application</h1>
                            <p className="text-gray-500 mt-1">Apply for leave and track your status.</p>
                        </div>
                        <img src={leaveIllustration} alt="Leave" className="w-24 h-24 object-contain hidden md:block" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Application Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                    <PaperAirplaneIcon className="w-5 h-5 mr-2 text-[#00BAF2]" />
                                    Apply for Self-Leave
                                </h2>

                                {message && (
                                    <div className={`p-4 mb-4 rounded-lg text-sm ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Removed Student Select - Now Self Only */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
                                        >
                                            <option value="Medical">Medical</option>
                                            <option value="Casual">Casual</option>
                                            <option value="Emergency">Emergency</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                        <textarea
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
                                            required
                                            placeholder="Please explain the reason for your leave..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#002E6E] hover:bg-white hover:text-[#002E6E] hover:border-[#002E6E] hover:border-2 text-white font-bold py-3 rounded-lg shadow transition-all disabled:opacity-70 border-2 border-transparent"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* History List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 bg-gray-50">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                        <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
                                        My Leave History
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {myLeaves.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">No leave history found.</div>
                                    ) : myLeaves.map(leave => (
                                        <div key={leave._id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 ${leave.type === 'Medical' ? 'bg-blue-100 text-blue-700' :
                                                        leave.type === 'Casual' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {leave.type}
                                                    </span>
                                                    <h3 className="font-medium text-gray-900">{leave.reason}</h3>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    leave.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {leave.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 mt-2">
                                                <CalendarIcon className="w-4 h-4 mr-1" />
                                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                <span className="mx-2">•</span>
                                                Applied on {new Date(leave.createdAt).toLocaleDateString()}
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
