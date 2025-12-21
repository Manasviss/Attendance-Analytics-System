import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Signup from './pages/Signup';
import AttendanceSheet from './pages/AttendanceSheet';
import StudentsPage from './pages/StudentsPage';
import ReportsPage from './pages/ReportsPage';
import FaceAttendance from './pages/FaceAttendance';
import RegisterFace from './pages/RegisterFace';
import LeaveApplication from './pages/LeaveApplication';
import LeaveRequests from './pages/LeaveRequests';
import Timetable from './pages/Timetable';
import Help from './pages/Help';
import Profile from './pages/Profile';
import Announcements from './pages/Announcements';
import PageTransition from './components/PageTransition';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/attendance" element={
                <PrivateRoute>
                  <AttendanceSheet />
                </PrivateRoute>
              } />
              <Route path="/students" element={
                <PrivateRoute>
                  <StudentsPage />
                </PrivateRoute>
              } />
              <Route path="/reports" element={
                <PrivateRoute>
                  <ReportsPage />
                </PrivateRoute>
              } />
              <Route path="/leave" element={
                <PrivateRoute>
                  <LeaveApplication />
                </PrivateRoute>
              } />
              <Route path="/leave-requests" element={
                <PrivateRoute>
                  <LeaveRequests />
                </PrivateRoute>
              } />
              <Route path="/timetable" element={
                <PrivateRoute>
                  <Timetable />
                </PrivateRoute>
              } />
              <Route path="/help" element={
                <PrivateRoute>
                  <Help />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/announcements" element={
                <PrivateRoute>
                  <Announcements />
                </PrivateRoute>
              } />
            </Routes>
          </PageTransition>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
