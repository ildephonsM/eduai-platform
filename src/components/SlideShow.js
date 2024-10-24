// SlideShow.js
import React, { useState, useEffect } from 'react';
import Button from '../ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './SlideShow.css'; // Import the CSS file

const SlideShow = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[500px] animated-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            {slides[currentSlide].icon}
            <h1 className="text-4xl font-bold mt-4 mb-4">{slides[currentSlide].title}</h1>
            <p className="text-xl mb-8">{slides[currentSlide].description}</p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="arrow-button"
                aria-label="Previous Slide"
              >
                <ArrowLeft className="arrow-icon" />
              </Button>
              <Button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="arrow-button"
                aria-label="Next Slide"
              >
                <ArrowRight className="arrow-icon" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideShow;
