import React, { useState } from 'react';
import './TripForm.css';

function TripForm({ onSubmit }) {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(0);
  const [month, setMonth] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!destination || !duration || !month) {
      setError('All fields are required!');
      return;
    }

    // Check if the duration is a valid number
    if (isNaN(duration) || duration <= 0) {
      setError('Duration must be a valid positive number!');
      return;
    }

    setError(''); // Clear any previous errors
    onSubmit({ destination, duration, month });
    setDestination('');
    setDuration(0);
    setMonth('');
  };

  return (
    <form onSubmit={handleSubmit} className="trip-form">
      <h2 className="trip-info-header">Enter Trip Information</h2>

      {/* Destination Input */}
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
        className="input-field"
      />

      {/* Duration Input */}
      <input
        type="number"
        placeholder="Duration (days)"
        value={duration}
        onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value) : 0)}
        required
        className="input-field"
      />

      {/* Month Dropdown */}
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        required
        className="input-field"
      >
        <option value="">Select Month</option>
        <option value="JAN">January</option>
        <option value="FEB">February</option>
        <option value="MAR">March</option>
        <option value="APR">April</option>
        <option value="MAY">May</option>
        <option value="JUN">June</option>
        <option value="JUL">July</option>
        <option value="AUG">August</option>
        <option value="SEP">September</option>
        <option value="OCT">October</option>
        <option value="NOV">November</option>
        <option value="DEC">December</option>
      </select>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Submit Button */}
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
}

export default TripForm;
