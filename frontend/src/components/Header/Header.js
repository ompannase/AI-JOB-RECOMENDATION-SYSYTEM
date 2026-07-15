import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>CareerSync AI</h1>
              <span>Intelligent Job Matching</span>
            </div>
          </div>
          
          <nav className="nav">
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#testimonials" className="nav-link">Success Stories</a>
            <button className="cta-button secondary">Login</button>
            <button className="cta-button primary">Get Started</button>
          </nav>
          
          <button className="mobile-menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;