import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, RefreshCw, Zap } from 'lucide-react';

interface CameraViewProps {
  onCapture: (image: string) => void;
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsReady(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Failed to access camera. Please check permissions.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
    >
      <div className="absolute inset-0 opacity-[0.05] editorial-dots pointer-events-none" />
      
      <div className="relative w-full h-full md:h-[80vh] md:max-w-6xl md:rounded-[40px] overflow-hidden bg-black flex flex-col border border-white/10 shadow-2xl">
        {error ? (
          <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
            <X className="w-16 h-16 text-red-500 mb-6" />
            <p className="text-xl text-white font-light tracking-tight mb-8 max-w-md">{error}</p>
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neon-green transition-all"
            >
              Hubga qaytish
            </button>
          </div>
        ) : (
          <>
            {/* Top Bar Overlay */}
            <div className="absolute inset-x-0 top-0 z-20 flex justify-between items-center p-8 bg-gradient-to-b from-black/80 to-transparent">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-neon-green/10 border border-neon-green/30 rounded text-[10px] text-neon-green font-mono uppercase tracking-[0.2em]">
                     <RefreshCw className="w-3 h-3 animate-spin" />
                     Oqim_X9_Faol
                  </div>
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                     Ruxsat: 1280x720_RAW
                  </div>
               </div>
               <button onClick={onClose} className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-white/60" />
               </button>
            </div>

            {/* Video Feed */}
            <div className="relative flex-1 bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover opacity-80"
              />
              
              {/* Scan Target HUD */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
                 <div className="relative w-full max-w-[400px] aspect-square">
                    <div className="absolute inset-0 border border-white/10 rounded-3xl" />
                    <div className="absolute inset-[-20px] pointer-events-none opacity-40">
                       <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-neon-green" />
                       <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-neon-green" />
                       <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-neon-green" />
                       <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-neon-green" />
                    </div>
                    
                    <motion.div 
                      className="absolute inset-x-0 h-[1px] bg-neon-green/40 shadow-[0_0_15px_#00FF88]"
                      animate={{ top: ["5%", "95%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Technical Markers */}
                    <div className="absolute top-4 left-6 text-[8px] font-mono text-neon-green/40 uppercase tracking-[0.4em]">Focal_Lock_882</div>
                    <div className="absolute bottom-4 right-6 text-[8px] font-mono text-neon-green/40 uppercase tracking-[0.4em]">Grid_Aligned</div>
                 </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex justify-between items-center p-12 bg-gradient-to-t from-black/90 to-transparent">
               <div className="w-1/3 hidden md:flex flex-col gap-2">
                 <div className="flex items-center gap-4">
                    <div className="w-1 h-1 bg-neon-green rounded-full shadow-[0_0_5px_#00FF88]" />
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">ISO 400</div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-1 h-1 bg-white/20 rounded-full" />
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">EXP 1/120</div>
                 </div>
               </div>

               <div className="flex flex-col items-center gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={captureImage}
                    disabled={!isReady}
                    className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center p-1.5 transition-all group disabled:opacity-50 cursor-pointer"
                  >
                    <div className="w-full h-full rounded-full border border-white/10 flex items-center justify-center group-hover:bg-neon-green transition-all group-hover:border-neon-green shadow-xl">
                      <Camera className="w-8 h-8 text-white group-hover:text-black transition-colors" />
                    </div>
                  </motion.button>
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.5em]">Rasmga_olish</span>
               </div>

               <div className="w-1/3 flex justify-end">
                  <button className="flex items-center gap-3 p-4 rounded-2xl glass-panel border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                     <Zap className="w-5 h-5 text-neon-green" />
                     <span className="text-[10px] font-bold text-white uppercase tracking-widest">Aura_kuchaytirish</span>
                  </button>
               </div>
            </div>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </motion.div>
  );
};
