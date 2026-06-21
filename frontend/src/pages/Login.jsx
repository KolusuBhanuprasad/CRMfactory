import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { login, error, setError, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    // Clean up error state on mount
    setError(null);
  }, [user, navigate, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}>
      <form onSubmit={handleSubmit} className="glass-card form-container animate-fade-in" id="login-form">
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Enter your credentials to access your CRM pipeline</p>

        {(localError || error) && (
          <div className="form-error">
            {localError || error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            placeholder="name@company.com"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button
          id="login-submit"
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <p className="form-footer">
          Don't have an account? <Link to="/register">Create one here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
