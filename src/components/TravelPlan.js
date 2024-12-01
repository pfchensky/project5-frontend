import React, { useState } from 'react';

function TravelPlan({ plan }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <h2>Travel Plan</h2>
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'Hide Plan' : 'Show Plan'}
      </button>
      {visible && <pre>{plan}</pre>}
    </div>
  );
}

export default TravelPlan;
