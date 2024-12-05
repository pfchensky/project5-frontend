import React, { useState } from 'react';
import { addUser } from '../services/api';  
import './NewUserForm.css';

function NewUserForm({ onUserAdded, userEmail }) {
  const [userName, setUserName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [interest, setInterest] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!userName || !age || !gender || !interest) {
      setError('All fields are required!');
      setSuccess('');
      return;
    }

    if (!userEmail) {
      setError('User is not logged in!');
      setSuccess('');
      return;
    }

    const newUser = { userID: userEmail, userName, age, gender, interest };

    try {
      // Call API to add user
      await addUser(newUser);
      setSuccess('User added successfully!');
      setError('');
      setUserName('');
      setAge('');
      setGender('');
      setInterest('');
      onUserAdded(); // Refresh users list in the parent component
    } catch (err) {
      setError('Failed to add user. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="new-user-form-container">
      <h2 className="new-user-form-header">Create New User</h2>
      <form onSubmit={handleSubmit} className="new-user-form">
        {/* Username Input */}
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="input-field"
        />
        
        {/* Age Input */}
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="input-field"
        />
        
        {/* Gender Dropdown */}
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="input-field"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        {/* Interest Input */}
        <input
          type="text"
          placeholder="Interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="input-field"
        />

        {/* Error and Success Messages */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {/* Submit Button */}
        <button type="submit" className="submit-button">Add User</button>
      </form>
    </div>
  );
}

export default NewUserForm;

