import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import UserList from './components/UserList';
import TripForm from './components/TripForm';
import TravelPlan from './components/TravelPlan';
import NewUserForm from './components/NewUserForm';
import { generateTravelPlan, fetchAllUsers, updateUser, deleteUser } from './services/api';
import './App.css';
import './components/UserList.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);  // Track selected users
  const [travelPlan, setTravelPlan] = useState('');
  const [users, setUsers] = useState([]);  // For storing all users

  // Refresh users from the backend
  const refreshUsers = () => {
    fetchAllUsers()
      .then(setUsers)
      .catch((err) => console.error('Error fetching users:', err));
  };

  // Fetch all users when the app is loaded
  useEffect(() => {
    refreshUsers(); // Call refreshUsers on mount
  }, []);

  const handleTripSubmit = (trip) => {
    const usersWithTrips = selectedUsers.map((user) => ({
      ...user,
      trip,
    }));

    generateTravelPlan(usersWithTrips)
      .then((plans) => {
        console.log('Generated travel plan:', plans);
        setTravelPlan(plans);  // Set plain text travel plan
      })
      .catch((error) => {
        console.error('Error generating travel plan:', error);
      });
  };

  const handleUserAdded = () => {
    refreshUsers(); // Refresh the user list after adding a new user
  };

  const handleUserSelect = (user) => {
    setSelectedUsers([...selectedUsers, user]);  // Add selected user to the list
  };

  const handleUserDeselect = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.userName !== user.userName));  // Remove user from the selected list
  };

  const handleUpdateUser = (userName) => {
    const updatedInterest = prompt('Enter new interest:');
    if (updatedInterest) {
      updateUser(userName, { interest: updatedInterest })
        .then(() => refreshUsers()) // Refresh the user list
        .catch((err) => console.error('Error updating user:', err));
    }
  };

  const handleDeleteUser = (userName) => {
    deleteUser(userName)
      .then(() => refreshUsers()) // Refresh the user list
      .catch((err) => console.error('Error deleting user:', err));
  };

  const handleLogin = (user) => {
    setCurrentUser(user);  // Update current user after login
  };

  return (
    <div className="App">
      <WelcomePage onLogin={handleLogin} /> {/* Render WelcomePage which contains login */}
      
      {currentUser && (
        <>
          <NewUserForm onUserAdded={handleUserAdded} userEmail={currentUser.email} />
          
          {/* Main Layout Container */}
          <div className="main-container">
            {/* Left column - User List */}
            <div className="user-list-container">
              <h2>Available Users</h2>
              <UserList
                users={users}
                onUserSelect={handleUserSelect}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                loggedUser={currentUser}
              />
            </div>

            {/* Right column - Selected Users */}
            <div className="selected-users">
              <h2>Selected Users</h2>
              <ul>
                {selectedUsers.map((user) => (
                  <li key={user.userName}>
                    {user.userName} ({user.age}, {user.gender}, {user.interest})
                    <button onClick={() => handleUserDeselect(user)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trip Form */}
          <TripForm onSubmit={handleTripSubmit} />
        </>
      )}
      {travelPlan && <TravelPlan plan={travelPlan} />}
    </div>
  );
}

export default App;

