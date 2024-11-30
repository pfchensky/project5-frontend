import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import LoginForm from './components/LoginForm';
import UserManager from './components/UserManager';
import TravelPlanner from './components/TravelPlanner';
import './App.css';

function App() {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  // Initialize Firebase
  initializeApp(firebaseConfig);

  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);  // State to track selected user

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          userID: firebaseUser.uid,
          userName: firebaseUser.displayName,
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <div className="App">
      <h1>Travel Planner</h1>

      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div className="content">
          <div className="user-info">
            <p>Welcome, {user.userName}!</p>
            <button onClick={handleLogout}>Log Out</button>
          </div>

          <UserManager user={user} setSelectedUser={setSelectedUser} />

          {selectedUser && (
            <TravelPlanner selectedUsers={[selectedUser]} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
