import React from 'react';

const GeneratePostButton = ({ loading, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={loading} 
      className="generate-post-button"
    >
      {loading ? (
        <div className="spinner"></div>
      ) : (
        'Generate Post'
      )}
    </button>
  );
};

export default GeneratePostButton;
