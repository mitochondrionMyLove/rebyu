import React from 'react';

import { Bot, BookOpen, ClipboardCheck, FileText, MessageCircle, Share } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="features-section container" id="features">
      <div className="features-header">
        <h2>Everything you need to review with direction</h2>
        <p>
          Rebyu turns exam coverage into structured lessons, timed drills, and focused review
          tasks so students always know what to study next.
        </p>
      </div>

      <div className="feature-grid">
        <div className="feature-content">
          <h3>Structured course system</h3>
          <p>
            Study <strong>English, Math, Science, Logical Reasoning, and other subjects</strong>
            through organized modules mapped to major Philippine entrance and scholarship exams.
          </p>
        </div>

        <div className="feature-mockup feature-gradient">
          <div className="mockup-card">
            <div className="mockup-header">
              <div className="mockup-brand">
                <Bot size={20} className="mockup-icon" />
                <span>Rebyu Study Plan</span>
              </div>
              <button className="mockup-share"><Share size={14} /> Share plan</button>
            </div>

            <div className="mockup-body">
              <div className="mockup-message">
                <div className="avatar">R</div>
                <div className="message-content">
                  <div className="message-author">Rebyu Coach <span>2 minutes ago</span></div>
                  <p>Your science score is improving. Review cell division next, then answer a 15-item timed quiz.</p>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>

              <div className="mockup-popup">
                <div className="popup-item"><BookOpen size={14} /> Lessons</div>
                <div className="popup-item"><FileText size={14} /> Flashcards</div>
                <div className="popup-item active"><ClipboardCheck size={14} /> Mock exam</div>
                <div className="popup-item"><MessageCircle size={14} /> Ask tutor</div>
              </div>
            </div>

            <div className="mockup-footer">
              <span className="replay-btn">Resume</span>
              <div className="mockup-input">
                <div className="ai-sparkle">*</div>
                <span>Ask about any topic...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
