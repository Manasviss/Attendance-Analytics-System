import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const LeaveRequests = () => {
    const { currentUser } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/leaves', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setLeaves(data.data);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/leaves/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            const data = await response.json();
            if (data.success) {
                setLeaves(leaves.map(leave =>
                    leave._id === id ? { ...leave, status } : leave
                ));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="min-h-screen bg-bg-secondary dark:bg-bg-primary flex">
            <Sidebar activeTab="leave-requests" />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">Leave Requests</h1>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase">Faculty</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase">Type</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase">Dates</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase">Reason</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase">Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading requests...</td></tr>
                                    ) : leaves.length === 0 ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">No leave requests found.</td></tr>
                                    ) : leaves.map((leave) => (
                                        <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{leave.teacher?.name || leave.student?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500 font-mono tracking-wide">
                                                    {leave.applicantRole === 'Teacher' ? 'FAT' : 'STD'} • {leave.teacher?.uid || leave.student?.rollNumber}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${leave.type === 'Medical' ? 'bg-blue-100 text-blue-700' :
                                                    leave.type === 'Casual' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {leave.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={leave.reason}>
                                                {leave.reason}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center text-sm font-medium ${leave.status === 'Approved' ? 'text-green-600' :
                                                    leave.status === 'Rejected' ? 'text-red-600' :
                                                        'text-yellow-600'
                                                    }`}>
                                                    {leave.status === 'Approved' && <CheckCircleIcon className="w-4 h-4 mr-1" />}
                                                    {leave.status === 'Rejected' && <XCircleIcon className="w-4 h-4 mr-1" />}
                                                    {leave.status === 'Pending' && <ClockIcon className="w-4 h-4 mr-1" />}
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {leave.status === 'Pending' && (
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                                                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircleIcon className="w-6 h-6" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircleIcon className="w-6 h-6" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LeaveRequests;
