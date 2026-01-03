import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WaveBackground from '../components/WaveBackground';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import loginIllustration from '../assets/login_illustration.png';

const Login = () => {
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(uid, password);
      navigate('/dashboard');
    } catch {
      setError('Failed to log in. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    try {
      setError('');
      setUid('admin');
      setPassword('password123');
      setLoading(true);
      await login('admin', 'password123');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to log in as admin. Admin account may not exist.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top Gradient Overlay - Subtle RGB-like Mesh */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/40 blur-[80px]" />
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/40 blur-[80px]" />
        <div className="absolute top-[-30%] left-[30%] w-[40%] h-[40%] rounded-full bg-indigo-400/40 blur-[80px]" />
      </div>

      <WaveBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row z-10 border border-gray-100"
      >
        {/* Left Side - Illustration */}
        <div className="md:w-1/2 bg-blue-50/50 p-10 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="relative z-10 text-center">
            <img
              src={loginIllustration}
              alt="Login Illustration"
              className="w-full max-w-sm mx-auto mb-8 drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Securely access your attendance dashboard and manage your classes with ease.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-10 md:p-14 bg-white flex flex-col justify-center">
          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-[#002E6E] mb-2 tracking-tight">Instructor Login</h2>
            <p className="text-gray-500 font-medium">Please enter your credentials</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6 border border-red-100 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <label htmlFor="uid" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                UID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#00BAF2] transition-colors" />
                </div>
                <input
                  id="uid"
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#00BAF2] focus:ring-4 focus:ring-[#00BAF2]/10 transition-all duration-200 text-gray-800 font-medium placeholder-gray-400 bg-white focus:bg-white"
                  placeholder="Enter your unique ID"
                />
              </div>
            </div>

            <div className="relative group">
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#00BAF2] transition-colors" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#00BAF2] focus:ring-4 focus:ring-[#00BAF2]/10 transition-all duration-200 text-gray-800 font-medium placeholder-gray-400 bg-white focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-gradient-to-r from-[#002E6E] to-[#004099] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2 border-2 border-transparent hover:bg-none hover:bg-white hover:text-[#002E6E] hover:border-[#002E6E]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : 'Access Dashboard'}
            </button>

            <button
              type="button"
              onClick={handleAdminLogin}
              disabled={loading}
              className="w-full py-4 px-4 bg-white text-[#002E6E] font-bold text-lg rounded-xl shadow-md border-2 border-[#002E6E] hover:bg-blue-50 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              Login as Admin
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              New to the platform?{' '}
              <Link to="/signup" className="text-[#00BAF2] font-bold hover:text-[#0090c0] transition-colors">
                Sign up as an instructor
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
