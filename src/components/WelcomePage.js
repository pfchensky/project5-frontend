import React, { useState, useEffect } from 'react';
import './WelcomePage.css';  // Import CSS for styling
import photo from '../photo.png';  // Import the image from the src folder
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

function WelcomePage({ onLogin }) {
  const [loggedUser, setLoggedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Firebase app
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  useEffect(() => {
    initializeApp(firebaseConfig);
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      setLoggedUser(user);
      onLogin(user);  // Pass logged-in user to parent component
    });
  }, [onLogin]);

  const signInWithGoogle = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        setLoggedUser(result.user);
        onLogin(result.user);  // Pass user to parent
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const logoutGoogle = () => {
    const auth = getAuth();
    setLoading(true);
    signOut(auth)
      .then(() => {
        setLoggedUser(null);
        onLogin(null);  // Pass null to parent to indicate logout
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to the Travel App!</h1>
        <img 
          src={photo} 
          alt="Welcome" 
          className="welcome-image" 
        />

        {/* Login Form below the image */}
        {loggedUser ? (
          <>
            <p>Welcome, {loggedUser.displayName}</p>
            <button onClick={logoutGoogle}>Log out</button>
          </>
        ) : (
          <div className="login-form-container">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <button className="google-button" onClick={signInWithGoogle}>
                  Sign in with Google
                </button>
                {error && <p className="error-message">Error: {error}</p>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WelcomePage;