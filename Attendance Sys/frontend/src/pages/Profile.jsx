import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import profileIllustration from '../assets/profile_illustration.png';

const Profile = () => {
    // We only use setSystemDate from context, avoiding currentUser dependency
    const { systemDate, setSystemDate, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    // Local state for EVERYTHING to ensure stability
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        department: ''
    });

    // 1. Fetch Data on Mount (Standalone)
    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    logout(); // No token? Go to login.
                    return;
                }

                const response = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();

                if (isMounted && data.success) {
                    setProfile(data.data);
                    setFormData({
                        name: data.data.name || '',
                        phone: data.data.phone || '',
                        department: data.data.department || ''
                    });
                    // Sync context for other components, but don't rely on it here
                    updateUser(data.data);
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
                // If we can't load profile, we shouldn't crash.
                // We keep profile null, which will show loading or error state.
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUserData();

        return () => { isMounted = false; };
    }, []);

    // 2. Handle Save
    const handleSave = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auth/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                setProfile(data.data); // Update local view immediately
                updateUser(data.data); // Update global context
                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Update failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save changes.');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Render Loading State
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-bg-secondary dark:bg-bg-primary">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#002E6E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading Profile...</p>
                </div>
            </div>
        );
    }

    // 4. Render Error State (if loading done but no profile)
    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-bg-secondary dark:bg-bg-primary">
                <div className="text-center">
                    <p className="text-red-500 font-bold mb-4">Failed to load profile data.</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">Retry</button>
                    <button onClick={logout} className="ml-4 px-4 py-2 text-gray-600">Logout</button>
                </div>
            </div>
        );
    }

    // 5. Main Render (Guaranteed to have 'profile')
    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Profile & Settings</h1>
                <img src={profileIllustration} alt="Profile" className="w-32 h-32 object-contain hidden md:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-1"
                >
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="bg-paypal-dark h-32 relative">
                            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                                    {(profile.name || 'U').charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                        <div className="pt-16 pb-8 px-6 text-center">
                            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
                            <p className="text-sm text-gray-500 mb-4">{profile.role}</p>
                            <div className="flex justify-center space-x-2">
                                <span className="px-3 py-1 bg-blue-50 text-paypal-light text-xs rounded-full font-medium">{profile.uid}</span>
                                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">Active</span>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 p-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span>Department</span>
                                <span className="font-medium">{profile.department || 'Not Set'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Joined</span>
                                <span className="font-medium">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Settings Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-2"
                >
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-paypal-light font-medium hover:text-paypal-dark transition-colors"
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <form className="space-y-6" onSubmit={handleSave}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paypal-light focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue="user@example.com"
                                        disabled={true} // Email usually not editable easily
                                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paypal-light focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paypal-light focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end pt-4">
                                    <button type="submit" disabled={saveLoading} className="bg-paypal-dark text-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-[#002E6E] hover:border-[#002E6E] hover:border-2 transition-all shadow-lg shadow-blue-900/20 border-2 border-transparent disabled:opacity-50">
                                        {saveLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </form>


                        <hr className="my-8 border-gray-100" />

                        <h3 className="text-xl font-bold text-gray-800 mb-6">System Settings (Demo Mode)</h3>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-900">System Date</h4>
                                    <p className="text-sm text-gray-600">Change "Today" to simulate future/past data.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Current Date</p>
                                    <p className="font-mono text-lg font-bold text-gray-900">{new Date(systemDate).toDateString()}</p>
                                </div>
                            </div>
                            <input
                                type="date"
                                value={new Date(systemDate).toLocaleDateString('en-CA')}
                                onChange={(e) => setSystemDate(new Date(e.target.value))}
                                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>

                        <hr className="my-8 border-gray-100" />

                        <h3 className="text-xl font-bold text-gray-800 mb-6">Security</h3>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-paypal-light transition-colors cursor-pointer group" onClick={() => alert('Feature coming soon!')}>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 group-hover:text-paypal-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Change Password</p>
                                    <p className="text-sm text-gray-500">Update your password regularly</p>
                                </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-paypal-light" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
