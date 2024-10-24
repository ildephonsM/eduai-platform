import React, { useState } from 'react';
import Navigation from './components/Navigation';
import SlideShow from './components/SlideShow';
import AboutSection from './components/AboutSection';
import CourseSelection from './components/CourseSelection';
import LearningInterface from './components/LearningInterface';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import Footer from './components/Footer'; // Import the Footer component
import { courses } from './data/courses';
import { Brain, Book, GraduationCap } from 'lucide-react'; // Importing icons

const EducationPlatform = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isRegisterModal, setIsRegisterModal] = useState(false);

  const slides = [
    {
      title: "Learn Smarter with AI",
      description: "Get personalized tutoring powered by advanced AI technology",
      icon: <Brain className="w-16 h-16 text-blue-500" />
    },
    {
      title: "Interactive Learning",
      description: "Engage with curated content and get real-time feedback",
      icon: <Book className="w-16 h-16 text-green-500" />
    },
    {
      title: "Master Any Subject",
      description: "From mathematics to programming, we've got you covered",
      icon: <GraduationCap className="w-16 h-16 text-purple-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation loggedIn={loggedIn} setIsLoginModal={setIsLoginModal} />
      {!loggedIn && <SlideShow slides={slides} />}
      {!loggedIn && <AboutSection />}
      {loggedIn && !selectedCourse && <CourseSelection courses={courses} setSelectedCourse={setSelectedCourse} />}
      {loggedIn && selectedCourse && <LearningInterface course={selectedCourse} />}
      {isLoginModal && 
        <LoginModal 
          setLoggedIn={setLoggedIn} 
          setIsLoginModal={setIsLoginModal} 
          setIsRegisterModal={setIsRegisterModal} // Pass setIsRegisterModal to LoginModal
        />
      }
      {isRegisterModal && 
        <RegisterModal 
          setLoggedIn={setLoggedIn} 
          setIsRegisterModal={setIsRegisterModal} 
        />
      }
      <Footer /> {/* Add the Footer component here */}
    </div>
  );
};

export default EducationPlatform;
