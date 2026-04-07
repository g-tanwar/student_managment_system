import React from 'react';

const Pomodoro = () => {
  return (
    <div className="page-card">
      <div className="page-header">
        <h1>Pomodoro Timer</h1>
        <p>Focus and manage your study intervals.</p>
      </div>
      <div className="empty-state">
        <h2>25:00</h2>
        <p>Ready to focus?</p>
      </div>
    </div>
  );
};

export default Pomodoro;
