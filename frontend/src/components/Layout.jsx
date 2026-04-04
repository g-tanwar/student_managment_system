import { useAuth } from '../context/AuthContext';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ClipboardCheck, Wallet, GraduationCap, 
  UserCircle, BarChart3, Bell, LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: ClipboardCheck },
    { name: 'Fees', path: '/fees', icon: Wallet },
    { name: 'Exams', path: '/exams', icon: GraduationCap },
  ];

  const studentLinks = [
    { name: 'My Profile', path: '/portal/dashboard', icon: UserCircle },
    { name: 'My Attendance', path: '/portal/attendance', icon: ClipboardCheck },
    { name: 'My Marks', path: '/portal/marks', icon: BarChart3 },
    { name: 'Notice Board', path: '/portal/notices', icon: Bell },
  ];

  const links = user?.role === 'ADMIN' || user?.role === 'TEACHER' ? adminLinks : studentLinks;

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
              <Icon size={20} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

const TopNav = () => {
  const { user } = useAuth();
  return (
    <header className="top-nav">
      <h2 className="nav-title">Management System</h2>
      
      <div className="user-profile">
        <div className="user-info">
          <p className="user-email">{user?.email}</p>
          <span className="user-role">{user?.role}</span>
        </div>
        <div className="user-avatar">
          {user?.email?.[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
};

const Layout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-wrapper">
        <TopNav />
        <main className="main-content">
          <div className="content-max">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
