import React, { useState } from 'react';

function TripForm({ onSubmit }) {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(0);
  const [month, setMonth] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!destination || !duration || !month) {
      setError('All fields are required!');
      return;
    }
      // Check if the duration is a valid number
      if (isNaN(duration) || duration <= 0) {
        setError('Duration must be a valid positive number!');
        return;
      }

    setError('');
    onSubmit({ destination, duration, month });
    setDestination('');
    setDuration(0);
    setMonth('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter Trip Information</h2>
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Duration (days)"
        value={duration}
        onChange={(e) => setDuration(parseInt(e.target.value))}
        required
      />
      <input
        type="text"
        placeholder="Month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}

export default TripForm;
