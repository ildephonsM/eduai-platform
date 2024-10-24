// src/components/ui/button.js
import React from 'react';

const Button = ({ children, onClick, className }) => (
  <button onClick={onClick} className={`px-4 py-2 bg-blue-500 text-white rounded ${className}`}>
    {children}
  </button>
);

export default Button;  // Ensure this is a default export
