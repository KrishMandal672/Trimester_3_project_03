import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  // If the user isn't authenticated, proactively kick them out to the login page.
  if (!currentUser) {
    // We use "replace" so that hitting the back button doesn't take them 
    // back to the unauthenticated private route
    return <Navigate to="/login" replace />;
  }

  // If they are authenticated, allow them to view whatever is nested inside this component
  return children;
}
