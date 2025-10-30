'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

interface AnimateLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

const AnimateLayout: React.FC<AnimateLayoutProps> = ({ 
  children, 
  showNavbar = true, 
  showFooter = true 
}) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween' as const,
    ease: 'anticipate' as const,
    duration: 0.5
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <motion.main
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex-1"
      >
        {children}
      </motion.main>
      {showFooter && <Footer />}
    </div>
  );
};

export default AnimateLayout;
