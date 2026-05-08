import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export const BackgroundParticles: React.FC = () => {
  const particles = useMemo(() => Array.from({ length: 40 }), []);
  const cells = useMemo(() => Array.from({ length: 8 }), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Editorial Dots Background */}
      <div className="absolute inset-0 opacity-[0.03] editorial-dots" />

      {/* Gradients for depth (BioCore Style) */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-neon-green opacity-10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald opacity-10 blur-[120px] rounded-full" />
      
      {/* Subtle DNA Strands (Editorial Style) */}
      <div className="absolute top-0 right-0 w-1/4 h-full opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 800">
           <path d="M10,0 Q60,100 10,200 Q-40,300 10,400 Q60,500 10,600 Q-40,700 10,800" fill="none" stroke="#00FF88" strokeWidth="0.5" />
           <path d="M40,0 Q-10,100 40,200 Q90,300 40,400 Q-10,500 40,600 Q90,700 40,800" fill="none" stroke="#00CCFF" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
};
