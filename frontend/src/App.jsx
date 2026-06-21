import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OpportunityForm from './pages/OpportunityForm';

// Route Guard for authenticated users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Checking authorization...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main Layout Wrapper
const AppLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        {/* Redirect from home to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opportunity/new"
          element={
            <ProtectedRoute>
              <OpportunityForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opportunity/edit/:id"
          element={
            <ProtectedRoute>
              <OpportunityForm />
            </ProtectedRoute>
          }
        />
        
        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
};

export default App;
