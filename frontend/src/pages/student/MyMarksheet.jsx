import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import API from '../../services/api';
import './Marksheet.css';

const getGrade = (obtained, total) => {
  const pct = (obtained / total) * 100;
  if (pct >= 90) return 'A';
  if (pct >= 75) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
};

const MyMarksheet = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await API.get(`/marks/student/${user?.id || user?._id}`);
        setMarks(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load marksheet.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMarks();
  }, [user]);

  const totalObtained = marks.reduce((sum, m) => sum + (m.marksObtained || 0), 0);
  const totalMax      = marks.reduce((sum, m) => sum + (m.maxMarks || 0), 0);
  const overallPct    = totalMax ? Math.round((totalObtained / totalMax) * 100) : 0;

  return (
    <div className="marksheet-page">
      <div className="page-header">
        <div>
          <h1>My Marksheet</h1>
          <p>Academic performance report card</p>
        </div>
        <button className="print-btn" onClick={() => window.print()}>
          🖨️ Print / Save as PDF
        </button>
      </div>

      <div className="report-card">
        <div className="report-card-header">
          <p className="school-name">Student Management System</p>
          <p className="report-title">Academic Progress Report</p>
        </div>

        <div className="student-meta">
          <div className="meta-item">
            <label>Student Email</label>
            <span>{user?.email || '—'}</span>
          </div>
          <div className="meta-item">
            <label>Role</label>
            <span>{user?.role || '—'}</span>
          </div>
          <div className="meta-item">
            <label>Generated On</label>
            <span>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading marksheet...</div>
        ) : error ? (
          <div className="loading-state" style={{ color: '#e74c3c', padding: '2rem' }}>{error}</div>
        ) : marks.length === 0 ? (
          <div className="loading-state">No marks available yet.</div>
        ) : (
          <table className="marksheet-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Exam</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Passing Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m, i) => {
                const grade = getGrade(m.marksObtained, m.maxMarks);
                return (
                  <tr key={m._id}>
                    <td>{i + 1}</td>
                    <td>{m.subjectId?.subjectName || '—'}</td>
                    <td>{m.examId?.examName || '—'}</td>
                    <td><strong>{m.marksObtained}</strong></td>
                    <td>{m.maxMarks}</td>
                    <td>{m.passingMarks}</td>
                    <td>
                      <span className={`grade-badge grade-${grade}`}>{grade}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="report-card-footer">
          <div className="total-summary">
            <div className="total-item">
              <label>Total Obtained</label>
              <span>{totalObtained}</span>
            </div>
            <div className="total-item">
              <label>Total Marks</label>
              <span>{totalMax}</span>
            </div>
            <div className="total-item">
              <label>Overall %</label>
              <span style={{ color: overallPct >= 60 ? '#27ae60' : '#e74c3c' }}>{overallPct}%</span>
            </div>
            <div className="total-item">
              <label>Overall Grade</label>
              <span>{getGrade(totalObtained, totalMax || 1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMarksheet;
