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

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setLoggedUser(user);
        onLogin(user);
      })
      .catch((error) => {
        console.error('Error signing in:', error);
      });
  };

  const logoutGoogle = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setLoggedUser(null);
        onLogin(null);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedUser(user);
        onLogin(user);
      } else {
        setLoggedUser(null);
        onLogin(null);
      }
    });
  }, [onLogin]);

  return (
    <div className="login-form">
      {loggedUser ? (
        <>
          <p>User: {loggedUser.displayName}</p>
          <button onClick={logoutGoogle}>Log out</button>
        </>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
}

export default LoginForm;
