import React from 'react';

import Button from './Button.jsx';
import logo from '../../../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar container">
      <div className="navbar-brand">
        <img src={logo} alt="Rebyu Logo" className="brand-icon" />
        <span className="brand-text">Rebyu</span>
      </div>
      
      <div className="navbar-links">
        <a href="#features">Features</a>
        <a href="#benefits">Benefits</a>
        <a href="#testimonials">Stories</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </div>

      <div className="navbar-actions">
        <Button variant="secondary">Sign in</Button>
      </div>
    </nav>
  );
};

export default Navbar;
