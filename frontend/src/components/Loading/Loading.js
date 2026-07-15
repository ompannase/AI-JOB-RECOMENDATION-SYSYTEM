import React from 'react';
import './Loading.css';

const Loading = ({ message = "Finding your perfect job matches..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-animation">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-dot"></div>
          </div>
          <div className="loading-pulse">
            <div className="pulse-circle"></div>
            <div className="pulse-circle"></div>
            <div className="pulse-circle"></div>
          </div>
        </div>
        <div className="loading-text">
          <h3>AI is working its magic</h3>
          <p>{message}</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div className="loading-features">
        <div className="feature-item">
          <div className="feature-icon">🤖</div>
          <span>Analyzing your skills</span>
        </div>
        <div className="feature-item">
          <div className="feature-icon">🎯</div>
          <span>Matching with opportunities</span>
        </div>
        <div className="feature-item">
          <div className="feature-icon">⚡</div>
          <span>Optimizing results</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;