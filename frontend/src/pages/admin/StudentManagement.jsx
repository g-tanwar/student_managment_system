import React, { useState, useEffect } from 'react';
import API from '../../../api/axios';
import './Students.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    enrollmentNo: '',
    firstName: '',
    lastName: '',
    gender: 'Other',
    dob: '',
    classId: '',
    sectionId: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, classesRes, sectionsRes] = await Promise.all([
        API.get('/students'),
        API.get('/classes'),
        API.get('/sections')
      ]);
      setStudents(studentsRes.data.data || []);
      setClasses(classesRes.data.data || []);
      setSections(sectionsRes.data.data || []);
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/students', formData);
      setIsModalOpen(false);
      setFormData({
        enrollmentNo: '',
        firstName: '',
        lastName: '',
        gender: 'Other',
        dob: '',
        classId: '',
        sectionId: ''
      });
      fetchData(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await API.delete(`/students/${id}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete student');
      }
    }
  };

  const getClassName = (id) => {
    const cls = classes.find(c => c._id === id);
    return cls ? cls.className : 'N/A';
  };

  const getSectionName = (id) => {
    const sec = sections.find(s => s._id === id);
    return sec ? sec.sectionName : 'N/A';
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Student Management</h2>
        <button className="btn-add" onClick={() => setIsModalOpen(true)}>+ Add Student</button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div className="admin-table-container">
        {loading ? (
          <p style={{ padding: '1rem' }}>Loading...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Enrollment No</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Class</th>
                <th>Section</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.enrollmentNo}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.gender}</td>
                  <td>{new Date(student.dob).toLocaleDateString()}</td>
                  <td>{getClassName(student.classId?._id || student.classId)}</td>
                  <td>{getSectionName(student.sectionId?._id || student.sectionId)}</td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDelete(student._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Student</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Enrollment No</label>
                <input type="text" name="enrollmentNo" required value={formData.enrollmentNo} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" required value={formData.gender} onChange={handleInputChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Class</label>
                <select name="classId" required value={formData.classId} onChange={handleInputChange}>
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.className}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Section</label>
                <select name="sectionId" required value={formData.sectionId} onChange={handleInputChange}>
                  <option value="">Select Section</option>
                  {sections.map(sec => (
                    <option key={sec._id} value={sec._id}>{sec.sectionName}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
