import { useAuth } from '../hooks/useAuth';
import { Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// Maps route paths to human-readable page titles
const pageTitles = {
  '/dashboard':  'Dashboard',
  '/attendance': 'Attendance',
  '/fees':       'Fee Management',
  '/notes':      'Notes',
  '/pomodoro':   'Focus Timer',
  '/schedule':   'Schedule',
  '/goals':      'Goals',
  '/profile':    'Profile',
};

const TopNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'EduPortal';
  const initials = user?.email?.[0]?.toUpperCase() || 'U';
  const emailDisplay = user?.email?.split('@')[0] || 'User';

  return (
    <header className="top-nav">
      <div className="topnav-left">
        {/* Dynamic page title */}
        <span className="topnav-title">{pageTitle}</span>

        <div className="search-bar">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            placeholder="Search anything..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topnav-right">
        <button className="notification-btn" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <div className="user-profile">
          <div className="user-info">
            <p className="user-email">{emailDisplay}</p>
            <span className="user-role">{user?.role || 'Student'}</span>
          </div>
          <div className="user-avatar">{initials}</div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
