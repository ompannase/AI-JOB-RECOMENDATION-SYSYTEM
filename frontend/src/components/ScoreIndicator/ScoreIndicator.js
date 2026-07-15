import React from 'react';
import './ScoreIndicator.css';

const ScoreIndicator = ({ score, size = 'medium' }) => {
  const getScoreColor = (score) => {
    if (score >= 0.9) return '#10b981'; // Excellent - Emerald
    if (score >= 0.8) return '#22c55e'; // Very Good - Green
    if (score >= 0.7) return '#84cc16'; // Good - Lime
    if (score >= 0.6) return '#eab308'; // Fair - Yellow
    if (score >= 0.5) return '#f59e0b'; // Average - Amber
    return '#ef4444'; // Poor - Red
  };

  const getScoreLabel = (score) => {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.8) return 'Very Good';
    if (score >= 0.7) return 'Good';
    if (score >= 0.6) return 'Fair';
    if (score >= 0.5) return 'Average';
    return 'Poor';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score * circumference);

  return (
    <div className={`score-indicator ${size}`}>
      <div className="score-circle">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--gray-200)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="progress-circle"
          />
        </svg>
        <div className="score-content">
          <span className="score-value">{(score * 100).toFixed(0)}%</span>
          <span className="score-label">{getScoreLabel(score)}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreIndicator;