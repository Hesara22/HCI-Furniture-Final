import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DesignDashboard from './components/DesignDashboard';

// Replace with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDd_anY5MzvKmURSBRh2uONOsGCB8FnGXg",
  authDomain: "desginer-app.firebaseapp.com",
  projectId: "desginer-app",
  storageBucket: "desginer-app.firebasestorage.app",
  messagingSenderId: "60360820123",
  appId: "1:60360820123:web:d7df6f9ffb9175e3b30d3e",
  measurementId: "G-G6DKWR1V5Z"
};

const app = initializeApp(firebaseConfig);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [designs, setDesigns] = useState(JSON.parse(localStorage.getItem('designs')) || []);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('designs', JSON.stringify(designs));
  }, [designs]);

  if (isLoggedIn === null) {
    return React.createElement('div', { className: 'min-h-screen flex items-center justify-center bg-gray-100' }, 'Loading...');
  }

  return React.createElement(
    BrowserRouter,
    null,
    React.createElement(
      Routes,
      null,
      React.createElement(Route, {
        path: '/',
        element: isLoggedIn ? React.createElement(Navigate, { to: '/dashboard' }) : React.createElement(Login)
      }),
      React.createElement(Route, {
        path: '/register',
        element: isLoggedIn ? React.createElement(Navigate, { to: '/dashboard' }) : React.createElement(Register)
      }),
      React.createElement(Route, {
        path: '/dashboard',
        element: isLoggedIn
          ? React.createElement(DesignDashboard, { designs, setDesigns })
          : React.createElement(Navigate, { to: '/' })
      })
    )
  );
};

export default App;