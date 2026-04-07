import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogIn, Mail, Lock, GraduationCap, UserPlus, CheckCircle2 } from 'lucide-react';

const FEATURES = [
  { title: 'Track Attendance',    sub: 'Real-time class monitoring'   },
  { title: 'Manage Fees',         sub: 'Payments & fee history'       },
  { title: 'Pomodoro Timer',      sub: 'Stay focused, study smarter'  },
  { title: 'Goals & Notes',       sub: 'Plan, track & achieve more'   },
];

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode]   = useState(true);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [error, setError]               = useState('');
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
      if (!res.success) setError(res.error);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-split">

      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <div className="login-left-panel">
        {/* Animated grid + orbs */}
        <div className="login-grid-bg" />
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />

        <div className="login-left-content">
          {/* Logo – priority element */}
          <div className="login-logo-block">
            <div className="login-logo-icon">
              <GraduationCap size={36} strokeWidth={2} />
            </div>
            <div>
              <div className="login-logo-name">EduPortal</div>
              <div className="login-logo-tagline">Student Management System</div>
            </div>
          </div>

          {/* Hero image */}
          <div className="login-hero-img-wrap">
            <img
              src="/study-hero.png"
              alt="Study workspace"
              className="login-hero-img"
            />
            <div className="login-hero-img-overlay" />
          </div>

          {/* Feature list */}
          <div className="login-features">
            {FEATURES.map((f, i) => (
              <div key={i} className="login-feature-row">
                <CheckCircle2 size={16} className="login-feature-check" />
                <div>
                  <div className="login-feature-title">{f.title}</div>
                  <div className="login-feature-sub">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────── */}
      <div className="login-right-panel">
        <div className="login-right-orb" />

        <div className="login-form-wrap">
          {/* Header */}
          <div className="login-form-header">
            <div className="login-form-icon">
              {isLoginMode ? <LogIn size={22} /> : <UserPlus size={22} />}
            </div>
            <h1>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h1>
            <p>{isLoginMode ? 'Sign in to access your dashboard' : 'Register to get started'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form-fields">
            {error && (
              <div className="login-error">
                <span className="error-icon">!</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={15} className="input-icon" />
                <input
                  type="email" required placeholder="student@school.com"
                  className="form-input" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={15} className="input-icon" />
                <input
                  type="password" required placeholder="••••••••"
                  className="form-input" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="login-submit-btn">
              {isSubmitting
                ? (isLoginMode ? 'Verifying…' : 'Creating…')
                : (isLoginMode ? 'Sign In' : 'Create Account')}
            </button>

            <div className="login-divider"><span>or</span></div>

            <button
              type="button"
              className="login-toggle-btn"
              onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
            >
              {isLoginMode ? 'Create a New Account' : 'Already have an account? Sign In'}
            </button>
          </form>

          <p className="login-copyright">&copy; 2026 EduPortal — All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
