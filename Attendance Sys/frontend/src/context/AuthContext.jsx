import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // System Date for Demo Mode (default to real today)
  const [systemDate, setSystemDateState] = useState(() => {
    const saved = localStorage.getItem('systemDate');
    return saved ? new Date(saved) : new Date();
  });
  const navigate = useNavigate();

  const setSystemDate = (date) => {
    setSystemDateState(date);
    localStorage.setItem('systemDate', date.toISOString());
  };

  // Register function
  async function register(name, uid, password, role) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, uid, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Save token and user
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setCurrentUser(data.user);
    return data.user;
  }

  // Login function
  async function login(uid, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Save token and user
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setCurrentUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
  }

  // Update user state manually (e.g. after profile update)
  function updateUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
  }

  // Check for existing session on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setCurrentUser(data.data);
        } else {
          // Token invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Notifications Logic
  const [notifications, setNotifications] = useState([]);

  const addNotification = (note) => {
    setNotifications(prev => [note, ...prev]);
  };

  // Poll for notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    if (currentUser) {
      fetchNotifications(); // Initial fetch
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [currentUser]);

  const [showSystemMsg, setShowSystemMsg] = useState(true);

  const markAllRead = async () => {
    setShowSystemMsg(false);
    setNotifications([]);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  const systemNotification = {
    _id: 'sys_pinned',
    title: 'System Update',
    message: 'Welcome back! The server is running at optimal performance. Remember to submit weekly reports by Friday.',
    type: 'Info',
    time: 'Pinned'
  };

  const finalNotifications = showSystemMsg ? [systemNotification, ...notifications] : notifications;

  const value = {
    currentUser,
    register,
    login,
    logout,
    updateUser,
    systemDate,
    setSystemDate,
    notifications: finalNotifications,
    addNotification,
    markAllRead
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
