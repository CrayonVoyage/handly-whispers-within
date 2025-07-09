import React from 'react';

const HandScheme: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg 
      width="128" 
      height="160" 
      viewBox="0 0 128 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Wrist */}
      <line x1="45" y1="150" x2="45" y2="160" stroke="currentColor" strokeWidth="2"/>
      <line x1="83" y1="150" x2="83" y2="160" stroke="currentColor" strokeWidth="2"/>
      <line x1="45" y1="160" x2="83" y2="160" stroke="currentColor" strokeWidth="2"/>
      
      {/* Palm outline */}
      <path 
        d="M45 150 C40 145, 35 130, 35 110 C35 95, 40 85, 45 80 L50 75 C55 70, 60 65, 65 60 L70 55 C75 50, 80 45, 85 40 C90 35, 95 30, 100 25 L105 20 C110 15, 115 10, 118 8 C120 6, 122 5, 123 5 C124 5, 125 6, 125 8 C125 10, 123 12, 120 15 L115 20 C110 25, 105 30, 100 35 L95 40 C90 45, 85 50, 83 55 L83 150 Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Thumb */}
      <path 
        d="M45 80 C40 75, 35 70, 30 65 C25 60, 20 55, 18 50 C16 45, 15 40, 15 38 C15 36, 16 35, 18 35 C20 35, 22 36, 25 38 C30 42, 35 47, 40 52 C42 54, 44 56, 45 58"
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Index finger */}
      <path 
        d="M50 75 L52 70 C54 65, 56 60, 58 55 C60 50, 62 45, 64 40 C66 35, 68 30, 70 25 C72 20, 74 15, 76 12 C77 10, 78 9, 79 9 C80 9, 81 10, 81 12 C81 14, 80 16, 78 19 C76 22, 74 27, 72 32 C70 37, 68 42, 66 47 C64 52, 62 57, 60 62 C58 67, 56 72, 54 75"
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Middle finger */}
      <path 
        d="M65 60 L67 55 C69 50, 71 45, 73 40 C75 35, 77 30, 79 25 C81 20, 83 15, 85 10 C87 5, 89 2, 91 1 C92 0, 93 0, 94 1 C95 2, 95 3, 94 5 C93 7, 91 10, 89 15 C87 20, 85 25, 83 30 C81 35, 79 40, 77 45 C75 50, 73 55, 71 60"
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Ring finger */}
      <path 
        d="M85 40 L87 35 C89 30, 91 25, 93 20 C95 15, 97 10, 99 7 C100 5, 101 4, 102 4 C103 4, 104 5, 104 7 C104 9, 103 11, 101 14 C99 17, 97 22, 95 27 C93 32, 91 37, 89 40"
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Pinky finger */}
      <path 
        d="M100 25 L102 22 C104 19, 106 16, 108 13 C109 11, 110 10, 111 10 C112 10, 113 11, 113 13 C113 15, 112 17, 110 19 C108 21, 106 23, 104 25"
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Palm lines */}
      <path 
        d="M50 90 C60 95, 70 100, 78 105" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeDasharray="2,2"
      />
      <path 
        d="M48 110 C58 115, 68 120, 75 125" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeDasharray="2,2"
      />
      <path 
        d="M50 130 C60 132, 70 134, 78 136" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeDasharray="2,2"
      />
    </svg>
  );
};

export default HandScheme;