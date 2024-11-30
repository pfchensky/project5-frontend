import React, { useState } from 'react';
import { generateTravelPlans } from '../api';
import './TravelPlanner.css';

function TravelPlanner() {
  const [tripInfo, setTripInfo] = useState({
    destination: '',
    duration: '',
    month: '',
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [travelPlans, setTravelPlans] = useState([]);

  const handleGeneratePlan = () => {
    // Send the selected users and trip details to backend API
    generateTravelPlans(selectedUsers, tripInfo).then((plans) => {
      setTravelPlans(plans);
    });
  };

  return (
    <div className="travel-planner">
      <h2>Generate Travel Plan</h2>
      <input
        type="text"
        value={tripInfo.destination}
        onChange={(e) => setTripInfo({ ...tripInfo, destination: e.target.value })}
        placeholder="Destination"
      />
      <input
        type="number"
        value={tripInfo.duration}
        onChange={(e) => setTripInfo({ ...tripInfo, duration: e.target.value })}
        placeholder="Duration (days)"
      />
      <input
        type="text"
        value={tripInfo.month}
        onChange={(e) => setTripInfo({ ...tripInfo, month: e.target.value })}
        placeholder="Month"
      />
      <button onClick={handleGeneratePlan}>Generate Plan</button>

      <div className="travel-plans">
        {travelPlans.map((plan, index) => (
          <div key={index} className="plan">
            <p>{plan}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TravelPlanner;


