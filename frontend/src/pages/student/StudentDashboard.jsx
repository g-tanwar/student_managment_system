import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getMyFees } from '../../services/feeService';
import { getMyAttendance } from '../../services/attendanceService';
import {
  Flame, CheckCircle2, Wallet, TrendingUp,
  Calendar, Timer, BookOpen, Target, Clock, Play
} from 'lucide-react';
import './Dashboard.css';

const QUOTE = "The secret of getting ahead is getting started. Make today count.";
const GOALS_KEY = 'eduportal_goals';
const SCHEDULE_KEY = 'eduportal_schedule';
const POMO_KEY = 'eduportal_pomo_stats';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // Real-world dynamic states
  const [loading, setLoading] = useState(true);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [feesDue, setFeesDue] = useState(0);
  
  // Local persistence states
  const [tasks, setTasks] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  
  // Focus Time stats
  const [focusToday, setFocusToday] = useState(0); // in hours
  const [weeklyData, setWeeklyData] = useState([]);
  const [streak, setStreak] = useState(0);

  const fetchDynamicData = async () => {
    try {
      // 1. Fetch live API data concurrently
      const [feeRes, attRes] = await Promise.allSettled([
        getMyFees(),
        getMyAttendance()
      ]);

      if (feeRes.status === 'fulfilled' && feeRes.value.data) {
        const feesList = feeRes.value.data;
        const total = feesList.reduce((acc, f) => acc + (f.totalAmount || 0), 0);
        const paid = feesList.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
        setFeesDue(total - paid);
      }

      if (attRes.status === 'fulfilled' && attRes.value.summary) {
        const { PRESENT, TOTAL_DAYS } = attRes.value.summary;
        if (TOTAL_DAYS > 0) {
          setAttendanceRate(Math.round((PRESENT / TOTAL_DAYS) * 100));
        }
      }

      // 2. Fetch Tasks from LocalStorage
      try {
        const loadedGoals = JSON.parse(localStorage.getItem(GOALS_KEY)) || [];
        const pendingTasks = loadedGoals.filter(g => !g.completed).slice(0, 4);
        setTasks(pendingTasks);
      } catch (e) {}

      // 3. Fetch Today's Schedule from LocalStorage
      try {
        const loadedSchedule = JSON.parse(localStorage.getItem(SCHEDULE_KEY)) || [];
        const todayDayIndex = new Date().getDay();
        const todayPlan = loadedSchedule
          .filter(s => Number(s.day) === todayDayIndex)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .slice(0, 4);
        setStudyPlan(todayPlan);
      } catch (e) {}

      // 4. Calculate Pomodoro Stats (Focus Time & Streak)
      try {
        const pomoStats = JSON.parse(localStorage.getItem(POMO_KEY)) || {};
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Today's focus time
        const todayMins = pomoStats[todayStr] || 0;
        setFocusToday(todayMins / 60);

        // Weekly Output Chart Data calculation
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const chartData = [];
        const now = new Date();
        const currentDayIdx = now.getDay(); // 0 is Sunday
        
        // Let's create an array showing Monday to Sunday of the CURRENT week
        // Note: adjust if week starts on a different day, we'll assume Mon-Sun
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - currentDayIdx + (currentDayIdx === 0 ? -6 : 1)); // start on Monday

        let maxMins = 1; // prevent div by zero
        // pre-calculate max to scale chart
        for (let i = 0; i < 7; i++) {
          const d = new Date(weekStart);
          d.setDate(weekStart.getDate() + i);
          const dateStr = d.toISOString().split('T')[0];
          const mins = pomoStats[dateStr] || 0;
          if (mins > maxMins) maxMins = mins;
        }

        for (let i = 0; i < 7; i++) {
          const d = new Date(weekStart);
          d.setDate(weekStart.getDate() + i);
          const dateStr = d.toISOString().split('T')[0];
          const mins = pomoStats[dateStr] || 0;
          
          chartData.push({
            day: days[d.getDay()],
            h: Math.min((mins / maxMins) * 100, 100), // Height percentage
            val: (mins / 60).toFixed(1) + 'h'
          });
        }
        setWeeklyData(chartData);

        // Simple Streak Calculation (backwards counting from today/yesterday)
        let streakCount = 0;
        let testDate = new Date();
        // If they haven't studied today, see if they studied yesterday
        if (!pomoStats[todayStr]) {
          testDate.setDate(testDate.getDate() - 1);
        }
        
        while (true) {
          const sDate = testDate.toISOString().split('T')[0];
          if (pomoStats[sDate] && pomoStats[sDate] > 0) {
            streakCount++;
            testDate.setDate(testDate.getDate() - 1);
          } else {
            break;
          }
        }
        setStreak(streakCount);
      } catch (e) {}

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDynamicData();
  }, []);

  const circleRadius     = 48;
  const circumference    = 2 * Math.PI * circleRadius;
  const dashOffset       = circumference - (attendanceRate / 100) * circumference;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <div className="loading-state">Syncing real-time workspace…</div>;

  return (
    <div className="premium-dashboard">
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
        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <Flame size={15} className="widget-icon" /> Daily Streak
            </h3>
          </div>
          <div className="streak-display">
            <Flame size={32} className="streak-flame" />
            <div className="streak-number">{streak}</div>
            <div className="streak-text">days consistent</div>
          </div>
        </div>

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
            <div className="progress-label">{attendanceRate > 80 ? 'Excellent standing' : attendanceRate > 60 ? 'Needs attention' : 'Critical state'}</div>
          </div>
        </div>

        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <Clock size={15} className="widget-icon" /> Focus Time
            </h3>
          </div>
          <div className="focus-stat">
            <div className="focus-stat-value">{focusToday.toFixed(1)}h</div>
            <div className="focus-stat-label">focused today</div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Goal: 6h &nbsp;·&nbsp; <span style={{ color: '#34D399' }}>{Math.round(Math.min((focusToday/6)*100, 100))}% complete</span>
            </div>
            <div style={{ width:'100%', background:'var(--pastel-bg)', borderRadius:4, height:4, marginTop:'0.5rem', overflow:'hidden' }}>
              <div style={{ width:`${Math.min((focusToday/6)*100, 100)}%`, height:'100%', background:'var(--primary-color)', borderRadius:4, transition:'width 1s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Chart + Fee ── */}
      <div className="analytical-row">
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
                <div className="chart-bar" style={{ height: `${d.h || 5}%`, opacity: d.h > 0 ? 1 : 0.3 }}>
                  <span className="chart-value-tooltip">{d.val}</span>
                </div>
                <span className="chart-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <Wallet size={15} className="widget-icon" /> Fee Status
            </h3>
          </div>
          <div className="streak-display" style={{ gap: '0.4rem' }}>
            <span style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Overall Balance Due</span>
            <div className="fee-status-amount">${feesDue.toFixed(2)}</div>
            {feesDue === 0 ? (
              <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>All paid up!</span>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      {/* ── Row 3: Schedule + Tasks ── */}
      <div className="action-row">
        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <Calendar size={15} className="widget-icon" /> Today's Schedule
            </h3>
          </div>
          <div className="timeline">
            {studyPlan.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem' }}>
                No events scheduled for today.
              </div>
            ) : (
              studyPlan.map((e, i) => (
                <div className="timeline-item" key={i}>
                  <div className="timeline-dot" style={{ borderColor: e.color || 'var(--primary-color)' }} />
                  <div className="timeline-content">
                    <span className="timeline-time">{e.startTime} - {e.endTime}</span>
                    <h4 style={{ color: e.color }}>{e.title}</h4>
                    <p>{e.subject}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="page-card widget-card">
          <div className="widget-header">
            <h3 className="widget-title">
              <Target size={15} className="widget-icon" /> Upcoming Tasks
            </h3>
            <Link to="/goals" style={{ fontSize: '0.75rem', color: 'var(--primary-color)' }}>View All</Link>
          </div>
          <div className="study-plan-list">
            {tasks.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '1rem 0' }}>
                You have no pending tasks.
              </div>
            ) : (
              tasks.map((task, i) => (
                <div className="study-plan-item" key={i}>
                  <span className="subject-dot" style={{ background: task.color || 'var(--primary-color)' }} />
                  <span style={{ flex: 1, fontSize: '0.825rem', color: 'var(--text-primary)' }}>{task.text}</span>
                  <span className="subject-time">{task.priority}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Row 4: Quick Pomodoro ── */}
      <div className="action-row" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
        <div className="page-card widget-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem' }}>
          <div>
            <h3 className="widget-title" style={{ marginBottom: '0.2rem' }}>
              <Timer size={18} className="widget-icon" style={{ color: 'var(--primary-color)' }} /> 
              Enter Focus Mode
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Launch a Pomodoro session instantly and start tracking hours against your daily goal.
            </p>
          </div>
          <Link to="/pomodoro" className="pomo-action" style={{ background: 'var(--primary-color)', color: '#000', border: 'none' }}>
            <Play size={16} /> Start 25:00
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
