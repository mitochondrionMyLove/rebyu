import React from 'react';

import { Briefcase, Building, Hexagon, Circle, Shield, Pyramid } from 'lucide-react';

const LogosSection = () => {
  return (
    <section className="logos-section container">
      <p className="logos-title">
        Designed to cover all major <strong>Philippine scholarship and college entrance examinations</strong>
      </p>
      
      <div className="logos-wrapper">
        <div className="logo-item">
          <Briefcase size={20} /> UPCAT
        </div>
        <div className="logo-item">
          <Building size={20} /> ACET
        </div>
        <div className="logo-item">
          <Hexagon size={20} /> DOST-SEI
        </div>
        <div className="logo-item">
          <Circle size={20} /> USTET
        </div>
        <div className="logo-item">
          <Shield size={20} /> DCAT
        </div>
        <div className="logo-item">
          <Pyramid size={20} /> PLMAT
        </div>
      </div>
    </section>
  );
};

export default LogosSection;
