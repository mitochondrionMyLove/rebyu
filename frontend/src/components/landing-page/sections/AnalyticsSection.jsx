import React from 'react';

import { BarChart3, CheckCircle, Clock, FileText, Search, Target } from 'lucide-react';
import Button from '../fragments/Button';

const rows = [
  ['Math: algebra', '88%', 'Strong'],
  ['Science: biology', '72%', 'Review'],
  ['Logic: sequences', '64%', 'Drill'],
];

const AnalyticsSection = () => {
  return (
    <section className="analytics-section container">
      <div className="analytics-grid">
        <div className="analytics-visual">
          <div className="dashboard-mockup">
            <div className="dash-header">
              <h3>Exam readiness</h3>
              <div className="dash-controls">
                <div className="search-bar">
                  <Search size={14} /> <span>Find topic...</span>
                </div>
                <div className="filter-btn">
                  <BarChart3 size={14} /> <span>UPCAT</span>
                </div>
              </div>
            </div>

            <div className="dash-section">
              <div className="readiness-score">
                <span>Readiness score</span>
                <strong>76%</strong>
              </div>
              <div className="dash-table">
                <div className="table-header">
                  <span>Topic</span>
                  <span>Score</span>
                  <span>Status</span>
                </div>
                {rows.map(([topic, score, status]) => (
                  <div className="table-row" key={topic}>
                    <span className="project-name border-left-yellow">{topic}</span>
                    <span className="priority">{score}</span>
                    <span className="client-icon blue">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-content">
          <div className="content-eyebrow">PERFORMANCE ANALYTICS</div>
          <h2>Know exactly how ready you are</h2>
          <p>
            Track your <strong>accuracy, speed, and weak areas</strong> in real time.
            Rebyu's readiness score shows what to review next, so you study smarter.
          </p>
          <div className="analytics-cta">
            <Button variant="primary">Track my progress</Button>
          </div>

          <div className="metrics-grid">
            <div className="metric-badge"><CheckCircle size={16} /> Accuracy rate</div>
            <div className="metric-badge"><Target size={16} /> Exam readiness</div>
            <div className="metric-badge"><Clock size={16} /> Response time</div>
            <div className="metric-badge"><FileText size={16} /> Weak areas</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
