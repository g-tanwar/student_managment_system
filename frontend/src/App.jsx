import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import LoadingSpinner from './components/LoadingSpinner';

// Admin/Teacher pages
import Dashboard from './pages/admin/Dashboard';
import Students from './pages/admin/StudentManagement';
import Attendance from './pages/admin/BulkAttendance';
import Fees from './pages/admin/Fees';
import Exams from './pages/admin/Exams';
import Notices from './pages/common/Notices';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyAttendance from './pages/student/MyAttendance';
import MyMarksheet from './pages/student/MyMarksheet';
import FeeStatus from './pages/student/FeeStatus';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  const isAdminOrTeacher = user?.role === 'ADMIN' || user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';

  return (
    <Routes>
      {/* Public Route */}
      <Route 
        path="/login" 
        element={!user ? <LoginPage /> : <Navigate to={isStudent ? '/portal/dashboard' : '/dashboard'} />} 
      />

      {/* Protected Layout Routes */}
      <Route element={user ? <Layout /> : <Navigate to="/login" />}>
        
        {/* Admin/Teacher Routes */}
        {isAdminOrTeacher && (
          <>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/students"   element={<Students />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/fees"       element={<Fees />} />
            <Route path="/exams"      element={<Exams />} />
            <Route path="/notices"    element={<Notices />} />
          </>
        )}

        {/* Student Routes */}
        {isStudent && (
          <>
            <Route path="/portal/dashboard"  element={<StudentDashboard />} />
            <Route path="/portal/attendance" element={<MyAttendance />} />
            <Route path="/portal/marks"      element={<MyMarksheet />} />
            <Route path="/portal/fees"       element={<FeeStatus />} />
            <Route path="/portal/notices"    element={<Notices />} />
          </>
        )}

        {/* Root redirect */}
        <Route 
          path="/" 
          element={<Navigate to={isStudent ? '/portal/dashboard' : '/dashboard'} />} 
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
