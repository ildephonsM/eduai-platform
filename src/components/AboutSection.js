import React from 'react';
import Card from '../ui/card';  // Make sure this path is correct
import { Brain, Book, GraduationCap } from 'lucide-react';

const AboutSection = () => (
  <div className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8">Why Choose EduAI?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6">
          <Brain className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">AI-Powered Learning</h3>
          <p className="text-gray-600">Get personalized tutoring and adaptive learning paths.</p>
        </Card>
        <Card className="p-6">
          <Book className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Comprehensive Resources</h3>
          <p className="text-gray-600">Access curated videos and interactive materials.</p>
        </Card>
        <Card className="p-6">
          <GraduationCap className="w-12 h-12 text-purple-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Guided Practice</h3>
          <p className="text-gray-600">Learn through guided problem-solving and feedback.</p>
        </Card>
      </div>
    </div>
  </div>
);

export default AboutSection;
