import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { register, error, setError, user, loading } = useAuth();
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

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}>
      <form onSubmit={handleSubmit} className="glass-card form-container animate-fade-in" id="register-form">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Register to manage your sales pipeline and track opportunities</p>

        {(localError || error) && (
          <div className="form-error">
            {localError || error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="register-name">Full Name</label>
          <input
            id="register-name"
            type="text"
            placeholder="John Doe"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-email">Email Address</label>
          <input
            id="register-email"
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
          <label className="form-label" htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="Min. 6 characters"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-confirm-password">Confirm Password</label>
          <input
            id="register-confirm-password"
            type="password"
            placeholder="Repeat password"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button
          id="register-submit"
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="form-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
