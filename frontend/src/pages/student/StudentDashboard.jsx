import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Flame, CheckCircle2, Wallet, TrendingUp,
  Calendar, Timer, BookOpen, Target, Clock
} from 'lucide-react';
import './Dashboard.css';

const QUOTE = "The secret of getting ahead is getting started. Make today count.";

const STUDY_PLAN = [
  { subject: 'Mathematics',   time: '9:00 – 10:30 AM' },
  { subject: 'Physics',       time: '11:00 – 12:00 PM' },
  { subject: 'Database Systems', time: '2:00 – 3:30 PM' },
  { subject: 'Revision',      time: '5:00 – 6:00 PM'  },
];

const TASKS = [
  { text: 'Submit assignment 3 – DBMS',   due: 'Today'    },
  { text: 'Prepare Physics lab report',    due: 'Tomorrow' },
  { text: 'Read OS chapter 7–8',           due: 'Wed'      },
  { text: 'Group study – Algorithms',      due: 'Thu'      },
];

const weeklyData = [
  { day: 'Mon', h: 60, val: '4h'   },
  { day: 'Tue', h: 80, val: '6h'   },
  { day: 'Wed', h: 40, val: '2h'   },
  { day: 'Thu', h: 90, val: '7h'   },
  { day: 'Fri', h: 65, val: '4.5h' },
  { day: 'Sat', h: 30, val: '1.5h' },
  { day: 'Sun', h: 10, val: '0.5h' },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const attendanceRate   = 85;
  const circleRadius     = 48;
  const circumference    = 2 * Math.PI * circleRadius;
  const dashOffset       = circumference - (attendanceRate / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <div className="loading-state">Loading dashboard…</div>;

  return (
    <div className="premium-dashboard">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>{greeting()}, {user?.email?.split('@')[0]}</h1>
          <p>Here's your productivity overview for today.</p>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: 320, textAlign: 'right' }}>
          "{QUOTE}"
        </div>
      </div>

      {/* ── Row 1: Metrics ── */}
      <div className="metrics-row">
        {/* Streak */}
        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <Flame size={15} className="widget-icon" /> Daily Streak
            </h3>
          </div>
          <div className="streak-display">
            <Flame size={32} className="streak-flame" />
            <div className="streak-number">12</div>
            <div className="streak-text">days consistent</div>
          </div>
        </div>

        {/* Attendance */}
        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <CheckCircle2 size={15} className="widget-icon" /> Attendance
            </h3>
          </div>
          <div className="progress-ring-container">
            <svg className="progress-ring" viewBox="0 0 110 110">
              <circle stroke="var(--pastel-bg)" strokeWidth="8" fill="transparent" r={circleRadius} cx="55" cy="55" />
              <circle
                className="progress-ring-circle"
                stroke="var(--primary-color)"
                strokeWidth="8" fill="transparent"
                r={circleRadius} cx="55" cy="55"
                style={{ strokeDasharray: circumference, strokeDashoffset: dashOffset }}
              />
            </svg>
            <div className="progress-ring-text">{attendanceRate}%</div>
            <div className="progress-label">Excellent standing</div>
          </div>
        </div>

        {/* Focus Time Today */}
        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <Clock size={15} className="widget-icon" /> Focus Time
            </h3>
          </div>
          <div className="focus-stat">
            <div className="focus-stat-value">4.5h</div>
            <div className="focus-stat-label">focused today</div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Goal: 6h &nbsp;·&nbsp; <span style={{ color: '#34D399' }}>75% complete</span>
            </div>
            {/* Mini progress bar */}
            <div style={{ width:'100%', background:'var(--pastel-bg)', borderRadius:4, height:4, marginTop:'0.5rem', overflow:'hidden' }}>
              <div style={{ width:'75%', height:'100%', background:'var(--primary-color)', borderRadius:4, transition:'width 1s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Chart + Fee ── */}
      <div className="analytical-row">
        {/* Weekly Output Chart */}
        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <TrendingUp size={15} className="widget-icon" /> Weekly Study Output
            </h3>
            <span style={{ fontSize:'0.75rem', color:'var(--text-secondary)' }}>hours/day</span>
          </div>
          <div className="chart-container">
            {weeklyData.map((d, i) => (
              <div className="chart-bar-wrap" key={i}>
                <div className="chart-bar" style={{ height: `${d.h}%` }}>
                  <span className="chart-value-tooltip">{d.val}</span>
                </div>
                <span className="chart-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Status */}
        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <Wallet size={15} className="widget-icon" /> Fee Status
            </h3>
          </div>
          <div className="streak-display" style={{ gap: '0.4rem' }}>
            <span style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Next Payment Due</span>
            <div className="fee-status-amount">$150.00</div>
            <span style={{ fontSize:'0.75rem', color:'var(--text-secondary)' }}>Due: Apr 20, 2026</span>
            <Link
              to="/fees"
              style={{
                marginTop: '0.75rem',
                display: 'inline-block',
                background: 'var(--primary-color)',
                color: '#000',
                padding: '0.4rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              Pay Now
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 3: Schedule + Tasks ── */}
      <div className="action-row">
        {/* Today's Schedule */}
        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <Calendar size={15} className="widget-icon" /> Today's Schedule
            </h3>
          </div>
          <div className="timeline">
            {[
              { time: '9:00 AM',  title: 'Mathematics',      sub: 'Lecture Hall B' },
              { time: '1:30 PM',  title: 'Physics Lab',       sub: 'Science Building' },
              { time: '4:00 PM',  title: 'Study Group',       sub: 'Library, Floor 2' },
            ].map((e, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-time">{e.time}</span>
                  <h4>{e.title}</h4>
                  <p>{e.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <Target size={15} className="widget-icon" /> Upcoming Tasks
            </h3>
          </div>
          <div className="study-plan-list">
            {TASKS.map((task, i) => (
              <div className="study-plan-item" key={i}>
                <span className="subject-dot" />
                <span style={{ flex: 1, fontSize: '0.825rem', color: 'var(--text-primary)' }}>{task.text}</span>
                <span className="subject-time">{task.due}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 4: Study Plan + Quick Pomodoro ── */}
      <div className="action-row">
        {/* Today's Study Plan */}
        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <BookOpen size={15} className="widget-icon" /> Today's Study Plan
            </h3>
          </div>
          <div className="study-plan-list">
            {STUDY_PLAN.map((s, i) => (
              <div className="study-plan-item" key={i}>
                <span className="subject-dot" style={{ background: ['#22D3EE','#34D399','#A78BFA','#FB923C'][i] }} />
                <span style={{ flex: 1 }}>{s.subject}</span>
                <span className="subject-time">{s.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Focus */}
        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <Timer size={15} className="widget-icon" /> Quick Focus
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Launch a Pomodoro session instantly.
          </p>
          <div className="pomo-display">
            <div className="pomo-time">25:00</div>
            <Link to="/pomodoro" className="pomo-action">
              <Timer size={14} /> Open Timer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
