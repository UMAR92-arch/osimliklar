/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scan, 
  Upload, 
  Camera as CameraIcon, 
  Leaf, 
  Search, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Microscope,
  Menu,
  MessageSquare,
  Zap,
  RefreshCw,
  ArrowLeft,
  Sprout
} from 'lucide-react';
import { BackgroundParticles } from './components/BackgroundElements';
import { AnalysisOverlay } from './components/AnalysisOverlay';
import { CameraView } from './components/CameraView';
import { PlantDetails, PlantInfo } from './components/PlantDetails';
import { identifyPlantByImage, identifyPlantByName, describePlantByPrompt } from './services/plantService';
import confetti from 'canvas-confetti';

export default function App() {
  const [view, setView] = useState<'hub' | 'result' | 'describe'>('hub');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [plantResult, setPlantResult] = useState<PlantInfo | null>(null);
  const [plantNameInput, setPlantNameInput] = useState('');
  const [describeInput, setDescribeInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const handleAnalysisStart = async (source: 'image' | 'name' | 'describe', data: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    try {
      let result;
      if (source === 'image') {
        result = await identifyPlantByImage(data);
      } else if (source === 'name') {
        result = await identifyPlantByName(data);
      } else {
        result = await describePlantByPrompt(data);
      }
      
      // Artificial delay to show animation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setPlantResult(result);
      setView('result');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#059669']
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(error instanceof Error ? error.message : "Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleAnalysisStart('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-neon-green/30 bg-dark-bg text-text-main font-sans">
      <BackgroundParticles />
      
      {/* HUD NAV */}
      <nav className="relative z-40 flex justify-between items-center px-8 py-6 border-b border-white/5 backdrop-blur-md overflow-hidden">
        <div className="flex items-center gap-3 pointer-events-auto group cursor-pointer" onClick={() => setView('hub')}>
          <div className="w-8 h-8 rounded-full border-2 border-neon-green flex items-center justify-center">
            <div className="w-2 h-2 bg-neon-green rounded-full"></div>
          </div>
          <span className="font-bold tracking-tighter text-xl text-white uppercase italic">IIP<span className="text-neon-green">_SYSTEM</span></span>
        </div>

        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 pointer-events-none">
           <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.8em]">Invasives Plants</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-semibold text-white/50 pointer-events-auto">
           <button 
             onClick={() => setView('hub')}
             className={`hover:text-neon-green transition-colors ${view === 'hub' ? 'border-b border-neon-green text-neon-green' : ''}`}
           >
             Skaner
           </button>
           <button 
             onClick={() => setView('describe')}
             className={`hover:text-neon-green transition-colors ${view === 'describe' ? 'border-b border-neon-green text-neon-green' : ''}`}
           >
             Tasvirlash
           </button>
           <div className="px-4 py-1.5 rounded-full border border-neon-green/30 text-neon-green bg-neon-green/5">Tizim Faol</div>
        </div>
      </nav>

      <main className="relative z-10 flex h-[calc(100vh-81px)] overflow-hidden">
        {/* Left Sidebar: Meta Data */}
        <aside className="hidden lg:flex w-72 border-r border-white/5 p-8 flex-col justify-between shrink-0 overflow-y-auto bg-black/20 backdrop-blur-sm">
          <div className="space-y-12">
            <div className="space-y-3">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Tahlil Rejimi</p>
              <h3 className="text-xl font-medium tracking-tight">
                {view === 'describe' ? 'Botanika Tasavvuri' : 'Molekulyar Spektral'}
              </h3>
            </div>
            
            <div className="space-y-6">
              {[
                { 
                  label: view === 'result' && plantResult?.isRedBook ? 'QIZIL KITOB HOLATI' : 'SKANNERLASH ANIQLIGI', 
                  value: view === 'result' ? (plantResult?.isRedBook ? 'KRITIK' : '99.8%') : '99.8%', 
                  color: view === 'result' && plantResult?.isRedBook ? '#ef4444' : 'var(--color-neon-green)', 
                  width: view === 'result' && plantResult?.isRedBook ? '100%' : '99.8%'
                },
                { 
                  label: view === 'result' ? 'XAVF DARAJASI' : 'XLOROFIL ZICHLIGI', 
                  value: view === 'result' ? `${plantResult?.dangerPercentage || 0}%` : 'YUQORI', 
                  color: view === 'result' && (plantResult?.dangerPercentage || 0) > 30 ? '#ef4444' : 'var(--color-emerald)', 
                  width: view === 'result' ? `${plantResult?.dangerPercentage}%` : '72%' 
                }
              ].map((stat) => (
                <div key={stat.label} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-between mb-3 text-[10px] text-white/40 font-mono">
                    <span>{stat.label}</span>
                    <span style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full" 
                      style={{ backgroundColor: stat.color, boxShadow: `0 0 10px ${stat.color}` }}
                      initial={{ width: 0 }}
                      animate={{ width: stat.width }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="text-[10px] font-mono text-white/30 leading-loose">
              <span className="text-neon-green/60">[LOG]</span> INIT SCAN_SEQ_882<br />
              <span className="text-neon-green/60">[LOG]</span> DB_SYNC_SUCCESS<br />
              <span className="text-neon-green/60">[LOG]</span> TAYYOR...
            </div>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity cursor-pointer group"
            >
               <Scan className="w-10 h-10 text-white/40 group-hover:text-neon-green transition-colors" />
            </div>
          </div>
        </aside>

        <section className="flex-1 relative overflow-y-auto custom-scrollbar flex flex-col">
          <AnimatePresence mode="wait">
            {view === 'hub' ? (
              <motion.div
                key="hub"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 relative"
              >
                {/* Background Glow for Scanner */}
                <div className="absolute w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[100px]" />

                <div className="relative w-full max-w-[480px] aspect-square rounded-full border border-white/5 flex items-center justify-center scale-90 md:scale-100">
                  {/* Rotating Ring */}
                  <div className="absolute inset-0 border-[2px] border-neon-green/20 rounded-full animate-spin-slow border-dashed" />
                  <div className="absolute inset-8 border border-white/10 rounded-full" />
                  
                  {/* Interaction Hub */}
                  <div className="relative z-20 w-full px-10 flex flex-col items-center text-center">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="w-20 h-20 bg-neon-green/10 rounded-3xl flex items-center justify-center mb-8 border border-neon-green/40 shadow-[0_0_30px_rgba(0,255,136,0.2)]"
                    >
                       <CameraIcon className="w-10 h-10 text-neon-green" />
                    </motion.div>
                    
                    <h2 className="text-3xl font-light tracking-tight text-white mb-3">Turlarni aniqlash</h2>
                    <p className="text-sm text-white/40 mb-10 font-light">Kamerani qarating yoki botanika ma'lumotlar bazasidan qidiring</p>

                    <div className="w-full space-y-4">
                       <div className="relative group">
                          <input 
                            type="text" 
                            value={plantNameInput}
                            onChange={(e) => setPlantNameInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && plantNameInput && handleAnalysisStart('name', plantNameInput)}
                            placeholder="Umumiy nomi..."
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-full px-8 text-sm text-white focus:outline-none focus:border-neon-green transition-all"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-neon-green rounded-full shadow-[0_0_10px_#00FF88]" />
                       </div>

                       <div className="flex gap-4">
                          <div className="flex-1">
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full h-14 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neon-green transition-all cursor-pointer"
                            >
                               Yuklash
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                          </div>
                          <button 
                            onClick={() => setShowCamera(true)}
                            className="flex-1 h-14 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all backdrop-blur-md cursor-pointer"
                          >
                             Skaner
                          </button>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Floating Info Tag Area */}
                <div className="absolute top-20 right-10 hidden xl:flex glass-panel p-4 rounded-2xl border-white/10 items-center gap-4">
                  <div className="w-12 h-12 bg-neon-green/10 rounded-xl flex items-center justify-center text-neon-green font-bold text-xs font-mono">DNA</div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">NEURAL_SYNC</div>
                    <div className="text-xs font-mono text-white/80">#SYS_882_READY</div>
                  </div>
                </div>

                <div className="mt-20 flex gap-12 opacity-30">
                  {['BIOLUMIN_V4', 'EMERALD_CORE', 'SEED_VAULT'].map((sys) => (
                    <div key={sys} className="font-mono text-[8px] uppercase tracking-[0.4em]">{sys}</div>
                  ))}
                </div>
              </motion.div>
            ) : view === 'describe' ? (
              <motion.div
                key="describe"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col items-center justify-center p-8 md:p-12"
              >
                <div className="max-w-2xl w-full space-y-12 text-center">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white uppercase italic">
                       O'simlik tasvirlash
                    </h2>
                    <p className="text-white/40 font-light leading-relaxed">
                       O'simlikning ko'rinishi, barglari shakli va boshqa xususiyatlarini yozing. AI tahlil qilib, uning turini aniqlaydi.
                    </p>
                  </div>
                  
                  <div className="relative group">
                     <textarea 
                        value={describeInput}
                        onChange={(e) => setDescribeInput(e.target.value)}
                        placeholder="Masalan: Barglari katta va yashil, teshiklari bor, tropik o'simlik..."
                        className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-8 text-lg font-light text-white focus:outline-none focus:border-neon-green transition-all resize-none"
                     />
                     <button 
                        onClick={() => describeInput && handleAnalysisStart('describe', describeInput)}
                        className="absolute bottom-6 right-6 px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neon-green transition-all"
                     >
                        Tahlil qilish
                     </button>
                  </div>

                  <div className="flex justify-center gap-12 opacity-20 filter grayscale">
                     <Leaf className="w-12 h-12" />
                     <Sprout className="w-12 h-12" />
                     <Microscope className="w-12 h-12" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <PlantDetails 
                plant={plantResult!} 
                onReset={() => {
                  setView('hub');
                  setPlantResult(null);
                  setPlantNameInput('');
                  setDescribeInput('');
                }} 
              />
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer className="fixed bottom-0 inset-x-0 h-10 border-t border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 text-[9px] font-mono text-white/30 z-30">
        <div className="hidden lg:flex gap-8 uppercase tracking-widest">
            <span>Sessiya: IIP_X_CORE</span>
            <span>Identifikator: INVASIVE_DETECTOR</span>
            <span>Neyron moslik: 99.8%</span>
        </div>
        <div className="flex items-center gap-6 uppercase tracking-widest w-full lg:w-auto justify-between lg:justify-end">
            <span className="text-neon-green flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-neon-green rounded-full" />
              Dvigatel barqaror
            </span>
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-neon-green/40"
                 animate={{ width: ["20%", "80%", "40%"] }}
                 transition={{ duration: 10, repeat: Infinity }}
               />
            </div>
        </div>
      </footer>

      {/* Overlays */}
      <AnalysisOverlay isVisible={isAnalyzing} progress={analysisProgress} />
      
      <AnimatePresence>
        {showCamera && (
          <CameraView 
            onCapture={(img) => {
              setShowCamera(false);
              handleAnalysisStart('image', img);
            }} 
            onClose={() => setShowCamera(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
