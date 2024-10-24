import React from 'react';
import Card from '../ui/card';  // Make sure this path is correct

const CourseSelection = ({ courses, setSelectedCourse }) => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4">Select a Course</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.map(course => (
        <Card key={course.id} className="cursor-pointer hover:shadow-lg" onClick={() => setSelectedCourse(course)}>
          <div className="p-4">
            <h3 className="text-xl font-bold">{course.name}</h3>
            <p>{course.level}</p>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default CourseSelection;
