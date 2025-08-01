// src/components/Footer.jsx (or .tsx)

import React from 'react';
// Assuming you have react-icons installed for actual icons.
// npm install react-icons
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id='contact'
      className="bg-black text-gray-300 py-12 px-4 sm:px-6 lg:px-8
                 min-h-[35vh] md:min-h-[40vh] flex flex-col justify-between
                 relative overflow-hidden border-t border-gray-800" // Added border-t for a subtle separation
    >
      {/* Subtle background animation - ensure keyframes are in tailwind.config.js */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto z-10 flex flex-col md:flex-row justify-between items-start md:items-center text-center md:text-left space-y-8 md:space-y-0 md:space-x-12">

        {/* Brand & Description Section */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <h3 className="text-3xl font-bold text-white mb-3">Grant AI</h3>
          <p className="text-gray-400 text-lg leading-relaxed">
            AI Powered Ideas: Your Grant Writing Assistant For Non-Profit Organizations.
          </p>
        </div>

        {/* Navigation Links Section */}
        <nav className="w-full md:w-1/3 lg:w-1/2">
          <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-lg">
            <li>
              <a
                href="#features"
                className="hover:text-purple-400 transform hover:translate-x-1 transition-all duration-300 ease-in-out inline-block"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className="hover:text-purple-400 transform hover:translate-x-1 transition-all duration-300 ease-in-out inline-block"
              >
                Testimonials
              </a>
            </li>
            <li>
              <a
                href="#home"
                className="hover:text-purple-400 transform hover:translate-x-1 transition-all duration-300 ease-in-out inline-block"
              >
                Home
              </a>
            </li>
            
            
            
          </ul>
        </nav>

        {/* Social Media & Contact Info Section */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <h4 className="text-xl font-semibold text-white mb-4">Connect With Us</h4>
          <div className="flex justify-center md:justify-start space-x-6 text-3xl">
            <a
              href="https://x.com/naik_swasti"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors duration-300 ease-in-out
                         transform hover:-translate-y-1 hover:scale-110 inline-block"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.linkedin.com/in/swasti-naik-5aa7a3351/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors duration-300 ease-in-out
                         transform hover:-translate-y-1 hover:scale-110 inline-block"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/Swastinaik"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors duration-300 ease-in-out
                         transform hover:-translate-y-1 hover:scale-110 inline-block"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
          {/* Optional: Add contact info */}
          <p className="text-gray-400 text-md mt-4">
            Email: <a href="swastinaik273@gmail.com" className="hover:text-purple-400 transition-colors">swastinaik273@gmail.com</a>
          </p>
        </div>

      </div>

      {/* Copyright at the very bottom */}
      <div className="container mx-auto z-10 text-center mt-8 pt-4 border-t border-gray-800">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Grant AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;