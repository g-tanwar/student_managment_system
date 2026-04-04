import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import LoadingSpinner from './components/LoadingSpinner';

// Role-based pages
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import Exams from './pages/Exams';
import Profile from './pages/Profile';
import Marks from './pages/Marks';
import Notices from './pages/Notices';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route 
        path="/login" 
        element={!user ? <LoginPage /> : <Navigate to={user.role === 'STUDENT' ? '/portal/dashboard' : '/dashboard'} />} 
      />

      {/* Protected Layout Routes */}
      <Route element={user ? <Layout /> : <Navigate to="/login" />}>
        
        {/* Admin/Teacher Routes */}
        {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/exams" element={<Exams />} />
          </>
        )}

        {/* Student Routes */}
        {user?.role === 'STUDENT' && (
          <>
            <Route path="/portal/dashboard" element={<Profile />} />
            <Route path="/portal/attendance" element={<Attendance />} />
            <Route path="/portal/marks" element={<Marks />} />
            <Route path="/portal/notices" element={<Notices />} />
          </>
        )}

        {/* Root Redirects */}
        <Route 
          path="/" 
          element={<Navigate to={user?.role === 'STUDENT' ? '/portal/dashboard' : '/dashboard'} />} 
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
