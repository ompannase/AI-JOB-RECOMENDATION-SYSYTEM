import React, { useState } from 'react';
import { Search, Plus, X, TrendingUp, MapPin, DollarSign, Briefcase } from 'lucide-react';
import './FilterSection.css';

const FilterSection = ({ onSearch, loading }) => {
  const [filters, setFilters] = useState({
    title: 'Backend Developer',
    skills: ['Python', 'Django', 'Postgres', 'Redis'],
    experience_years: 2,
    preferred_stack: ['Docker'],
    location: 'Bangalore',
    preferences: {
      remote_only: false,
      min_salary: 500000
    },
    top_k: 5
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentStack, setCurrentStack] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const popularSkills = ['Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Machine Learning'];
  const popularRoles = ['Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'ML Engineer'];

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const addSkill = (skill = null) => {
    const skillToAdd = skill || currentSkill.trim();
    if (skillToAdd && !filters.skills.includes(skillToAdd)) {
      setFilters(prev => ({
        ...prev,
        skills: [...prev.skills, skillToAdd]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addStack = (stack = null) => {
    const stackToAdd = stack || currentStack.trim();
    if (stackToAdd && !filters.preferred_stack.includes(stackToAdd)) {
      setFilters(prev => ({
        ...prev,
        preferred_stack: [...prev.preferred_stack, stackToAdd]
      }));
      setCurrentStack('');
    }
  };

  const removeStack = (stackToRemove) => {
    setFilters(prev => ({
      ...prev,
      preferred_stack: prev.preferred_stack.filter(stack => stack !== stackToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const quickSelectRole = (role) => {
    handleInputChange('title', role);
  };

  const quickAddSkill = (skill) => {
    addSkill(skill);
  };

  return (
    <div className="filter-section">
      <div className="container">
        <div className="filter-card">
          <div className="filter-header">
            <div className="header-content">
              <h2>Discover Your Perfect Role</h2>
              <p>AI-powered matching with 5000+ opportunities across top companies</p>
            </div>
            <div className="stats">
              <div className="stat">
                <TrendingUp size={16} />
                <span>95% Match Accuracy</span>
              </div>
            </div>
          </div>

          <div className="filter-tabs">
            <button 
              className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              <Briefcase size={16} />
              Basic Info
            </button>
            <button 
              className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <Plus size={16} />
              Skills & Tech
            </button>
            <button 
              className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <MapPin size={16} />
              Preferences
            </button>
          </div>

          <form onSubmit={handleSubmit} className="filter-form">
            {activeTab === 'basic' && (
              <div className="tab-content">
                <div className="form-group">
                  <label className="form-label">
                    <Briefcase size={16} />
                    Desired Role
                  </label>
                  <input
                    type="text"
                    value={filters.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Backend Developer, Data Scientist..."
                    className="form-input"
                  />
                  <div className="quick-suggestions">
                    <span>Popular roles:</span>
                    {popularRoles.map(role => (
                      <button
                        key={role}
                        type="button"
                        className={`suggestion-tag ${filters.title === role ? 'active' : ''}`}
                        onClick={() => quickSelectRole(role)}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <MapPin size={16} />
                      Location
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City or region..."
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <TrendingUp size={16} />
                      Experience (Years)
                    </label>
                    <div className="experience-input">
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={filters.experience_years}
                        onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value))}
                        className="slider"
                      />
                      <span className="experience-value">{filters.experience_years}+ years</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="tab-content">
                <div className="form-group">
                  <label className="form-label">Core Skills</label>
                  <div className="tags-input-container">
                    <div className="tags-display">
                      {filters.skills.map((skill, index) => (
                        <span key={index} className="tag">
                          {skill}
                          <button 
                            type="button" 
                            onClick={() => removeSkill(skill)}
                            className="tag-remove"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="input-with-button">
                      <input
                        type="text"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        placeholder="Add skills like Python, React, AWS..."
                        className="form-input"
                      />
                      <button 
                        type="button" 
                        onClick={() => addSkill()}
                        className="add-button"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="quick-suggestions">
                    <span>Popular skills:</span>
                    {popularSkills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        className="suggestion-tag"
                        onClick={() => quickAddSkill(skill)}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Tech Stack</label>
                  <div className="tags-input-container">
                    <div className="tags-display">
                      {filters.preferred_stack.map((stack, index) => (
                        <span key={index} className="tag stack">
                          {stack}
                          <button 
                            type="button" 
                            onClick={() => removeStack(stack)}
                            className="tag-remove"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="input-with-button">
                      <input
                        type="text"
                        value={currentStack}
                        onChange={(e) => setCurrentStack(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStack())}
                        placeholder="e.g., Docker, Kubernetes, AWS..."
                        className="form-input"
                      />
                      <button 
                        type="button" 
                        onClick={() => addStack()}
                        className="add-button"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="tab-content">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.preferences.remote_only}
                        onChange={(e) => handlePreferenceChange('remote_only', e.target.checked)}
                        className="checkbox"
                      />
                      <span className="checkmark"></span>
                      Remote Only Positions
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <DollarSign size={16} />
                      Minimum Salary (₹)
                    </label>
                    <div className="salary-input">
                      <input
                        type="range"
                        min="0"
                        max="5000000"
                        step="50000"
                        value={filters.preferences.min_salary}
                        onChange={(e) => handlePreferenceChange('min_salary', parseInt(e.target.value))}
                        className="slider"
                      />
                      <span className="salary-value">
                        ₹{(filters.preferences.min_salary / 100000).toFixed(1)} LPA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Number of Recommendations</label>
                  <div className="recommendation-options">
                    {[3, 5, 10, 15].map(num => (
                      <button
                        key={num}
                        type="button"
                        className={`option ${filters.top_k === num ? 'active' : ''}`}
                        onClick={() => handleInputChange('top_k', num)}
                      >
                        {num} Jobs
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button 
                type="submit" 
                className="search-button"
                disabled={loading}
              >
                <Search size={18} />
                {loading ? 'Finding Matches...' : 'Find My Matches'}
                {!loading && <span className="pulse-dot"></span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;