import React from 'react';
import './SkillsCloud.css';

const SkillsCloud = ({ skills, matchedSkills = [], maxSkills = 15 }) => {
  const displaySkills = skills.slice(0, maxSkills);
  
  const getSkillSize = (index) => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    return sizes[Math.min(index, sizes.length - 1)];
  };

  const isSkillMatched = (skill) => {
    return matchedSkills.some(matchedSkill => 
      matchedSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(matchedSkill.toLowerCase())
    );
  };

  return (
    <div className="skills-cloud">
      {displaySkills.map((skill, index) => {
        const size = getSkillSize(Math.floor(index / 3));
        const matched = isSkillMatched(skill);
        
        return (
          <span
            key={skill}
            className={`skill-bubble ${size} ${matched ? 'matched' : ''}`}
            title={skill}
          >
            {skill}
            {matched && <span className="match-indicator">✓</span>}
          </span>
        );
      })}
      {skills.length > maxSkills && (
        <span className="skill-bubble more-indicator">
          +{skills.length - maxSkills} more
        </span>
      )}
    </div>
  );
};

export default SkillsCloud;