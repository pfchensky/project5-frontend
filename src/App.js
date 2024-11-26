import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';
import LoginForm from './LoginForm';

function TravelPlanner() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const [newInterest, setNewInterest] = useState(''); // For Add New User Info form
  const [newDestination, setNewDestination] = useState('');
  const [newAge, setNewAge] = useState('');

  const [generateInterest, setGenerateInterest] = useState(''); // For Generate Travel Plan form
  const [generateDestination, setGenerateDestination] = useState('');
  const [generateAge, setGenerateAge] = useState('');
  const [duration, setDuration] = useState('');
  const [travelPlan, setTravelPlan] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const [showUserInfo, setShowUserInfo] = useState(false);

  // Function to call API to get all users info in DB
  function displayAllUsers() {
    axios
      .get('http://localhost:8080/findAllUsers')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }

  // Function to add a new user
  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      alert('Please log in to submit a user.');
      return;
    }

    const postData = {
      userID: user.email,
      interest: newInterest,
      destination: newDestination,
      age: parseInt(newAge, 10),
    };

    try {
      await axios.post('http://localhost:8080/saveUser', postData);
      displayAllUsers();
      setNewInterest('');
      setNewDestination('');
      setNewAge('');
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }

  // Function to populate the form with selected user data
  const populateGeneratePlanForm = (user) => {
    setSelectedUser(user);
    setGenerateInterest(user.interest);
    setGenerateDestination(user.destination);
    setGenerateAge(user.age);
  };

  // Function to generate a travel plan
  const generateTravelPlan = async (event) => {
    event.preventDefault();

    if (!selectedUser) {
      alert('Please select a user first.');
      return;
    }

    if (!duration || isNaN(duration)) {
      alert('Please enter a valid duration.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/ai/generate-travel-plan', {
        age: selectedUser.age,
        interest: selectedUser.interest,
        destination: selectedUser.destination,
        duration: parseInt(duration, 10),
      });

      setTravelPlan(response.data); // Save the generated plan
    } catch (error) {
      console.error('Error generating travel plan:', error);
    }
  };

  // Function to save updated user info
  const handleSaveUser = async (index) => {
    const updatedUser = filteredUsers[index];

    try {
      await axios.put('http://localhost:8080/updateByUserID', updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user, i) => (i === index ? updatedUser : user))
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user, i) => (i === index ? updatedUser : user))
      );
      setEditingIndex(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Function to delete a user
  const handleDeleteUser = async (index) => {
    const userToDelete = filteredUsers[index];

    try {
      await axios.delete('http://localhost:8080/deleteUser', {
        data: { userID: userToDelete.userID },
      });

      setUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
      setFilteredUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    if (showUserInfo && user) {
      const userInfo = users.filter((userinfo) => userinfo.userID === user.email);
      setFilteredUsers(userInfo);
    } else {
      setFilteredUsers(users); // Show all users
    }
  }, [users, showUserInfo, user]);

  useEffect(() => {
    displayAllUsers();
  }, []);

  function HandleLogin(user) {
    setUser(user);
    console.log('Logged in user:', user);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-list">
      <LoginForm LoginEvent={HandleLogin} />
      {user ? (
        <>
          <h2>Client Search List History</h2>
          <label>
            <input
              type="checkbox"
              checked={showUserInfo}
              onChange={(e) => setShowUserInfo(e.target.checked)}
            />
            Show only my Info
          </label>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div className="user-item" key={index}>
                {editingIndex === index ? (
                  <>
                    <label>
                      <strong>Interest:</strong>
                      <input
                        type="text"
                        value={user.interest}
                        onChange={(e) =>
                          setFilteredUsers((prevUsers) =>
                            prevUsers.map((u, i) =>
                              i === index ? { ...u, interest: e.target.value } : u
                            )
                          )
                        }
                      />
                    </label>
                    <br />
                    <label>
                      <strong>Age:</strong>
                      <input
                        type="number"
                        value={user.age}
                        onChange={(e) =>
                          setFilteredUsers((prevUsers) =>
                            prevUsers.map((u, i) =>
                              i === index ? { ...u, age: e.target.value } : u
                            )
                          )
                        }
                      />
                    </label>
                    <br />
                    <label>
                      <strong>Destination:</strong>
                      <input
                        type="text"
                        value={user.destination}
                        onChange={(e) =>
                          setFilteredUsers((prevUsers) =>
                            prevUsers.map((u, i) =>
                              i === index ? { ...u, destination: e.target.value } : u
                            )
                          )
                        }
                      />
                    </label>
                    <br />
                    <button onClick={() => handleSaveUser(index)}>Save</button>
                    <button onClick={() => setEditingIndex(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <h3>UserID: {user.userID}</h3>
                    <p>
                      <strong>Interest:</strong> {user.interest}
                    </p>
                    <p>
                      <strong>Age:</strong> {user.age}
                    </p>
                    <p>
                      <strong>Destination:</strong> {user.destination}
                    </p>
                    <button onClick={() => setEditingIndex(index)}>Edit</button>
                    <button onClick={() => handleDeleteUser(index)}>Delete</button>
                    <button onClick={() => populateGeneratePlanForm(user)}>
                      Generate Travel Plan
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No users to display.</p>
          )}

          <h2>Add a New User Info</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Interest:
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
              />
            </label>
            <br />
            <label>
              Destination:
              <input
                type="text"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
              />
            </label>
            <br />
            <label>
              Age:
              <input
                type="number"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>

          <h2>Generate Travel Plan</h2>
          <form onSubmit={generateTravelPlan}>
            <label>
              Interest:
              <input type="text" value={generateInterest} readOnly />
            </label>
            <br />
            <label>
              Destination:
              <input type="text" value={generateDestination} readOnly />
            </label>
            <br />
            <label>
              Age:
              <input type="number" value={generateAge} readOnly />
            </label>
            <br />
            <label>
              Duration (days):
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Generate</button>
          </form>

          {travelPlan && (
            <div className="travel-plan">
              <h2>Travel Plan for {selectedUser?.userID}</h2>
              <p>{travelPlan}</p>
            </div>
          )}
        </>
      ) : (
        <p>Please log in to see the user list.</p>
      )}
    </div>
  );
}

export default TravelPlanner;