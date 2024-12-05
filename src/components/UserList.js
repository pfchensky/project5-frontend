import React from 'react';

function UserList({ users, onUserSelect, onUpdateUser, onDeleteUser, loggedUser }) {
  // Filter users based on loggedUser.email
  const filteredUsers = users.filter((user) => user?.userID === loggedUser?.email);

  return (
    <div>
      <h3>Available Users</h3>
      {filteredUsers.length > 0 ? (
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.userName}>
              {/* User Info */}
              <div className="user-info">
                <strong>{user.userName}</strong> ({user.age}, {user.gender}, {user.interest})
              </div>

              {/* Buttons */}
              <div className="button-container">
                <button className="update-btn" onClick={() => onUpdateUser(user.userName)}>
                  Update
                </button>
                <button className="delete-btn" onClick={() => onDeleteUser(user.userName)}>
                  Delete
                </button>
                <button className="select-btn" onClick={() => onUserSelect(user)}>
                  Select
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}

export default UserList;

