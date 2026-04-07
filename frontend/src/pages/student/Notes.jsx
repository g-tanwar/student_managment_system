import React from 'react';

const Notes = () => {
  return (
    <div className="page-card">
      <div className="page-header">
        <h1>My Notes</h1>
        <p>Organize your thoughts and study materials.</p>
      </div>
      <div className="empty-state">
        <p>Your workspace is empty. Create a new note to start writing.</p>
      </div>
    </div>
  );
};

export default Notes;
