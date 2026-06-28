import React from 'react';

const Button = ({ children, variant = 'primary', className = '', onClick }) => {
  return (
    <button
      type="button"
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
