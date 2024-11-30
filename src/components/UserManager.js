import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManager = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    userName: "",
    interest: "",
    age: "",
    gender: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [travelInfo, setTravelInfo] = useState({
    destination: "",
    duration: "",
    month: "",
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);

  // Fetch all users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/findAllUsers");
      setUsers(response.data);
    } catch (error) {
      console.error("There was an error fetching the users!", error);
    }
  };

  // Handle input changes for the new user form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  // Save a new user to the backend
  const saveUser = async () => {
    try {
      const userData = { ...newUser, userID: user.userID }; // Use Google ID as userID
      const response = await axios.post("http://localhost:8080/saveUser", userData);
      console.log("User saved:", response.data);
      fetchUsers(); // Re-fetch the users to update the list
      setNewUser({ userName: "", interest: "", age: "", gender: "" }); // Clear form
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Edit an existing user (update user info)
  const editUser = async (userID) => {
    const updatedUser = { ...selectedUser };
    try {
      const response = await axios.put(`http://localhost:8080/updateUser/${userID}`, updatedUser);
      console.log("User updated:", response.data);
      fetchUsers(); // Re-fetch users
      setSelectedUser(null); // Clear selected user after update
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  // Delete a user by username
  const deleteUser = async (userName) => {
    try {
      const response = await axios.delete(`http://localhost:8080/deleteByUserName?userName=${userName}`);
      console.log("User deleted:", response.data);
      fetchUsers(); // Re-fetch users
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle user selection (for generating travel plan)
  const handleSelectUser = (user) => {
    setSelectedUsers((prevUsers) => [...prevUsers, user]);
  };

  // Handle travel info input changes
  const handleTravelInfoChange = (e) => {
    const { name, value } = e.target;
    setTravelInfo({
      ...travelInfo,
      [name]: value,
    });
  };

  // Generate travel plan
  const handleGeneratePlan = async () => {
    try {
      const planData = { selectedUsers, travelInfo };
      const response = await axios.post("http://localhost:8080/generateTravelPlan", planData);
      setGeneratedPlan(response.data); // Set the generated plan from the backend
    } catch (error) {
      console.error("Error generating plan:", error);
    }
  };

  return (
    <div>
      <h1>User Manager</h1>

      {/* Form to add new user */}
      <div>
        <h2>Add New User</h2>
        <input
          type="text"
          name="userName"
          placeholder="UserName"
          value={newUser.userName}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={newUser.age}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={newUser.gender}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="interest"
          placeholder="Interest"
          value={newUser.interest}
          onChange={handleInputChange}
        />
        <button onClick={saveUser}>Save User</button>
      </div>

      {/* List of existing users */}
      <div>
        <h2>All Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <div>
                <span>{user.userName}</span>
                <span> Age: {user.age}</span>
                <span> Gender: {user.gender}</span>
                <span> Interest: {user.interest}</span>
              </div>
              <button onClick={() => handleSelectUser(user)}>Select</button>
              <button onClick={() => editUser(user.userID)}>Update</button>
              <button onClick={() => deleteUser(user.userName)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Display selected users' info for travel plan */}
      <div>
        <h2>Selected Users for Travel Plan</h2>
        <ul>
          {selectedUsers.map((user) => (
            <li key={user.userID}>
              {user.userName} ({user.age}, {user.gender}, {user.interest})
            </li>
          ))}
        </ul>
      </div>

      {/* Form for travel information */}
      <div>
        <h2>Enter Travel Information</h2>
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={travelInfo.destination}
          onChange={handleTravelInfoChange}
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (in days)"
          value={travelInfo.duration}
          onChange={handleTravelInfoChange}
        />
        <input
          type="text"
          name="month"
          placeholder="Month"
          value={travelInfo.month}
          onChange={handleTravelInfoChange}
        />
        <button onClick={handleGeneratePlan}>Generate Plan</button>
      </div>

      {/* Display generated travel plan */}
      {generatedPlan && (
        <div>
          <h2>Generated Travel Plan</h2>
          <pre>{JSON.stringify(generatedPlan, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UserManager;

