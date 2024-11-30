import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManager.css';

function UserManager() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ userName: '', interest: '', age: '', gender: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState([]);

  // Fetch all users on load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/findAllUsers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Add a new user
  const saveUser = async () => {
    try {
      const userData = { ...newUser };
      await axios.post('http://localhost:8080/saveUser', userData);
      fetchUsers();
      setNewUser({ userName: '', interest: '', age: '', gender: '' });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Update an existing user
  const updateUser = async (userID) => {
    try {
      await axios.put(`http://localhost:8080/updateUser/${userID}`, editingUser);
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Delete an existing user
  const deleteUser = async (userID) => {
    try {
      await axios.delete(`http://localhost:8080/deleteUser/${userID}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Select a user for detailed view
  const handleSelectUser = (user) => {
    setSelectedUserDetails((prev) => [...prev, user]);
  };

  // Handle input changes
  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingUser((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="user-manager-grid">
      {/* User List */}
      <div className="user-list-section">
        <h2>Users</h2>
        {users.map((user) => (
          <div key={user.userID} className="user-item">
            <p>
              <strong>{user.userName}</strong> - {user.age} ({user.gender})<br />
              Interest: {user.interest}
            </p>
            <button onClick={() => handleSelectUser(user)}>Select</button>
            <button onClick={() => setEditingUser(user)}>Edit</button>
            <button onClick={() => deleteUser(user.userID)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Add User */}
      <div className="add-user-section">
        <h2>Add New User</h2>
        <input
          type="text"
          name="userName"
          value={newUser.userName}
          onChange={handleInputChange}
          placeholder="Username"
        />
        <input
          type="number"
          name="age"
          value={newUser.age}
          onChange={handleInputChange}
          placeholder="Age"
        />
        <input
          type="text"
          name="gender"
          value={newUser.gender}
          onChange={handleInputChange}
          placeholder="Gender"
        />
        <input
          type="text"
          name="interest"
          value={newUser.interest}
          onChange={handleInputChange}
          placeholder="Interest"
        />
        <button onClick={saveUser}>Add User</button>
      </div>

      {/* Edit User */}
      <div className="edit-user-section">
        <h2>Edit User</h2>
        {editingUser ? (
          <>
            <input
              type="number"
              name="age"
              value={editingUser.age}
              onChange={(e) => handleInputChange(e, true)}
              placeholder="Age"
            />
            <input
              type="text"
              name="interest"
              value={editingUser.interest}
              onChange={(e) => handleInputChange(e, true)}
              placeholder="Interest"
            />
            <button onClick={() => updateUser(editingUser.userID)}>Save Changes</button>
            <button onClick={() => setEditingUser(null)}>Cancel</button>
          </>
        ) : (
          <p>Select a user to edit.</p>
        )}
      </div>

      {/* Selected User Details */}
      <div className="selected-user-section">
        <h2>Selected User Details</h2>
        {selectedUserDetails.map((user, index) => (
          <div key={index} className="selected-user-item">
            <p>
              <strong>{user.userName}</strong> - {user.age} ({user.gender})<br />
              Interest: {user.interest}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserManager;
