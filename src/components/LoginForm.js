import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import './LoginForm.css';

function LoginForm({ onLogin }) {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  initializeApp(firebaseConfig);

  const [loggedUser, setLoggedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signInWithGoogle = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        setLoggedUser(result.user);
        onLogin(result.user);
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
        onLogin(null);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      setLoggedUser(user);
      onLogin(user);
    });
  }, [onLogin]);

  return (
    <div className="login-form-container">
      <h2 className="login-form-header">Login</h2>
      <form className="login-form">
        {loading ? (
          <p>Loading...</p>
        ) : loggedUser ? (
          <>
            <p>
              Welcome, <strong>{loggedUser.displayName}</strong>
            </p>
            <button onClick={logoutGoogle} className="submit-button">Log out</button>
          </>
        ) : (
          <>
            <button className="google-button" onClick={signInWithGoogle}>
              Sign in with Google
            </button>
            {error && <p className="error-message">Error: {error}</p>}
          </>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
