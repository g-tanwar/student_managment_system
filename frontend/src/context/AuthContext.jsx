import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      
      // Backend response: { success: true, data: { token, user } }
      const { token: newToken, user: userData } = response.data.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  /**
   * Persistence: Verify token and keep session alive.
   * Hits GET /auth/me on every refresh.
   */
  const fetchMe = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await API.get('/auth/me');
      // Assuming consistent data nesting: { success: true, data: user }
      setUser(response.data.data || response.data); 
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []); // Run on mount (refresh)

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      role: user?.role, // ADMIN, TEACHER, STUDENT
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
