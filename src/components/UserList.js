import React, { useState, useEffect } from 'react';
import { fetchAllUsers, updateUser, deleteUser } from '../services/api';

function UserList({ onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchAllUsers().then((users) => {
      setUsers(users);
      setLoading(false);
    });
  }, []);

  const handleUpdate = (userName) => {
    const updatedInterest = prompt('Enter new interest:');
    if (updatedInterest) {
      updateUser(userName, { interest: updatedInterest }).then(() =>
        fetchAllUsers().then((users) => {
          setUsers(users);
        })
      );
    }
  };

  const handleDelete = (userName) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userName).then(() =>
        fetchAllUsers().then((users) => {
          setUsers(users);
        })
      );
    }
  };

  const handleSelect = (user) => {
    if (!selectedUsers.find((selectedUser) => selectedUser.userName === user.userName)) {
      setSelectedUsers([...selectedUsers, user]);  // Add user to selected list
      onUserSelect(user);  // Pass selected user to the parent component
    }
  };

  return (
    <div>
      <h2>User List</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <h3>Available Users</h3>
          <ul>
            {users.map((user) => (
              <li key={user.userName}>
                {user.userName} ({user.age}, {user.gender}, {user.interest})
                <button onClick={() => handleUpdate(user.userName)}>Update</button>
                <button onClick={() => handleDelete(user.userName)}>Delete</button>
                <button
                  onClick={() => handleSelect(user)}
                  disabled={selectedUsers.some((selectedUser) => selectedUser.userName === user.userName)}
                >
                  {selectedUsers.some((selectedUser) => selectedUser.userName === user.userName) ? 'Selected' : 'Select'}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default UserList;
