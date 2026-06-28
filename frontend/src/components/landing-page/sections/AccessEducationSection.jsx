import React from 'react';

import { BookOpen, CalendarClock, CheckCircle, GraduationCap, Search } from 'lucide-react';
import Button from '../fragments/Button';

const AccessEducationSection = () => {
  return (
    <section className="container split-section access-section">
      <div className="split-visual analytics-visual access-visual">
        <div className="dashboard-mockup scholarship-mockup">
          <div className="dash-header">
            <h3>Scholarship tracker</h3>
            <div className="dash-controls">
              <div className="search-bar">
                <Search size={14} /> <span>Find scholarship...</span>
              </div>
            </div>
          </div>

          <div className="dash-section">
            <div className="dash-table">
              <div className="table-header">
                <span>Program</span>
                <span>Deadline</span>
                <span>Match</span>
              </div>
              <div className="table-row">
                <span className="project-name border-left-yellow">DOST-SEI</span>
                <span className="priority">Aug 16</span>
                <span className="client-icon green">High</span>
              </div>
              <div className="table-row">
                <span className="project-name border-left-yellow">SM Foundation</span>
                <span className="priority">Sep 02</span>
                <span className="client-icon blue">Fit</span>
              </div>
              <div className="table-row">
                <span className="project-name border-left-red">CHED Merit</span>
                <span className="priority">Oct 10</span>
                <span className="client-icon red">Check</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="split-content">
        <div className="content-eyebrow">ACCESS TO EDUCATION</div>
        <h2>Prepare for college and find scholarships</h2>
        <p>
          Rebyu helps students discover opportunities, track deadlines, and prepare for
          entrance exams so financial barriers do not stop them from taking the next step.
        </p>

        <div className="tutor-cta">
          <Button variant="primary">Start your journey</Button>
        </div>

        <div className="metrics-grid">
          <div className="metric-badge"><GraduationCap size={16} /> Scholarships</div>
          <div className="metric-badge"><CalendarClock size={16} /> Deadlines</div>
          <div className="metric-badge"><BookOpen size={16} /> Entrance exams</div>
          <div className="metric-badge"><CheckCircle size={16} /> Match and eligibility</div>
        </div>
      </div>
    </section>
  );
};

export default AccessEducationSection;
