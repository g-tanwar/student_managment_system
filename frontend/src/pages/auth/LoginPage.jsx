import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogIn, Mail, Lock, GraduationCap, UserPlus } from 'lucide-react';

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const res = isLoginMode 
        ? await login(email, password) 
        : await signup(email, password);
        
      if (!res.success) {
        setError(res.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-bg-decor1"></div>
      <div className="login-bg-decor2"></div>

      <div className="login-inner">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon-box">
              <GraduationCap size={40} />
            </div>
            <h1>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h1>
            <p>{isLoginMode ? 'Sign in to the Portal' : 'Register for access'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <span className="error-icon">!</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="student@school.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (isLoginMode ? 'Verifying...' : 'Creating...') : (
                <>
                  {isLoginMode ? <LogIn size={22} className="btn-icon" /> : <UserPlus size={22} className="btn-icon" />}
                  {isLoginMode ? 'Sign In' : 'Sign Up'}
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', margin: '0.2rem 0', color: 'var(--text-secondary)', fontWeight: '800' }}>OR</div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
              }}
            >
              {isLoginMode ? "Sign Up As New User" : "Sign In To Account"}
            </button>
          </form>
        </div>
        <p className="login-footer">
          &copy; 2026 EduPortal — Student Management System
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
