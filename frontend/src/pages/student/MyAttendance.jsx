import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import './Attendance.css';

const MyAttendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await API.get(`/attendances/student/${user?.id || user?._id}`);
        setRecords(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load attendance data.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchAttendance();
  }, [user]);

  const present = records.filter(r => r.status === 'Present').length;
  const absent  = records.filter(r => r.status === 'Absent').length;
  const percent = records.length ? Math.round((present / records.length) * 100) : 0;

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div>
          <h1>My Attendance</h1>
          <p>Your full attendance history for this academic year</p>
        </div>
      </div>

      <div className="attendance-summary">
        <div className="att-stat">
          <span className="stat-num">{records.length}</span>
          <div className="stat-label">Total Days</div>
        </div>
        <div className="att-stat present">
          <span className="stat-num">{present}</span>
          <div className="stat-label">Present</div>
        </div>
        <div className="att-stat absent">
          <span className="stat-num">{absent}</span>
          <div className="stat-label">Absent</div>
        </div>
        <div className="att-stat percent">
          <span className="stat-num">{percent}%</span>
          <div className="stat-label">Attendance %</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">Attendance Records</div>
        {loading ? (
          <div className="loading-state">Loading attendance...</div>
        ) : error ? (
          <div className="loading-state" style={{ color: '#e74c3c' }}>{error}</div>
        ) : records.length === 0 ? (
          <div className="loading-state">No attendance records found.</div>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>{r.subjectId?.subjectName || '—'}</td>
                  <td>
                    <span className={`status-badge ${r.status?.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>{r.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;
