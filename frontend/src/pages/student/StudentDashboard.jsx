import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Flame, Clock, CalendarHeart, Wallet, 
  Sparkles, TrendingUp, Calendar, Timer, CheckCircle 
} from 'lucide-react';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Mocking an 85% attendance for visual
  const attendanceRate = 85; 
  const circleRadius = 55;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleDashOffset = circleCircumference - (attendanceRate / 100) * circleCircumference;

  // Mocking weekly chart data mapping heights (in percentage max 100%)
  const weeklyData = [
    { day: 'Mon', h: 60, val: '4h' },
    { day: 'Tue', h: 80, val: '6h' },
    { day: 'Wed', h: 40, val: '2h' },
    { day: 'Thu', h: 90, val: '7h' },
    { day: 'Fri', h: 65, val: '4.5h' },
    { day: 'Sat', h: 30, val: '1.5h' },
    { day: 'Sun', h: 10, val: '0.5h' }
  ];

  useEffect(() => {
    // Artificial load to mimic fetching data
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, [user]);

  const greetTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="premium-dashboard">
      <div className="page-header">
        <div>
          <h1>{greetTime()}, {user?.email?.split('@')[0]} 👋</h1>
          <p>Here's your productivity overview for today.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Syncing dashboard data...</div>
      ) : (
        <>
          {/* Top Metrics Row */}
          <div className="metrics-row">
            
            <div className="page-card widget-card">
              <div className="widget-header">
                <h3 className="widget-title"><Flame className="widget-icon" /> Daily Streak</h3>
              </div>
              <div className="streak-display">
                <Flame size={48} className="streak-flame" />
                <div className="streak-number">12</div>
                <div className="streak-text">Days on fire! Keep it up.</div>
              </div>
            </div>

            <div className="page-card widget-card">
              <div className="widget-header">
                <h3 className="widget-title"><CheckCircle className="widget-icon" /> Attendance</h3>
              </div>
              <div className="progress-ring-container">
                <svg className="progress-ring" viewBox="0 0 140 140">
                  <circle
                    stroke="var(--pastel-bg)"
                    strokeWidth="12"
                    fill="transparent"
                    r={circleRadius}
                    cx="70"
                    cy="70"
                  />
                  <circle
                    className="progress-ring-circle"
                    stroke="var(--primary-color)"
                    strokeWidth="12"
                    fill="transparent"
                    r={circleRadius}
                    cx="70"
                    cy="70"
                    style={{ strokeDasharray: circleCircumference, strokeDashoffset: circleDashOffset }}
                  />
                </svg>
                <div className="progress-ring-text">{attendanceRate}%</div>
                <div className="progress-label">Excellent Standing</div>
              </div>
            </div>

            <div className="page-card widget-card ai-card">
              <div className="widget-header">
                <h3 className="widget-title"><Sparkles className="widget-icon" /> Insight</h3>
              </div>
              <div className="ai-text">
                "You've shown tremendous consistency this week. Focus on Advanced Mathematics today to crush your goals!"
              </div>
            </div>
          </div>

          {/* Analytical Row */}
          <div className="analytical-row">
            <div className="page-card widget-card">
              <div className="widget-header">
                <h3 className="widget-title"><TrendingUp className="widget-icon" /> Weekly Output</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Activity hours over the past 7 days.</p>
              
              <div className="chart-container">
                {weeklyData.map((data, idx) => (
                  <div className="chart-bar-wrap" key={idx}>
                    <div className="chart-bar" style={{ height: `${data.h}%` }}>
                      <span className="chart-value-tooltip">{data.val}</span>
                    </div>
                    <span className="chart-label">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="page-card widget-card">
              <div className="widget-header">
                <h3 className="widget-title"><Wallet className="widget-icon" /> Fee Status</h3>
              </div>
              <div className="streak-display" style={{ padding: '1rem 0' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Next Payment Due</span>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0' }}>$150.00</span>
                <Link to="/fees" style={{ color: 'var(--primary-hover)', fontWeight: 700 }}>Pay Now</Link>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="action-row">
            <div className="page-card widget-card">
              <div className="widget-header">
                <h3 className="widget-title"><Calendar className="widget-icon" /> Today's Schedule</h3>
              </div>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-time">10:00 AM</span>
                    <h4>Core Mathematics</h4>
                    <p>Room 304 - Assignment Review</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-time">01:30 PM</span>
                    <h4>Physics Lab</h4>
                    <p>Science Building - Lab 12</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-time">04:00 PM</span>
                    <h4>Study Group</h4>
                    <p>Library Main Floor</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="page-card widget-card">
              <div className="widget-header">
                <h3 className="widget-title"><Timer className="widget-icon" /> Quick Focus</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Launch an instant Pomodoro session.</p>
              
              <div className="pomo-display">
                <div className="pomo-time">25:00</div>
                <Link to="/pomodoro" className="pomo-action" style={{ textDecoration: 'none' }}>
                  <Timer size={18} /> Launch Timer
                </Link>
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default StudentDashboard;
