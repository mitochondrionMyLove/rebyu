import React from 'react';

import logo from '../../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer container">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="brand-logo">
            <img src={logo} alt="Rebyu Logo" className="brand-icon" />
            <span className="brand-text">Rebyu</span>
          </div>
          <p className="footer-desc">
            AI-powered entrance exam prep and scholarship discovery for Filipino students.
          </p>
        </div>
        <div className="footer-links">
          <div className="link-column">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Stories</a>
          </div>
          <div className="link-column">
            <h4>Prepare</h4>
            <a href="#features">Mock exams</a>
            <a href="#benefits">Flashcards</a>
            <a href="#faq">Scholarships</a>
          </div>
          <div className="link-column">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Rebyu. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
