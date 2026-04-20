import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../services/firebase';

const googleProvider = new GoogleAuthProvider();

// 1. Create the Auth Context
const AuthContext = createContext();

// 2. Custom Hook to easily consume the Auth Context in our components
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. AuthProvider Component that wraps the app and manages state
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up wrapper
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Log in wrapper
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Log in wrapper
  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Log out wrapper
  const logout = () => {
    return signOut(auth);
  };

  // 4. Listen for changes in the auth state (login/logout/refresh)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Firebase tracks the login session automatically using IndexedDB/LocalStorage
      setCurrentUser(user);
      setLoading(false); // Finished checking if a user exists
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []);

  // What context consumers will have access to
  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {/* We don't render children until the initial auth state check finishes */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
