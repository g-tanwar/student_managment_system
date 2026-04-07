import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import LoadingSpinner from './components/LoadingSpinner';

// Unified SaaS Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyAttendance from './pages/student/MyAttendance';
import FeeStatus from './pages/student/FeeStatus';
import Notes from './pages/student/Notes';
import Pomodoro from './pages/student/Pomodoro';
import Schedule from './pages/student/Schedule';
import Goals from './pages/student/Goals';
import Profile from './pages/student/Profile';

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
        element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} 
      />

      {/* Protected Layout Routes */}
      <Route element={user ? <Layout /> : <Navigate to="/login" />}>
        
        {/* Unified Dashboard Routes */}
        <Route path="/dashboard"  element={<StudentDashboard />} />
        <Route path="/attendance" element={<MyAttendance />} />
        <Route path="/fees"       element={<FeeStatus />} />
        <Route path="/notes"      element={<Notes />} />
        <Route path="/pomodoro"   element={<Pomodoro />} />
        <Route path="/schedule"   element={<Schedule />} />
        <Route path="/goals"      element={<Goals />} />
        <Route path="/profile"    element={<Profile />} />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
