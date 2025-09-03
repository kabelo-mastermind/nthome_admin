import React from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Importing the up arrow icon
import './scrollTop.css'
const ScrollToTopButton = () => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      onClick={handleScrollToTop} 
      className="scroll-to-top-btn"
      aria-label="Scroll to top"
    >
      <FaArrowUp size={24} />
    </button>
  );
};

export default ScrollToTopButton;
