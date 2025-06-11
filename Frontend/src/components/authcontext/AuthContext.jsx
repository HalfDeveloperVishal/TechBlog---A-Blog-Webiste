// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('access_token');
  });
  const [isChecking, setIsChecking] = useState(true);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/token/verify/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
    setIsChecking(false);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const login = (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setIsLoggedIn(true);
    setIsChecking(false);
    toast.success('Logged in successfully!');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setIsChecking(false);
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isChecking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
