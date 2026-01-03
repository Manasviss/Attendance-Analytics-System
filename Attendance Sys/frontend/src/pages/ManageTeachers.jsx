import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { TrashIcon, PencilIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const ManageTeachers = () => {
    const { currentUser } = useAuth();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data for now since we haven't implemented the full backend route for listing teachers
    // In a real scenario, you'd fetch from /api/users?role=teacher
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('/api/auth/teachers', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setTeachers(data.data);
                } else {
                    console.error('Failed to fetch teachers:', data.error);
                }
            } catch (error) {
                console.error('Error fetching teachers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this teacher?')) {
            setTeachers(teachers.filter(t => t.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-bg-secondary dark:bg-bg-primary flex">
            <Sidebar activeTab="manage-teachers" />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Teachers</h1>
                            <p className="text-gray-500 dark:text-gray-400">Admin Dashboard for managing faculty members.</p>
                        </div>
                        <button className="flex items-center bg-[#00BAF2] text-white px-4 py-2 rounded-lg hover:bg-[#0090c0] transition-colors shadow-lg">
                            <UserPlusIcon className="w-5 h-5 mr-2" />
                            Add Teacher
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">UID</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Department</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">Loading faculty data...</td>
                                    </tr>
                                ) : (
                                    teachers.map((teacher) => (
                                        <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                                                        {teacher.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{teacher.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{teacher.uid}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                                                    {teacher.department || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${teacher.status === 'Active'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                    }`}>
                                                    {teacher.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors dark:hover:bg-blue-900/20">
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(teacher.id)}
                                                    className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors dark:hover:bg-red-900/20"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManageTeachers;
