'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = false // Changed default to false since we're using the logo image
}) => {
  const sizeMap = {
    sm: { width: 100, height: 26 },
    md: { width: 140, height: 36 },
    lg: { width: 160, height: 42 }
  };

  const heightClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11'
  };

  return (
    <Link href="/" className={`flex items-center ${className} group`}>
      <Image
        src="/png/logo-new.png"
        alt="Elivate"
        width={sizeMap[size].width}
        height={sizeMap[size].height}
        className={`${heightClasses[size]} w-auto transition-transform group-hover:scale-105`}
        priority
      />
    </Link>
  );
};

export default Logo;
