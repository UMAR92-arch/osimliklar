import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Zap } from 'lucide-react';

interface AnalysisOverlayProps {
  isVisible: boolean;
  progress: number;
}

export const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({ isVisible, progress }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          {/* Grid Background Effect */}
          <div className="absolute inset-0 opacity-[0.05] editorial-dots" />
          
          <div className="relative w-full max-w-lg p-12 flex flex-col items-center">
            {/* Spinning Radar Loader */}
            <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
               <motion.div 
                 className="absolute inset-0 rounded-full border border-neon-green/20 border-dashed"
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               />
               <motion.div 
                 className="absolute inset-4 rounded-full border border-emerald/40"
                 animate={{ rotate: -360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               />
               <motion.div 
                 className="w-24 h-24 rounded-full bg-neon-green/10 flex items-center justify-center border border-neon-green/40 shadow-[0_0_50px_rgba(0,255,136,0.2)]"
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
               >
                  <Zap className="w-10 h-10 text-neon-green" />
               </motion.div>
            </div>

            <div className="space-y-2 text-center mb-10 w-full">
              <motion.h2 
                className="text-4xl font-light text-white tracking-tight uppercase italic"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Tahlil qilinmoqda
              </motion.h2>
              <p className="text-neon-green/50 font-mono text-[10px] uppercase tracking-[0.5em]">
                Neyron aloqa o'rnatildi
              </p>
            </div>

            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden mb-4">
              <motion.div 
                className="absolute inset-y-0 bg-neon-green glow-green shadow-[0_0_15px_#00FF88]"
                initial={{ left: "-100%", width: "100%" }}
                animate={{ left: `${progress - 100}%` }}
              />
            </div>
            
            <div className="flex justify-between w-full font-mono text-[9px] text-white/30 uppercase tracking-widest">
              <span>Sektor_Bio_X9</span>
              <span className="text-neon-green font-bold">{Math.floor(progress)}% TAYYOR</span>
              <span>Bufer_882_A</span>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 w-full">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald/40"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    />
                 </div>
               ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
