import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getMyAttendance } from '../../services/attendanceService';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import './Attendance.css';

const MyAttendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Natively track selected month for calendar
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const result = await getMyAttendance();
        setRecords(result.data || []);
      } catch (err) {
        console.error('Attendance fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchAttendance();
  }, [user]);

  const present = records.filter(r => r.status === 'Present').length;
  const absent  = records.filter(r => r.status === 'Absent').length;
  const percent = records.length ? Math.round((present / records.length) * 100) : 0;

  // --- Calendar Engine Computing ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Pre-calculate blanks for alignment standard US calendar
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  
  // Transform API records array into extreme high-speed date map isolated to specific status
  const attendanceMap = {};
  records.forEach(r => {
    if(!r.date) return;
    const d = new Date(r.date);
    // Key format: YYYY-M-D
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    attendanceMap[key] = r.status?.toLowerCase(); 
  });

  // Calculate actual block days
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${month}-${d}`;
    days.push({ day: d, status: attendanceMap[key] || 'default' });
  }

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div>
          <h1>Attendance Tracking</h1>
          <p>Visually monitor your academic consistency across the year.</p>
        </div>
      </div>

      <div className="attendance-layout">
        
        {/* Left: Interactive Metrics Board */}
        <div className="metrics-panel">
          <div className="attendance-percentage">
            <h2>{percent}%</h2>
            <p>Overall Standing</p>
          </div>

          <div className="stats-grid">
            <div className="stat-box total">
              <span className="stat-count">{records.length}</span>
              <div className="stat-label">Total Days</div>
            </div>
            <div className="stat-box present">
              <span className="stat-count">{present}</span>
              <div className="stat-label">Present</div>
            </div>
            <div className="stat-box absent">
              <span className="stat-count">{absent}</span>
              <div className="stat-label">Absent</div>
            </div>
          </div>
          
          <div className="page-card" style={{ marginTop: '0.5rem', padding: '1.5rem', flex: 1, boxShadow: 'none' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Consistency Note</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              Maintaining an attendance rate above 80% guarantees you remain in excellent standing across all technical and core modules. Use the interactive calendar to track any missed days structurally!
            </p>
          </div>
        </div>

        {/* Right: The Grid Calendar Engine */}
        <div className="calendar-panel">
          <div className="calendar-header">
            <h3><CalendarIcon color="var(--primary-hover)" /> {monthNames[month]} {year}</h3>
            <div className="month-nav">
              <button onClick={handlePrevMonth} aria-label="Previous Month">
                <ChevronLeft size={24} />
              </button>
              <button onClick={handleNextMonth} aria-label="Next Month">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">Rendering your calendar metrics...</div>
          ) : (
            <div className="calendar-wrapper">
              <div className="calendar-grid">
                {/* Headers */}
                {dayNames.map(day => (
                   <div key={day} className="calendar-day-header">{day}</div>
                ))}

                {/* Blank Offsets */}
                {blanks.map(blank => (
                  <div key={`blank-${blank}`} className="calendar-cell empty"></div>
                ))}

                {/* Day Blocks */}
                {days.map((dayObj) => (
                  <div 
                    key={dayObj.day} 
                    className={`calendar-cell ${dayObj.status}`}
                    title={dayObj.status !== 'default' ? `Marked: ${dayObj.status}` : 'No Record'}
                  >
                    {dayObj.day}
                  </div>
                ))}
              </div>

              {/* Status Legend */}
              <div className="calendar-legend">
                <div className="legend-item">
                  <span className="legend-dot present"></span> Present
                </div>
                <div className="legend-item">
                  <span className="legend-dot absent"></span> Absent
                </div>
                <div className="legend-item">
                  <span className="legend-dot default"></span> No Record
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyAttendance;
