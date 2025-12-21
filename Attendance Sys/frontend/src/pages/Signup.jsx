import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WaveBackground from '../components/WaveBackground';
import { UserIcon, LockClosedIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import signupIllustration from '../assets/unnamed.jpg'; // Updated illustration
import bgImage from '../assets/Gemini_Generated_Image_3hg3tt3hg3tt3hg3_cleanup (1).png';

const Signup = () => {
    const [name, setName] = useState('');
    const [uid, setUid] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await register(name, uid, password, 'teacher');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create account.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
            {/* Background Image with Blur */}
            <div className="absolute inset-0 z-0">
                <img
                    src={bgImage}
                    alt="Background"
                    className="w-full h-full object-cover blur-[2px] opacity-80 scale-105"
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-4xl mx-4 bg-[#1F1E1C]/40 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_-10px_rgba(217,119,87,0.15)] overflow-hidden flex flex-col md:flex-row z-10 border border-[#D97757]/20 ring-1 ring-[#D97757]/10"
            >
                {/* Left Side - Illustration */}
                <div className="md:w-1/2 bg-[#2d2b29]/30 p-8 flex flex-col justify-center items-center relative overflow-hidden border-r border-[#D97757]/10">
                    <div className="relative z-10 text-center">
                        <div className="rounded-xl overflow-hidden shadow-2xl mb-6 max-w-xs mx-auto ring-1 ring-[#D97757]/30 shadow-[#D97757]/10">
                            <img
                                src={signupIllustration}
                                alt="Signup Illustration"
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 grayscale-[20%] sepia-[15%]"
                            />
                        </div>
                        <h2 className="text-3xl font-serif font-medium text-[#F2F0ED] mb-2 drop-shadow-sm tracking-wide">Welcome</h2>
                        <p className="text-[#D97757] font-sans font-medium tracking-widest text-xs uppercase">Join the Faculty</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-1/2 p-10 bg-transparent flex flex-col justify-center">
                    <div className="text-center md:text-left mb-8">
                        <h2 className="text-3xl font-serif text-[#F2F0ED] mb-2 tracking-tight">
                            Create <span className="italic text-[#D97757]">Account</span>
                        </h2>
                        <p className="text-[#9CA3AF] font-sans text-sm">Please enter your details to register</p>
                    </div>

                    {error && (
                        <div className="bg-[#D97757]/10 text-[#F2F0ED] text-sm p-4 rounded-xl mb-6 border border-[#D97757]/20 flex items-center backdrop-blur-md">
                            <svg className="w-5 h-5 mr-2 text-[#D97757]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Claude Style Input - Name */}
                        <div className="group bg-[#2d2b29]/40 border border-[#D97757]/10 rounded-lg px-3 py-3 transition-all duration-300 focus-within:bg-[#2d2b29]/60 focus-within:ring-1 focus-within:ring-[#D97757]/50 focus-within:border-[#D97757]/50 hover:bg-[#2d2b29]/50">
                            <label htmlFor="name" className="block text-[10px] font-sans font-bold text-[#9CA3AF] group-focus-within:text-[#D97757] uppercase tracking-wider transition-colors mb-0.5">
                                Full Name
                            </label>
                            <div className="flex items-center">
                                <UserIcon className="h-5 w-5 text-[#9CA3AF] mr-2 group-focus-within:text-[#D97757] transition-colors" />
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="block w-full border-0 p-0 text-[#F2F0ED] placeholder-transparent focus:ring-0 bg-transparent text-base font-serif caret-[#D97757]"
                                    placeholder="Name"
                                />
                            </div>
                        </div>

                        {/* Claude Style Input - UID */}
                        <div className="group bg-[#2d2b29]/40 border border-[#D97757]/10 rounded-lg px-3 py-3 transition-all duration-300 focus-within:bg-[#2d2b29]/60 focus-within:ring-1 focus-within:ring-[#D97757]/50 focus-within:border-[#D97757]/50 hover:bg-[#2d2b29]/50">
                            <label htmlFor="uid" className="block text-[10px] font-sans font-bold text-[#9CA3AF] group-focus-within:text-[#D97757] uppercase tracking-wider transition-colors mb-0.5">
                                System UID
                            </label>
                            <div className="flex items-center">
                                <IdentificationIcon className="h-5 w-5 text-[#9CA3AF] mr-2 group-focus-within:text-[#D97757] transition-colors" />
                                <input
                                    id="uid"
                                    type="text"
                                    value={uid}
                                    onChange={(e) => setUid(e.target.value)}
                                    required
                                    className="block w-full border-0 p-0 text-[#F2F0ED] placeholder-transparent focus:ring-0 bg-transparent text-base font-serif caret-[#D97757]"
                                    placeholder="UID"
                                />
                            </div>
                        </div>

                        {/* Claude Style Input - Password */}
                        <div className="group bg-[#2d2b29]/40 border border-[#D97757]/10 rounded-lg px-3 py-3 transition-all duration-300 focus-within:bg-[#2d2b29]/60 focus-within:ring-1 focus-within:ring-[#D97757]/50 focus-within:border-[#D97757]/50 hover:bg-[#2d2b29]/50">
                            <label htmlFor="password" className="block text-[10px] font-sans font-bold text-[#9CA3AF] group-focus-within:text-[#D97757] uppercase tracking-wider transition-colors mb-0.5">
                                Password
                            </label>
                            <div className="flex items-center">
                                <LockClosedIcon className="h-5 w-5 text-[#9CA3AF] mr-2 group-focus-within:text-[#D97757] transition-colors" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full border-0 p-0 text-[#F2F0ED] placeholder-transparent focus:ring-0 bg-transparent text-base font-serif caret-[#D97757]"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-[#D97757] text-[#F2F0ED] font-serif font-medium text-lg rounded-xl shadow-[0_4px_14px_0_rgba(217,119,87,0.39)] hover:shadow-[0_6px_20px_rgba(217,119,87,0.23)] hover:bg-[#C56545] transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4 border border-[#D97757]/20"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center font-sans text-sm uppercase tracking-wider">
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : 'Proceed'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-[#9CA3AF] font-serif">
                            Existing Credential Holder?{' '}
                            <Link to="/" className="text-[#D97757] hover:text-[#E88C6E] transition-colors border-b border-[#D97757]/30 pb-0.5 hover:border-[#D97757]/60">
                                Login Interface
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
