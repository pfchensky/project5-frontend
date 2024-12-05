import React, { useState } from 'react';
import './TravelPlan.css';  // Import CSS for TravelPlan component

function TravelPlan({ plan }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="travel-plan-container">
      <h2>Travel Plan</h2>
      <button onClick={() => setVisible(!visible)} className="toggle-btn">
        {visible ? 'Hide Plan' : 'Show Plan'}
      </button>
      {visible && <pre className="plan-content">{plan}</pre>}
    </div>
  );
}

export default TravelPlan;
