import React, { useState } from 'react';
import { MapPin, Building2, DollarSign, ExternalLink, ChevronDown, ChevronUp, Star } from 'lucide-react';
import ScoreIndicator from '../ScoreIndicator/ScoreIndicator';
import SkillsCloud from '../SkillsCloud/SkillsCloud';
import './JobCard.css';

const JobCard = ({ job, index }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formatSalary = (min, max) => {
    if (min === null && max === null) return 'Not disclosed';
    if (min === null) return `Up to ₹${(max / 100000).toFixed(1)}L`;
    if (max === null) return `From ₹${(min / 100000).toFixed(1)}L`;
    return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L`;
  };

  const getMatchStrength = (score) => {
    if (score >= 0.9) return { label: 'Perfect Match', color: 'perfect' };
    if (score >= 0.8) return { label: 'Strong Match', color: 'strong' };
    if (score >= 0.7) return { label: 'Good Match', color: 'good' };
    if (score >= 0.6) return { label: 'Fair Match', color: 'fair' };
    return { label: 'Basic Match', color: 'basic' };
  };

  const matchStrength = getMatchStrength(job.score);

  return (
    <div className="job-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="job-card-header">
        <div className="job-main-info">
          <div className="job-title-section">
            <h3 className="job-title">{job.title}</h3>
            <div className="company-info">
              <Building2 size={16} />
              <span className="company-name">{job.company}</span>
              <span className="separator">•</span>
              <span className={`match-strength ${matchStrength.color}`}>
                {matchStrength.label}
              </span>
            </div>
          </div>
          
          <div className="job-actions">
            <button 
              className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Star size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <ScoreIndicator score={job.score} size="small" />
          </div>
        </div>

        <div className="job-meta">
          <div className="meta-item">
            <MapPin size={16} />
            <span>{job.location}</span>
          </div>
          <div className="meta-item">
            <DollarSign size={16} />
            <span className="salary">{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
          <div className="meta-item category">
            <span>{job.category}</span>
          </div>
        </div>
      </div>

      <div className="skills-section">
        <SkillsCloud 
          skills={job.signals.job_skills_found} 
          matchedSkills={job.signals.job_skills_found}
        />
      </div>

      <div className="job-card-actions">
        <button 
          className="details-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <ChevronUp size={16} />
              Hide Match Details
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Show Match Details
            </>
          )}
        </button>
        
        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="apply-btn"
        >
          <ExternalLink size={16} />
          Apply Now
        </a>
      </div>

      {showDetails && (
        <div className="match-details slide-in">
          <h4>Match Breakdown</h4>
          <div className="signals-grid">
            <div className="signal-item">
              <div className="signal-header">
                <span>Skills Match</span>
                <span className="signal-value">{(job.signals.skill_score * 100).toFixed(0)}%</span>
              </div>
              <div className="signal-bar">
                <div 
                  className="signal-fill skill-fill" 
                  style={{ width: `${job.signals.skill_score * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="signal-item">
              <div className="signal-header">
                <span>Title Relevance</span>
                <span className="signal-value">{(job.signals.title_score * 100).toFixed(0)}%</span>
              </div>
              <div className="signal-bar">
                <div 
                  className="signal-fill title-fill" 
                  style={{ width: `${job.signals.title_score * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="signal-item">
              <div className="signal-header">
                <span>Location Match</span>
                <span className="signal-value">{(job.signals.loc_score * 100).toFixed(0)}%</span>
              </div>
              <div className="signal-bar">
                <div 
                  className="signal-fill location-fill" 
                  style={{ width: `${job.signals.loc_score * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="signal-item">
              <div className="signal-header">
                <span>AI Similarity</span>
                <span className="signal-value">{(job.signals.emb_sim * 100).toFixed(0)}%</span>
              </div>
              <div className="signal-bar">
                <div 
                  className="signal-fill ai-fill" 
                  style={{ width: `${job.signals.emb_sim * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="signals-summary">
            <div className="summary-item">
              <span className="summary-label">Skills Found:</span>
              <span className="summary-value">{job.signals.job_skills_found.length} skills</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Salary Match:</span>
              <span className="summary-value">{(job.signals.salary_score * 100).toFixed(0)}%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Recency:</span>
              <span className="summary-value">{(job.signals.recency_score * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;