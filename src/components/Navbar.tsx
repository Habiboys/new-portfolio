import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="text-xl font-medium bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              My Portfolio
            </Link>
          </motion.div>

          {/* Desktop Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center space-x-8"
          >
            {isHomePage ? (
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                About
              </button>
            ) : (
              <Link
                to="/#about"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                About
              </Link>
            )}
            <Link
              to="/experience"
              className={`transition-colors duration-200 ${
                location.pathname === '/experience' 
                  ? 'text-gray-900 font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Experience
            </Link>
            <Link
              to="/projects"
              className={`transition-colors duration-200 ${
                location.pathname === '/projects' 
                  ? 'text-gray-900 font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Projects
            </Link>
            <Link
              to="/blog"
              className={`transition-colors duration-200 ${
                location.pathname === '/blog' 
                  ? 'text-gray-900 font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Blog
            </Link>
            {isHomePage ? (
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Gallery
              </button>
            ) : (
              <Link
                to="/#gallery"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Gallery
              </Link>
            )}
            {isHomePage ? (
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Contact
              </button>
            ) : (
              <Link
                to="/#contact"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Contact
              </Link>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => {
              const mobileMenu = document.getElementById('mobile-menu');
              if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
              }
            }}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          id="mobile-menu"
          initial={false}
          className="hidden md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isHomePage ? (
              <button
                onClick={() => {
                  scrollToSection('about');
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                About
              </button>
            ) : (
              <Link
                to="/#about"
                onClick={() => {
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                About
              </Link>
            )}
            <Link
              to="/experience"
              onClick={() => {
                document.getElementById('mobile-menu')?.classList.add('hidden');
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Experience
            </Link>
            <Link
              to="/projects"
              onClick={() => {
                document.getElementById('mobile-menu')?.classList.add('hidden');
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Projects
            </Link>
            <Link
              to="/blog"
              onClick={() => {
                document.getElementById('mobile-menu')?.classList.add('hidden');
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Blog
            </Link>
            {isHomePage ? (
              <button
                onClick={() => {
                  scrollToSection('gallery');
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Gallery
              </button>
            ) : (
              <Link
                to="/#gallery"
                onClick={() => {
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Gallery
              </Link>
            )}
            {isHomePage ? (
              <button
                onClick={() => {
                  scrollToSection('contact');
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Contact
              </button>
            ) : (
              <Link
                to="/#contact"
                onClick={() => {
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Contact
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;