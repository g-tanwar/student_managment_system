import React from 'react';

const Schedule = () => {
  return (
    <div className="page-card">
      <div className="page-header">
        <h1>My Schedule</h1>
        <p>Track your upcoming classes and events.</p>
      </div>
      <div className="empty-state">
        <p>No upcoming events today.</p>
      </div>
    </div>
  );
};

export default Schedule;
