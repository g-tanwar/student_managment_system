import { useAuth } from '../hooks/useAuth';

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

export default TopNav;
