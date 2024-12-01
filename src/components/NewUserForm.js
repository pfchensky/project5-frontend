import React, { useState } from 'react';
import { addUser } from '../services/api';  // We'll update the API service later

function NewUserForm({ onUserAdded }) {
  const [userName, setUserName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [interest, setInterest] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !age || !gender || !interest) {
      setError('All fields are required!');
      return;
    }

    const newUser = { userName, age, gender, interest };

    try {
      await addUser(newUser); // Call the API to add the user
      setSuccess('User added successfully!');
      setError('');
      setUserName('');
      setAge('');
      setGender('');
      setInterest('');
      onUserAdded(newUser); // Update the user list in parent component
    } catch (err) {
      setError('Failed to add user. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default NewUserForm;
