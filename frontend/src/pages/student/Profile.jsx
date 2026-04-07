import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <div className="page-card">
      <div className="page-header">
        <h1>User Profile</h1>
        <p>Manage your account settings and details.</p>
      </div>
      <div className="table-card" style={{ padding: '2rem' }}>
        <h2>Account Info</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </div>
  );
};

export default Profile;
