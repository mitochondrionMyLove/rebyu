import React from 'react';

import { Droplet, FileText, Search, Zap } from 'lucide-react';

const FeatureCardsSection = () => {
  return (
    <section className="feature-cards-section container">
      <div className="cards-grid">
        <div className="feature-card adaptive-card">
          <div className="card-visual adaptive-visual">
            <div className="mockup-panel">
              <div className="panel-header">
                <span>Weak-area scan</span>
              </div>
              <div className="panel-body">
                <div className="analyzed-item">
                  <Search size={14} /> Science: Photosynthesis
                </div>
                <div className="skeleton-line full"></div>
                <div className="skeleton-line half"></div>

                <div className="avatar-preview">
                  <div className="mockup-avatar">72%</div>
                </div>
              </div>
              <div className="panel-footer">
                <div className="btn-mockup green">
                  <span className="icon-wrapper"><Zap size={12} /></span> Drill
                </div>
                <div className="btn-mockup yellow">
                  <span className="icon-wrapper"><FileText size={12} /></span> Notes
                </div>
              </div>
            </div>
          </div>
          <div className="card-content">
            <h3>Adaptive learning</h3>
            <p>
              The system continuously analyzes your performance and <strong>adjusts lessons and difficulty</strong>
              to focus on your weak areas, so every minute you spend reviewing actually counts.
            </p>
          </div>
        </div>

        <div className="feature-card flashcard-card">
          <div className="card-visual flashcard-visual">
            <div className="orbit-system">
              <div className="center-logo">
                <Droplet size={20} fill="currentColor" strokeWidth={0} /> Rebyu
              </div>
              <div className="orbit-avatar a1">MCQ</div>
              <div className="orbit-avatar a2">MATH</div>
              <div className="orbit-avatar a3">SCI</div>
              <div className="orbit-avatar a4">ENG</div>
              <div className="orbit-avatar a5">LOGIC</div>
            </div>
          </div>
          <div className="card-content">
            <h3>AI flashcard and mock exam generator</h3>
            <p>
              Rebyu generates <strong>mock exams and flashcards</strong> that mirror the format,
              difficulty, and coverage of your target entrance exam.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCardsSection;
