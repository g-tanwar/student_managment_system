import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getMyFees } from '../../services/feeService';
import { Wallet, CheckCircle, AlertCircle, ReceiptText, UploadCloud, X, CheckCheck, History } from 'lucide-react';
import './Fees.css';

const FeeStatus = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const result = await getMyFees();
        setFees(result.data || []);
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

  // --- Receipt Upload Handlers ---
  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setUploadSuccess(false);
    setUploadProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleSimulatedUpload = () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(0);
    // Simulate upload progress increments
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
          setUploadSuccess(true);
          setSelectedFile(null);
          setUploadProgress(0);
        }, 500);
      } else {
        setUploadProgress(Math.round(progress));
      }
    }, 300);
  };

  return (
    <div className="fee-page">
      <div className="page-header">
        <div>
          <h1>Fee Management</h1>
          <p>Track your payment history and upload receipts instantly.</p>
        </div>
      </div>

      <div className="fee-layout">
        {/* Summary Cards */}
        <div className="fee-summary-grid">
          <div className="fee-stat-card total">
            <div className="fee-stat-icon total">
              <Wallet size={26} />
            </div>
            <div className="fee-stat-info">
              <label>Total Fees</label>
              <div className="amount">{formatCurrency(totalFees)}</div>
            </div>
          </div>
          <div className="fee-stat-card paid">
            <div className="fee-stat-icon paid">
              <CheckCircle size={26} />
            </div>
            <div className="fee-stat-info">
              <label>Total Paid</label>
              <div className="amount">{formatCurrency(paidFees)}</div>
            </div>
          </div>
          <div className="fee-stat-card due">
            <div className="fee-stat-icon due">
              <AlertCircle size={26} />
            </div>
            <div className="fee-stat-info">
              <label>Balance Due</label>
              <div className="amount">{formatCurrency(dueFees)}</div>
            </div>
          </div>
        </div>

        {/* History + Upload */}
        <div className="fee-bottom-grid">
          {/* Payment History Table */}
          <div className="table-card">
            <div className="table-card-header">
              <History size={18} color="var(--primary-hover)" />
              Payment History
            </div>
            {loading ? (
              <div className="loading-state">Loading fee records...</div>
            ) : error ? (
              <div className="loading-state" style={{ color: '#e74c3c' }}>{error}</div>
            ) : fees.length === 0 ? (
              <div className="empty-state">No fee records found.</div>
            ) : (
              <table className="fee-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fee Type</th>
                    <th>Year</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f, i) => (
                    <tr key={f._id}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 700 }}>{f.feeType || '—'}</td>
                      <td>{f.academicYear || '—'}</td>
                      <td>{formatCurrency(f.totalAmount || 0)}</td>
                      <td style={{ color: '#27ae60', fontWeight: 700 }}>{formatCurrency(f.paidAmount || 0)}</td>
                      <td style={{ color: '#e74c3c', fontWeight: 700 }}>{formatCurrency((f.totalAmount || 0) - (f.paidAmount || 0))}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{f.dueDate ? new Date(f.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td>
                        <span className={`fee-badge ${f.status?.toLowerCase()}`}>{f.status || 'Pending'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Upload Receipt Card */}
          <div className="upload-card">
            <h3><ReceiptText size={20} color="var(--primary-hover)" /> Upload Receipt</h3>

            {uploadSuccess ? (
              <div className="upload-success">
                <CheckCheck size={20} />
                Receipt submitted successfully!
              </div>
            ) : (
              <>
                {/* Dropzone */}
                <div
                  className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                  <UploadCloud size={40} className="upload-icon" />
                  <p>Drag & drop or <strong style={{ color: 'var(--primary-hover)' }}>click to browse</strong></p>
                  <span>Supports PDF, JPG, PNG — max 5MB</span>
                </div>

                {/* File Selected */}
                {selectedFile && (
                  <div className="uploaded-file">
                    <span className="uploaded-file-name">📄 {selectedFile.name}</span>
                    <button
                      className="remove-file-btn"
                      onClick={() => { setSelectedFile(null); setUploadProgress(0); }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Progress Bar */}
                {uploading && (
                  <div className="upload-progress">
                    <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}

                <button
                  className="upload-submit-btn"
                  disabled={!selectedFile || uploading}
                  onClick={handleSimulatedUpload}
                >
                  {uploading ? `Uploading... ${uploadProgress}%` : 'Submit Receipt'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeStatus;
