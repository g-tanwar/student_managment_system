import { useAuth } from '../hooks/useAuth';
import { Search, Bell } from 'lucide-react';

const TopNav = () => {
  const { user } = useAuth();
  
  return (
    <header className="top-nav">
      <div className="topnav-left">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search students, classes, or fees..." 
            className="search-input" 
          />
        </div>
      </div>
      
      <div className="topnav-right">
        <button className="notification-btn">
          <Bell size={22} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <div className="user-info">
            <p className="user-email">{user?.email}</p>
            <span className="user-role">{user?.role}</span>
          </div>
          <div className="user-avatar">
            {user?.email?.[0].toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
