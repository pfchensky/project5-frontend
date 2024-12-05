import React, { useState, useEffect } from 'react';
import { fetchAllUsers, updateUser, deleteUser } from '../services/api';

function UserList({ onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchAllUsers()
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setUsers([]);
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
    onUserSelect(user);
  };

  return (
    <div>
      <h3>Available Users</h3>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <ul>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <li key={user.userName}>
                {/* User Info: Display on one line */}
                <div className="user-info">
                  <strong>{user.userName}</strong> ({user.age}, {user.gender}, {user.interest})
                </div>

                {/* Buttons: Display below user info */}
                <div className="button-container">
                  <button className="update-btn" onClick={() => handleUpdate(user.userName)}>
                    Update
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(user.userName)}>
                    Delete
                  </button>
                  <button
                    className="select-btn"
                    onClick={() => handleSelect(user)}
                  >
                    Select
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No users found</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default UserList;
