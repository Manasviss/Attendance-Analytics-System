import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import AttendanceChart from '../components/AttendanceChart';
import dashboardIllustration from '../assets/dashboard_illustration.png';
import {
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  SunIcon,
  MoonIcon,
  MegaphoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { currentUser, systemDate } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    avgAttendance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/analytics/dashboard?date=${systemDate.toISOString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [systemDate]);

  const nextClass = {
    subject: 'Advanced Web Development',
    code: 'INT222',
    time: '10:00 AM - 11:00 AM',
    room: '34-601',
    batch: 'CSE-A',
    students: stats.totalStudents || 60
  };

  // Mock removed, using stats.criticalAttendance

  return (
    <div className="min-h-screen bg-bg-secondary dark:bg-bg-primary flex transition-colors duration-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {/* Header with Illustration */}
        <div className="bg-white dark:bg-bg-secondary rounded-2xl shadow-sm p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden relative mb-8 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="z-10 md:w-2/3">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Good Morning, {currentUser?.name || 'Instructor'}!
                </h1>
                <p className="text-text-secondary dark:text-text-secondary text-lg">
                  Here's what's happening in your classes on <span className="font-bold text-text-primary">{new Date(systemDate).toDateString()}</span>.
                </p>
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <button onClick={() => navigate('/timetable')} className="bg-paypal-dark text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-[#002E6E] hover:border-[#002E6E] hover:border-2 transition-all shadow-md border-2 border-transparent">
                View Schedule
              </button>
              <button onClick={() => navigate('/attendance')} className="bg-white text-paypal-dark border-2 border-paypal-dark px-6 py-2 rounded-lg font-medium hover:bg-[#002E6E] hover:text-white transition-all">
                Mark Attendance
              </button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center mt-6 md:mt-0 relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
            <img
              src={dashboardIllustration}
              alt="Dashboard"
              className="w-48 md:w-64 relative z-10 mix-blend-multiply transition-transform duration-500"
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            trend="up"
            trendValue="New Batch"
            icon={UserGroupIcon}
            color="blue"
          />
          <StatCard
            title="Avg Attendance"
            value={`${stats.avgAttendance}%`}
            trend="up"
            trendValue="2%"
            icon={CheckCircleIcon}
            color="green"
          />
          <StatCard
            title="Absentees Today"
            value={stats.absentToday}
            trend="down"
            trendValue="Low"
            icon={XCircleIcon}
            color="red"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Next Class Card */}
            <div className="bg-white dark:bg-bg-secondary rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors duration-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00BAF2] opacity-10 rounded-bl-full -mr-8 -mt-8" />

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 text-xs font-bold px-2 py-1 rounded uppercase">Next Class</span>
                    <span className="text-gray-400 dark:text-text-secondary text-sm flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(new Date().getTime() + 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary">Advanced Web Development</h2>
                  <p className="text-text-secondary dark:text-text-secondary">INT222 • CSE-A • Room 34-601</p>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-text-secondary dark:text-text-secondary">
                    <span className="flex items-center"><UserGroupIcon className="w-4 h-4 mr-1" /> {stats.totalStudents} Students</span>
                    <span className="flex items-center text-green-600 dark:text-green-400"><CheckCircleIcon className="w-4 h-4 mr-1" /> Ready</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate('/timetable')}
                    className="bg-[#002E6E] hover:bg-white hover:text-[#002E6E] hover:border-[#002E6E] hover:border-2 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center border-2 border-transparent"
                  >
                    <ClockIcon className="w-5 h-5 mr-2" />
                    View Full Schedule
                  </button>
                </div>
              </div>
            </div>

            {/* Attendance Chart */}
            <AttendanceChart />
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-8">
            {/* Watchlist */}
            <div className="bg-white dark:bg-bg-secondary rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-bg-secondary/50">
                <h3 className="font-bold text-text-primary flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 mr-2" />
                  Critical Attendance
                </h3>
                <button onClick={() => navigate('/students')} className="text-xs font-semibold text-[#00BAF2] hover:text-[#0090c0] uppercase tracking-wide">View All</button>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {stats.criticalAttendance && stats.criticalAttendance.length > 0 ? (
                  stats.criticalAttendance.map((student) => (
                    <div key={student.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center group cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary group-hover:text-[#00BAF2] transition-colors">{student.name}</p>
                          <p className="text-xs text-text-secondary dark:text-text-secondary">{student.roll}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-lg font-bold text-red-600 dark:text-red-400">{student.attendance}%</span>
                        <span className="text-[10px] text-gray-400 uppercase">Attendance</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 dark:text-text-secondary text-sm">
                    No students with critical attendance.
                  </div>
                )}
              </div>
              <div className="p-3 bg-gray-50 dark:bg-bg-secondary/50 text-center">
                <p className="text-xs text-gray-400 dark:text-text-secondary">
                  {stats.criticalAttendance ? stats.criticalAttendance.length : 0} students below 75% threshold
                </p>
              </div>
            </div>

            {/* Announcements / Notice Board */}
            <div className="bg-white dark:bg-bg-secondary rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-bg-secondary/50">
                <h3 className="font-bold text-text-primary flex items-center">
                  <MegaphoneIcon className="w-5 h-5 text-blue-500 mr-2" />
                  Notice Board
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <div
                  onClick={() => navigate('/announcements')}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Admin</span>
                    <span className="text-[10px] text-gray-400">2 hrs ago</span>
                  </div>
                  <p className="text-sm font-bold text-text-primary group-hover:text-blue-600 transition-colors">Faculty Meeting Rescheduled</p>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">The monthly department meeting has been moved to Conference Room B at 3:00 PM.</p>
                </div>

                <div
                  onClick={() => navigate('/announcements')}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Exam</span>
                    <span className="text-[10px] text-gray-400">Yesterday</span>
                  </div>
                  <p className="text-sm font-bold text-text-primary group-hover:text-purple-600 transition-colors">Mid-Term Grades Submission</p>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">Portal closes on Friday. Please ensure all internal marks are uploaded.</p>
                </div>

                <div
                  onClick={() => navigate('/announcements')}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Event</span>
                    <span className="text-[10px] text-gray-400">2 days ago</span>
                  </div>
                  <p className="text-sm font-bold text-text-primary group-hover:text-green-600 transition-colors">Tech Fest Registration</p>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">Encourage students to participate in the upcoming Hackathon.</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-bg-secondary/50 text-center">
                <button
                  onClick={() => navigate('/announcements')}
                  className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors flex items-center justify-center w-full"
                >
                  <ChatBubbleLeftRightIcon className="w-3 h-3 mr-1" /> View All Notices
                </button>
              </div>
            </div>
          </div>


        </div>
      </main>
    </div>
  );
};

export default Dashboard;
