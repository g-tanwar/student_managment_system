import React, { useState, useEffect } from 'react';
import API from '../../../api/axios';
import './BulkAttendance.css';

const BulkAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchingStudents, setFetchingStudents] = useState(false);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [clsRes, secRes] = await Promise.all([
          API.get('/classes'),
          API.get('/sections')
        ]);
        setClasses(clsRes.data.data || []);
        setSections(secRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDropdowns();
  }, []);

  const handleFetchStudents = async () => {
    if (!classId || !sectionId) return alert('Please select class and section');
    setFetchingStudents(true);
    setStudents([]);
    try {
      const res = await API.get(`/students?classId=${classId}&sectionId=${sectionId}`);
      const fetchedStudents = res.data.data || [];
      setStudents(fetchedStudents);
      
      const initialAttendance = {};
      fetchedStudents.forEach(s => {
        initialAttendance[s._id] = 'PRESENT'; // Default
      });
      setAttendanceData(initialAttendance);
    } catch (err) {
      alert('Failed to fetch students');
    } finally {
      setFetchingStudents(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (students.length === 0) return alert('No students to mark');
    
    const payload = {
      classId,
      sectionId,
      date,
      records: students.map(s => ({
        studentId: s._id,
        status: attendanceData[s._id]
      }))
    };

    try {
      await API.post('/attendance/bulk', payload);
      alert('Attendance marked successfully!');
      setStudents([]); // Reset after submit
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit attendance');
    }
  };

  if (loading) return <div className="admin-page"><p>Loading...</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Bulk Attendance</h2>
      </div>

      <div className="attendance-selectors">
        <div className="selector-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={new Date().toISOString().split('T')[0]} />
        </div>
        <div className="selector-group">
          <label>Class</label>
          <select value={classId} onChange={(e) => setClassId(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
          </select>
        </div>
        <div className="selector-group">
          <label>Section</label>
          <select value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
            <option value="">Select Section</option>
            {sections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
          </select>
        </div>
        <button className="btn-fetch" onClick={handleFetchStudents} disabled={!classId || !sectionId || fetchingStudents}>
          {fetchingStudents ? 'Fetching...' : 'Fetch Students'}
        </button>
      </div>

      {students.length > 0 && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Enrollment No</th>
                <th>Student Name</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.enrollmentNo}</td>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>
                    <div className="radio-group">
                      <label className="radio-label present">
                        <input type="radio" name={`status-${student._id}`} checked={attendanceData[student._id] === 'PRESENT'} onChange={() => handleStatusChange(student._id, 'PRESENT')} />
                        Present
                      </label>
                      <label className="radio-label absent">
                        <input type="radio" name={`status-${student._id}`} checked={attendanceData[student._id] === 'ABSENT'} onChange={() => handleStatusChange(student._id, 'ABSENT')} />
                        Absent
                      </label>
                      <label className="radio-label late">
                        <input type="radio" name={`status-${student._id}`} checked={attendanceData[student._id] === 'LATE'} onChange={() => handleStatusChange(student._id, 'LATE')} />
                        Late
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="submit-container" style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button className="btn-submit" onClick={handleSubmit}>Submit Attendance</button>
          </div>
        </div>
      )}
      
      {students.length === 0 && !fetchingStudents && classId && sectionId && (
        <div className="empty-state">Click 'Fetch Students' to load the class list.</div>
      )}
    </div>
  );
};

export default BulkAttendance;
