import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, ClipboardCheck, Wallet, FileText, 
  Timer, Calendar, Target, UserCircle, LogOut, GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance', path: '/attendance', icon: ClipboardCheck },
    { name: 'Fees', path: '/fees', icon: Wallet },
    { name: 'Notes', path: '/notes', icon: FileText },
    { name: 'Pomodoro', path: '/pomodoro', icon: Timer },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <GraduationCap color="#3b82f6" size={28} />
        <span className="sidebar-title">EduPortal</span>
      </div>
      
      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={22} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
