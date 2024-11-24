import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React, {  useState, useEffect } from 'react';

// LoginSuccessful is a function sent in by parent component
function LoginForm({LoginEvent}) {
	const firebaseConfig = {
		apiKey: "AIzaSyAOZva2bfOU6TiBqFUTdgDz6JVhngTEEy4",
		authDomain: "fir-sample-e4fb3.firebaseapp.com",
		projectId: "fir-sample-e4fb3",
		storageBucket: "fir-sample-e4fb3.firebasestorage.app",
		messagingSenderId: "475492564840",
		appId: "1:475492564840:web:3c73bcfe0d6e8d29a460dd",
	};

	initializeApp(firebaseConfig);
	
	const [loggedUser, setLoggedUser] = useState('');

	// function to sign in with Google's page
	const signInWithGoogle = () => {
  	
  		const provider = new GoogleAuthProvider();
		  provider.setCustomParameters({
			prompt: 'select_account'
		  });
  		const auth = getAuth();
		  auth.onAuthStateChanged(user => {
			if (user) {
			  const displayName = user.displayName;
			  console.log(`User is signed in: ${displayName}`);
			  setLoggedUser(displayName);
			} else {
			  console.log("No user is signed in.");
			}
		  });
  		signInWithPopup(auth, provider)
    	.then((result) => {
      		// User signed in
      		console.log(result.user);
      		setLoggedUser(result.user)
      	
    	}).catch((error) => {
      	// Handle Errors here.
      		console.error(error);
    	});
	};
	
	// function to sign out
	function logoutGoogle () {
		const auth=getAuth();
		auth.signOut();
		setLoggedUser(null)
	}

	// we put the onAuthStateChanged in useEffect so this is only called when 
	// this component mounts  
	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged(user => {
			if (user) {
    			// User is signed in.
    			console.log("User is signed in:", user);
    			
    			
    			setLoggedUser(user);
    		
  			} else {
    		// No user is signed in.
    			console.log("No user is signed in.");
  			}
  			LoginEvent(user);
  		});
	}, [LoginEvent]);
	// note the ? to show either login or logout button
	// can user email or displayName
	return (
    <div >
    { loggedUser?
      <><p>user: {loggedUser.email}</p> <button onClick={logoutGoogle}>Log out</button> </>
      :<button onClick={signInWithGoogle}>Sign in with Google</button>
    } 
     
    </div>
  );

}
export default LoginForm;