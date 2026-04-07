import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import API from '../../services/api';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noticeRes] = await Promise.allSettled([
          API.get('/notices?limit=5'),
        ]);
        if (noticeRes.status === 'fulfilled') {
          setNotices(noticeRes.value.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const greetTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>{greetTime()}, {user?.email?.split('@')[0]} 👋</h1>
        <p>Here's a summary of your academic status</p>
      </div>

      <div className="info-cards-grid">
        {/* Attendance Card */}
        <div className="info-card">
          <div className="card-icon-wrap green">✅</div>
          <p className="card-label">Attendance</p>
          <p className="card-value">—</p>
          <p className="card-sub">View your full attendance record</p>
          <Link to="/portal/attendance" className="card-footer-link">View Details →</Link>
        </div>

        {/* Fee Status Card */}
        <div className="info-card">
          <div className="card-icon-wrap blue">💳</div>
          <p className="card-label">Fee Status</p>
          <p className="card-value">—</p>
          <p className="card-sub">Check your payment history</p>
          <Link to="/portal/fees" className="card-footer-link">View Details →</Link>
        </div>

        {/* Notices Card */}
        <div className="info-card">
          <div className="card-icon-wrap orange">📢</div>
          <p className="card-label">Notices</p>
          <p className="card-value">{loading ? '...' : notices.length}</p>
          <p className="card-sub">Latest announcements</p>
          <Link to="/portal/notices" className="card-footer-link">View All →</Link>
        </div>
      </div>

      {/* Recent Notices */}
      <div className="notices-section">
        <h3 className="section-title">📋 Recent Notices</h3>
        {loading ? (
          <div className="loading-state">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="empty-state">No notices available at this time.</div>
        ) : (
          <div className="notice-list">
            {notices.map((n) => (
              <div className="notice-item" key={n._id}>
                <h4>{n.title}</h4>
                <p>{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
