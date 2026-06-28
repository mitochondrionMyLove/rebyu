import React from 'react';

import heroImage from '../../../assets/hero.png';
import Button from '../fragments/Button';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-cloud cloud-left"></div>
      <div className="hero-cloud cloud-right"></div>
      <img className="hero-asset hero-asset-back" src={heroImage} alt="" aria-hidden="true" />
      <img className="hero-asset hero-asset-front" src={heroImage} alt="" aria-hidden="true" />

      <div className="container hero-content animate-fade-up">
        <div className="hero-eyebrow">Built for UPCAT, ACET, USTET, DOST-SEI and more</div>
        <h1>AI entrance exam prep for Filipino students</h1>
        <p className="hero-subtitle">
          No more scattered reviewers, static quizzes, or missed scholarship opportunities.
          Rebyu brings lessons, mock exams, flashcards, tutor support, and scholarship tracking
          into one focused study workspace.
        </p>
        <div className="hero-actions">
          <Button variant="primary">Try Rebyu free</Button>
          <Button variant="secondary">Watch a demo</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
