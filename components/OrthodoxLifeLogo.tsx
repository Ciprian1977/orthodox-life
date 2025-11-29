import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export const OrthodoxLifeLogo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 48, 
  color = "#B08968" // Default Primary Gold-Beige
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Halo/Circle - Symbol of Eternity */}
      <circle 
        cx="50" 
        cy="50" 
        r="48" 
        stroke={color} 
        strokeWidth="2.5" 
        opacity="0.3" 
      />
      
      {/* Cross Vertical Beam */}
      <rect 
        x="46" 
        y="15" 
        width="8" 
        height="70" 
        rx="1" 
        fill={color} 
      />
      
      {/* Cross Horizontal Beam */}
      <rect 
        x="20" 
        y="38" 
        width="60" 
        height="8" 
        rx="1" 
        fill={color} 
      />
      
      {/* Lower Slanted Beam (Russian/Byzantine style hint) */}
      <rect 
        x="42" 
        y="65" 
        width="16" 
        height="6" 
        rx="1" 
        transform="rotate(-20 50 68)" 
        fill={color} 
        opacity="0.8"
      />
      
      {/* Inner Light/Center */}
      <circle cx="50" cy="42" r="3" fill="#FAF5F0" />
    </svg>
  );
};