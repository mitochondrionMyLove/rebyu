import React from 'react';

import { BookOpen, FileText, MessageCircle, RefreshCw } from 'lucide-react';
import Button from '../fragments/Button';

const AiTutorSection = () => {
  return (
    <section className="container split-section tutor-section">
      <div className="split-content">
        <div className="content-eyebrow">AI STUDY TUTOR</div>
        <h2>Your personal tutor, always on</h2>
        <p>
          Stuck on a topic? <strong>Rebyu's AI tutor</strong> gives instant concept explanations,
          step-by-step solutions, and simplified discussions tailored to your level.
        </p>

        <div className="tutor-cta">
          <Button variant="primary">Ask Rebyu now</Button>
        </div>

        <div className="tutor-badges">
          <div className="badge-item"><BookOpen size={16} /> Concept explanation</div>
          <div className="badge-item"><MessageCircle size={16} /> Simplified discussion</div>
          <div className="badge-item"><RefreshCw size={16} /> Step-by-step solution</div>
          <div className="badge-item"><FileText size={16} /> AI-generated notes</div>
        </div>
      </div>

      <div className="split-visual tutor-visual">
        <div className="budget-mockup tutor-chat">
          <div className="mockup-section">
            <h4>Ask Rebyu</h4>
            <div className="chat-bubble user">Why does mitosis create identical cells?</div>
            <div className="chat-bubble assistant">
              Because the cell copies its DNA first, then separates matching chromosomes into two new nuclei.
            </div>
            <div className="chat-steps">
              <span>1. DNA duplicates</span>
              <span>2. Chromosomes align</span>
              <span>3. Cell splits evenly</span>
            </div>
          </div>
          <div className="mockup-section border-top">
            <h4>Next practice</h4>
            <div className="practice-card">
              <strong>Biology drill</strong>
              <span>15 questions - 12 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiTutorSection;
