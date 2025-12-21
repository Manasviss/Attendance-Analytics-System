import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StudentStatsModal from '../components/StudentStatsModal';
import { PlusIcon, TrashIcon, UserPlusIcon, EyeIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import studentsIllustration from '../assets/students_illustration.png';

const StudentsPage = () => {
    const { currentUser } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null); // For stats modal
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        email: '',
        class: 'B.Tech',
        section: 'A',
        academicYear: '2023-24'
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/students', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setStudents(data.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                setStudents([...students, data.data]);
                setShowModal(false);
                setFormData({
                    name: '',
                    rollNumber: '',
                    email: '',
                    class: 'B.Tech',
                    section: 'A',
                    academicYear: '2023-24'
                });
            } else {
                alert('Failed to add student: ' + data.error);
            }
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/students/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setStudents(students.filter(s => s._id !== id));
            }
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar activeTab="students" />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-6">
                            <img src={studentsIllustration} alt="Students" className="w-20 h-20 object-contain hidden md:block" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
                                <p className="text-gray-500 mt-1">Manage student records and enrollment</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center space-x-2 bg-[#002E6E] hover:bg-white hover:text-[#002E6E] hover:border-[#002E6E] hover:border-2 text-white px-4 py-2 rounded-lg shadow transition-all border-2 border-transparent"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span>Add Student</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">Roll No</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 text-sm uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
                                ) : students.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-600">{student.rollNumber}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{student.class} - {student.section}</td>
                                        <td className="px-6 py-4 text-gray-500">{student.email}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="text-[#00BAF2] hover:text-[#0090c0] p-1 hover:bg-blue-50 rounded transition-colors"
                                                    title="View Profile & Stats"
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student._id)}
                                                    className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete Student"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Add Student Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <UserPlusIcon className="w-6 h-6 mr-2 text-[#00BAF2]" />
                                Add New Student
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                                <input
                                    type="text"
                                    name="rollNumber"
                                    value={formData.rollNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                    <input
                                        type="text"
                                        name="class"
                                        value={formData.class}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                    <input
                                        type="text"
                                        name="section"
                                        value={formData.section}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#002E6E] hover:bg-white hover:text-[#002E6E] hover:border-[#002E6E] hover:border-2 text-white font-medium rounded-lg shadow transition-all border-2 border-transparent"
                                >
                                    Add Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Student Stats Modal */}
            {selectedStudent && (
                <StudentStatsModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
};

export default StudentsPage;
