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
  
  //const [userID,setUserID]=useState('');
  const [interest, setInterest] = useState('');
  const [location, setLocation] = useState('');
  //const [id, setId] = useState('');
  const [age, setAge] = useState('');
  const [searchAge,setSearchAge]=useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  
  // function to call API to get all users info in DB
  function displayAllUsers() {
  	axios.get('http://localhost:8080/findAllUsers')
      .then(response => {
        setUsers(response.data);  // Axios packs the response in a 'data' property
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  
  };

  // function to handle the user submit of a new user
  // async used so we can use the "await", which causes a block until post is done
  //   and makes for a little simpler code (no .then)
  async function handleSubmit(event) {
        event.preventDefault();
        
        if (!user) {
          alert('Please log in to submit a user.');
          return;
        }

        const postData = {
            userID:user.email,
            interest,
            location,
            age: parseInt(age, 10) // Convert string to integer
        };

        try {
            const response = await axios.post('http://localhost:8080/saveUser', postData);
            console.log('Response:', response.data);
            displayAllUsers();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };
  // Function to handle searching users by age
  const handleSearchByAge = async (event) => {
    event.preventDefault();
    if (searchAge.trim() === '') {
        displayAllUsers();
        return;
    }
    setLoading(true);
    try {
        const response = await axios.get('http://localhost:8080/findByAge', {
            params: { age: searchAge }
        });
        setUsers(response.data);
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
  };

  // Toggle user filtering
  useEffect(() => {
    if (showUserInfo && user) {
      const userInfo = users.filter((userinfo) => userinfo.userID === user.email);
      setFilteredUsers(userInfo);
    } else {
      setFilteredUsers(users); // Show all users
    }
  }, [users, showUserInfo, user]);
  
  // useEffect makes it so list of users shown when this component mounts
  useEffect(() => {
    // Using Axios to fetch data
   
    displayAllUsers()
  }, []);

  function HandleLogin(user) {
    setUser(user);
    console.log('Logged in user:', user);
  }

  // Function to handle saving updated user info
  const handleSaveUser = async (index) => {
    const updatedUser = filteredUsers[index];

    try {
      await axios.put('http://localhost:8080/updateByUserID', updatedUser); // Save to backend
      setUsers((prevUsers) =>
        prevUsers.map((user, i) => (i === index ? updatedUser : user))
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user, i) => (i === index ? updatedUser : user))
      );
      setEditingIndex(null); // Exit editing mode
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Function to handle editing field changes
  const handleEditFieldChange = (index, field, value) => {
    setFilteredUsers((prevUsers) =>
      prevUsers.map((user, i) =>
        i === index ? { ...user, [field]: value } : user
      )
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // this component displays a list of user and has a form for posting a new user
  return (
    <div className="user-list">
      <LoginForm LoginEvent={HandleLogin} />
      {/* Conditional Rendering */}
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
                    {/* Editable Fields */}
                    <label>
                      <strong>Interest:</strong>
                      <input
                        type="text"
                        value={user.interest}
                        onChange={(e) =>
                          handleEditFieldChange(index, 'interest', e.target.value)
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
                          handleEditFieldChange(index, 'age', e.target.value)
                        }
                      />
                    </label>
                    <br />
                    <label>
                      <strong>Location:</strong>
                      <input
                        type="text"
                        value={user.location}
                        onChange={(e) =>
                          handleEditFieldChange(index, 'location', e.target.value)
                        }
                      />
                    </label>
                    <br />
                    <button onClick={() => handleSaveUser(index)}>Save</button>
                    <button onClick={() => setEditingIndex(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {/* Display Fields */}
                    <h3>UserID: {user.userID}</h3>
                    <p>
                      <strong>Interest:</strong> {user.interest}
                    </p>
                    <p>
                      <strong>Age:</strong> {user.age}
                    </p>
                    <p>
                      <strong>Location:</strong> {user.location}
                    </p>
                    <button onClick={() => setEditingIndex(index)}>Edit</button>
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
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              />
            </label>
            <br />
            <label>
              Location:
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
            <br />
            <label>
              Age:
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>

          <h2>Search By Age</h2>
          <form onSubmit={handleSearchByAge}>
            <label>
              Age:
              <input
                type="number"
                value={searchAge}
                onChange={(e) => setSearchAge(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Search</button>
          </form>
        </>
      ) : (
        <p>Please log in to see the user list.</p>
      )}
    </div>
  );
}



export default TravelPlanner;