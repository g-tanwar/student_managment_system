import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, ClipboardCheck, Wallet, FileText, 
  Timer, Calendar, Target, UserCircle, LogOut, GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Dashboard',  path: '/dashboard',  icon: LayoutDashboard },
    { name: 'Attendance', path: '/attendance',  icon: ClipboardCheck },
    { name: 'Fees',       path: '/fees',        icon: Wallet },
    { name: 'Notes',      path: '/notes',       icon: FileText },
    { name: 'Pomodoro',   path: '/pomodoro',    icon: Timer },
    { name: 'Schedule',   path: '/schedule',    icon: Calendar },
    { name: 'Goals',      path: '/goals',       icon: Target },
    { name: 'Profile',    path: '/profile',     icon: UserCircle },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <GraduationCap size={22} />
        </div>
        <div>
          <span className="sidebar-title">EduPortal</span>
          <span className="sidebar-subtitle">Student Hub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        {links.slice(0, 3).map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="link-icon">
                <Icon size={18} />
              </span>
              <span>{link.name}</span>
            </Link>
          );
        })}

        <div className="sidebar-section-label">Productivity</div>
        {links.slice(3, 7).map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="link-icon">
                <Icon size={18} />
              </span>
              <span>{link.name}</span>
            </Link>
          );
        })}

        <div className="sidebar-section-label">Account</div>
        {links.slice(7).map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="link-icon">
                <Icon size={18} />
              </span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <span className="link-icon">
            <LogOut size={18} />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
