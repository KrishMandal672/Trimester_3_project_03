import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    // Wrap the entire app in AuthProvider so any nested component can useAuth()
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - Anyone can access these */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 
            Protected Routes 
            We wrap the element inside <PrivateRoute>. 
            If the user isn't logged in, PrivateRoute intercepts and redirects them out. 
          */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />

          {/* Catch-all Route - redirect unknown URLs to /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
