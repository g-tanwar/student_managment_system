import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import './Fees.css';

const FeeStatus = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await API.get('/fees');
        setFees(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load fee data.');
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  const totalFees = fees.reduce((sum, f) => sum + (f.totalAmount || 0), 0);
  const paidFees  = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
  const dueFees   = totalFees - paidFees;

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="fee-page">
      <div className="page-header">
        <div>
          <h1>Fee Status</h1>
          <p>Your complete fee payment summary and history</p>
        </div>
      </div>

      {/* Summary Top Section */}
      <div className="fee-summary-grid">
        <div className="fee-stat-card total">
          <div className="fee-stat-icon total">💰</div>
          <div className="fee-stat-info">
            <label>Total Fees</label>
            <div className="amount">{formatCurrency(totalFees)}</div>
          </div>
        </div>
        <div className="fee-stat-card paid">
          <div className="fee-stat-icon paid">✅</div>
          <div className="fee-stat-info">
            <label>Total Paid</label>
            <div className="amount">{formatCurrency(paidFees)}</div>
          </div>
        </div>
        <div className="fee-stat-card due">
          <div className="fee-stat-icon due">⚠️</div>
          <div className="fee-stat-info">
            <label>Amount Due</label>
            <div className="amount">{formatCurrency(dueFees)}</div>
          </div>
        </div>
      </div>

      {/* Detailed History Table */}
      <div className="table-card">
        <div className="table-card-header">Payment History</div>
        {loading ? (
          <div className="loading-state">Loading fee records...</div>
        ) : error ? (
          <div className="loading-state" style={{ color: '#e74c3c', padding: '2rem' }}>{error}</div>
        ) : fees.length === 0 ? (
          <div className="loading-state">No fee records found.</div>
        ) : (
          <table className="fee-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Fee Type</th>
                <th>Academic Year</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Balance Due</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f, i) => (
                <tr key={f._id}>
                  <td>{i + 1}</td>
                  <td>{f.feeType || '—'}</td>
                  <td>{f.academicYear || '—'}</td>
                  <td>{formatCurrency(f.totalAmount || 0)}</td>
                  <td style={{ color: '#27ae60', fontWeight: 600 }}>{formatCurrency(f.paidAmount || 0)}</td>
                  <td style={{ color: '#e74c3c', fontWeight: 600 }}>{formatCurrency((f.totalAmount || 0) - (f.paidAmount || 0))}</td>
                  <td>{f.dueDate ? new Date(f.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                  <td>
                    <span className={`fee-badge ${f.status?.toLowerCase()}`}>{f.status || 'Pending'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FeeStatus;
