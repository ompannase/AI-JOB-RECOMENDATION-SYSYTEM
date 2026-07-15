import React, { useState } from 'react';
import Header from '../components/Header/Header';
import FilterSection from '../components/FilterSection/FilterSection';
import JobCard from '../components/JobCard/JobCard';
import Loading from '../components/Loading/Loading';
import { getJobRecommendations } from '../services/api';
import { TrendingUp, Users, Award, Clock } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchStats, setSearchStats] = useState(null);

  const handleSearch = async (filters) => {
    setLoading(true);
    setError(null);
    setRecommendations(null);
    
    try {
      const data = await getJobRecommendations(filters);
      setRecommendations(data.recommendations);
      
      // Calculate search statistics
      if (data.recommendations) {
        const stats = {
          total: data.recommendations.length,
          highMatches: data.recommendations.filter(job => job.score >= 0.8).length,
          avgScore: data.recommendations.reduce((acc, job) => acc + job.score, 0) / data.recommendations.length,
          skillsFound: [...new Set(data.recommendations.flatMap(job => job.signals.job_skills_found))].length
        };
        setSearchStats(stats);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Find Your <span className="gradient-text">Dream Job</span> 
                with AI Precision
              </h1>
              <p className="hero-description">
                Our advanced AI analyzes your skills, experience, and preferences to match you 
                with the perfect opportunities from 5000+ top companies.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <TrendingUp size={20} />
                  <div>
                    <span className="stat-number">95%</span>
                    <span className="stat-label">Match Accuracy</span>
                  </div>
                </div>
                <div className="stat">
                  <Users size={20} />
                  <div>
                    <span className="stat-number">50K+</span>
                    <span className="stat-label">Jobs Analyzed</span>
                  </div>
                </div>
                <div className="stat">
                  <Award size={20} />
                  <div>
                    <span className="stat-number">89%</span>
                    <span className="stat-label">Success Rate</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-card card-1">
                <div className="card-header">
                  <span className="company">Google</span>
                  <span className="score">94%</span>
                </div>
                <h4>Senior Backend Engineer</h4>
                <div className="skills">
                  <span>Python</span>
                  <span>Go</span>
                  <span>Kubernetes</span>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="card-header">
                  <span className="company">Microsoft</span>
                  <span className="score">88%</span>
                </div>
                <h4>Full Stack Developer</h4>
                <div className="skills">
                  <span>React</span>
                  <span>Node.js</span>
                  <span>Azure</span>
                </div>
              </div>
              <div className="floating-card card-3">
                <div className="card-header">
                  <span className="company">Amazon</span>
                  <span className="score">91%</span>
                </div>
                <h4>ML Engineer</h4>
                <div className="skills">
                  <span>Python</span>
                  <span>TensorFlow</span>
                  <span>AWS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FilterSection onSearch={handleSearch} loading={loading} />
      
      <main className="main-content">
        <div className="container">
          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <div>
                <h3>Something went wrong</h3>
                <p>{error}</p>
              </div>
              <button 
                className="retry-button"
                onClick={() => setError(null)}
              >
                Try Again
              </button>
            </div>
          )}

          {loading && <Loading />}

          {searchStats && recommendations && !loading && (
            <div className="results-header">
              <div className="results-stats">
                <h2>Your Perfect Matches</h2>
                <p>We found {searchStats.total} jobs that match your profile</p>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon high-match">
                      <Award size={20} />
                    </div>
                    <div>
                      <div className="stat-number">{searchStats.highMatches}</div>
                      <div className="stat-label">High Matches (&gt;80%)</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon avg-score">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <div className="stat-number">{(searchStats.avgScore * 100).toFixed(0)}%</div>
                      <div className="stat-label">Average Match Score</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon skills">
                      <Users size={20} />
                    </div>
                    <div>
                      <div className="stat-number">{searchStats.skillsFound}</div>
                      <div className="stat-label">Unique Skills Matched</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {recommendations && !loading && (
            <section className="results-section">
              <div className="jobs-grid">
                {recommendations.map((job, index) => (
                  <JobCard key={`${job.id}-${index}`} job={job} index={index} />
                ))}
              </div>
              
              {recommendations.length === 0 && (
                <div className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-icon">🔍</div>
                    <h3>No perfect matches found</h3>
                    <p>Try adjusting your filters or expanding your skill set to see more opportunities.</p>
                    <button 
                      className="cta-button primary"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      Adjust Filters
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {!recommendations && !loading && !error && (
            <section className="features-section">
              <div className="features-container">
                <div className="section-header">
                  <h2>Why Choose CareerSync AI?</h2>
                  <p>Advanced technology meets career expertise</p>
                </div>
                
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon ai-powered">
                      <span>🤖</span>
                    </div>
                    <h3>AI-Powered Matching</h3>
                    <p>Our advanced algorithms analyze thousands of data points to find your perfect role match with 95% accuracy.</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon skill-analysis">
                      <span>🎯</span>
                    </div>
                    <h3>Smart Skill Analysis</h3>
                    <p>We identify both your technical and soft skills, matching them with employer requirements across 50+ categories.</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon real-time">
                      <span>⚡</span>
                    </div>
                    <h3>Real-time Opportunities</h3>
                    <p>Access the latest job openings from top companies, updated daily with fresh opportunities.</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon insights">
                      <span>📊</span>
                    </div>
                    <h3>Detailed Insights</h3>
                    <p>Understand why each job matches your profile with detailed breakdowns of skills, culture, and requirements.</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <h3>CareerSync AI</h3>
                <p>Intelligent Job Matching</p>
              </div>
              <p className="footer-description">
                Transforming job search with artificial intelligence and machine learning.
              </p>
            </div>
            
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
              <a href="#api">API</a>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#blog">Blog</a>
              <a href="#contact">Contact</a>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#status">Status</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 CareerSync AI. All rights reserved.</p>
            <div className="social-links">
              <a href="#twitter">Twitter</a>
              <a href="#linkedin">LinkedIn</a>
              <a href="#github">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;