// src/components/LearningInterface.js
import React from 'react';

const LearningInterface = ({ course }) => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4">Learning {course.name}</h2>
    <p>Content for {course.name} will be displayed here.</p>
  </div>
);

export default LearningInterface;
