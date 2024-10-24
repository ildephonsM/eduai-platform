import React from 'react';
import { Facebook, Twitter, Instagram, Link } from 'lucide-react'; // Replace LinkedIn with Link

const Footer = () => (
  <footer className="bg-gray-800 text-white py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <div>
          <h5 className="text-lg font-bold">EduAI</h5>
          <p className="mt-1 text-sm">Empowering learners through AI-driven education.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" aria-label="Facebook" className="hover:text-blue-500">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-blue-400">
            <Twitter className="w-6 h-6" />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-pink-500">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-blue-600">
            <Link className="w-6 h-6" /> {/* Use Link as an alternative */}
          </a>
        </div>
      </div>
      <div className="mt-4 flex justify-between border-t border-gray-700 pt-4 text-sm text-gray-400">
        <div>
          <a href="#" className="hover:text-gray-300">Privacy Policy</a> | 
          <a href="#" className="hover:text-gray-300"> Terms of Service</a>
        </div>
        <div>
          <p>&copy; {new Date().getFullYear()} EduAI. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
