// src/components/ui/input.js
import React from 'react';

const Input = ({ placeholder, type = 'text', className }) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`border rounded-lg p-2 w-full ${className}`}
  />
);

export default Input;  // Ensure this is a default export
