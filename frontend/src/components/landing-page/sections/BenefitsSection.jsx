import React from 'react';

import { Activity, FileUp, Smartphone, Target, Users } from 'lucide-react';

const BenefitsSection = () => {
  return (
    <section className="container benefits-section" id="benefits">
      <div className="benefits-header">
        <div className="content-eyebrow">BENEFITS</div>
        <h2>Built for Filipino students, powered by AI</h2>
      </div>

      <div className="benefits-grid top-grid">
        <div className="benefit-card large-card">
          <div className="card-visual visual-bg-light">
            <div className="toggle-mockup device-mockup">
              <Smartphone size={28} />
              <strong>Study anywhere</strong>
              <span>Lessons, quizzes, and progress sync across devices.</span>
            </div>
          </div>
          <div className="card-content">
            <h3>Study anytime, anywhere</h3>
            <p><strong>No review center required.</strong> Rebyu gives students a complete AI-powered review experience on any device.</p>
          </div>
        </div>

        <div className="benefit-card large-card">
          <div className="card-visual visual-bg-light">
            <div className="apps-grid upload-grid">
              <div className="app-icon"><FileUp size={18} /></div>
              <div className="app-icon"><Target size={18} /></div>
              <div className="app-icon"><Activity size={18} /></div>
              <div className="app-icon"><Users size={18} /></div>
            </div>
          </div>
          <div className="card-content">
            <h3>Upload your notes and let AI help</h3>
            <p><strong>Your reviewers, organized.</strong> Upload files and turn them into structured lessons, flashcards, quizzes, and mock exams.</p>
          </div>
        </div>
      </div>

      <div className="benefits-grid bottom-grid">
        <div className="benefit-card small-card">
          <div className="icon-wrapper"><Users size={20} /></div>
          <h4>Study with a community</h4>
          <p>Connect with fellow exam takers, share tips, and keep momentum during long review periods.</p>
        </div>

        <div className="benefit-card small-card">
          <div className="icon-wrapper"><Target size={20} /></div>
          <h4>Personalized for your exam</h4>
          <p>Choose your target exam and Rebyu tailors lessons, drills, and mock tests around it.</p>
        </div>

        <div className="benefit-card small-card">
          <div className="icon-wrapper"><Activity size={20} /></div>
          <h4>Daily challenges</h4>
          <p>Improve speed and accuracy with timed practice that feels close to real exam pressure.</p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
