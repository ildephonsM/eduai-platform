// src/components/ui/card.js
import React from 'react';

const Card = ({ children, className }) => (
  <div className={`shadow-md rounded-lg p-4 bg-white ${className}`}>
    {children}
  </div>
);

export default Card;  // Ensure this is a default export
