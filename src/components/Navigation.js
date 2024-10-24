import React from 'react';
import Button from '../ui/button';
import { GraduationCap, LogIn } from 'lucide-react';

const Navigation = ({ loggedIn, setIsLoginModal }) => (
  <nav className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center">
          <GraduationCap className="w-8 h-8 text-blue-500" />
          <span className="ml-2 text-xl font-bold">EduAI</span>
        </div>
        {!loggedIn && (
          <Button
            onClick={() => setIsLoginModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-md transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <LogIn className="w-5 h-5" />
            <span className="font-medium">Login</span>
          </Button>
        )}
      </div>
    </div>
  </nav>
);

export default Navigation;
