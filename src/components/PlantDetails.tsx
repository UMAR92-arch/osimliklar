import React from 'react';
import { motion } from 'motion/react';
import { Sprout, Droplets, Sun, AlertTriangle, ShieldCheck, ArrowLeft, Leaf } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export interface PlantInfo {
  name: string;
  scientificName: string;
  species: string;
  description: string;
  benefits: string[];
  careTips: string[];
  toxicity: string;
  waterNeeds: string;
  sunlightNeeds: string;
  isPlant: boolean;
  dangerPercentage: number;
  rarity: string;
  isRedBook: boolean;
  safetyWarning: string;
}

interface PlantDetailsProps {
  plant: PlantInfo;
  onReset: () => void;
}

export const PlantDetails: React.FC<PlantDetailsProps> = ({ plant, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col h-full bg-dark-bg/50 overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-black/20 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={onReset}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-1 uppercase">{plant.name}</h1>
            <p className="text-neon-green font-mono text-[10px] md:text-xs uppercase tracking-[0.2em]">{plant.scientificName}</p>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 p-1 rounded-full border border-white/10 bg-white/5">
           <div className={`px-6 py-2 rounded-full text-black text-[10px] font-bold uppercase tracking-widest ${plant.isRedBook ? 'bg-red-500' : 'bg-neon-green'}`}>
              {plant.isRedBook ? 'Qizil Kitobda' : 'Botanika Tahlili'}
           </div>
           <div className="px-6 py-2 text-neon-green text-[10px] font-bold uppercase tracking-widest font-mono">
              Xavf: {plant.dangerPercentage}%
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Aspect: The Overview */}
        <div className="lg:w-[40%] border-r border-white/5 p-10 py-12 overflow-y-auto custom-scrollbar space-y-12 bg-black/10">
          
          {/* SAFETY WARNING - ICON LOGIC UPDATED */}
          <div className={`p-8 rounded-3xl border-2 text-center relative overflow-hidden ${plant.dangerPercentage > 30 ? 'bg-red-500/10 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-emerald/10 border-neon-green shadow-[0_0_30px_rgba(0,255,136,0.2)]'}`}>
             <div className="flex justify-center mb-4">
                {plant.dangerPercentage > 30 ? (
                  <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
                ) : (
                  <Leaf className="w-12 h-12 text-neon-green" />
                )}
             </div>
             <h4 className="text-lg font-bold uppercase tracking-widest text-white mb-2">
               {plant.dangerPercentage > 30 ? 'Xavfli / Zaharli' : 'Xavfsiz / Foydali'}
             </h4>
             <p className="text-sm font-medium leading-relaxed text-white/90">
                {plant.safetyWarning}
             </p>
             <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${plant.dangerPercentage > 30 ? 'bg-red-500' : 'bg-neon-green'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${plant.dangerPercentage}%` }}
                  transition={{ duration: 1 }}
                />
             </div>
             <div className="mt-2 text-[10px] font-mono uppercase tracking-widest opacity-60">
               Xavflilik ko'rsatkichi: {plant.dangerPercentage}%
             </div>
          </div>

          <div className="space-y-6">
             <div className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-mono mb-4">Botanika Tavsifi</div>
             <div className="markdown-body font-serif text-xl md:text-2xl text-white/80 leading-relaxed italic border-l-2 border-emerald/20 pl-6 mb-8">
                <ReactMarkdown>{plant.description}</ReactMarkdown>
             </div>
             
             {/* Rarity integrated into information */}
             <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-neon-green/60 uppercase tracking-[0.2em] block mb-2">Kamyoblik:</span>
                <p className="text-sm italic text-white/80">{plant.rarity}</p>
             </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.4em] border-b border-white/5 pb-4">Ehtiyojlar va holat</h3>
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-cyan font-mono text-[10px] uppercase tracking-widest">
                      <Droplets className="w-3 h-3" /> Suv
                   </div>
                   <p className="text-sm font-medium">{plant.waterNeeds}</p>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-orange-400 font-mono text-[10px] uppercase tracking-widest">
                      <Sun className="w-3 h-3" /> Quyosh nuri
                   </div>
                   <p className="text-sm font-medium">{plant.sunlightNeeds}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Right Aspect: The Details Grid */}
        <div className="flex-1 p-10 py-12 overflow-y-auto custom-scrollbar bg-dark-bg/30 relative">
          <div className="absolute inset-0 opacity-[0.02] editorial-dots pointer-events-none" />
          
          <div className="relative space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl md:text-2xl font-light tracking-tight text-white uppercase italic">Bio-ekologik afzalliklar</h2>
                <div className="flex-1 h-[1px] bg-white/5" />
                <ShieldCheck className="text-neon-green w-6 h-6 opacity-40 shrink-0" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plant.benefits.map((benefit, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 glass-panel rounded-2xl border-white/5 hover:border-neon-green/20 transition-all group"
                  >
                    <span className="text-[10px] font-mono text-neon-green/40 mb-2 block uppercase tracking-widest">Asosiy jihat {i+1}</span>
                    <p className="text-sm text-white/70 leading-relaxed italic group-hover:text-white transition-colors">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl md:text-2xl font-light tracking-tight text-white uppercase italic">O'stirish bo'yicha ko'rsatmalar</h2>
                <div className="flex-1 h-[1px] bg-white/5" />
                <Sprout className="text-emerald w-6 h-6 opacity-40 shrink-0" />
              </div>

              <div className="space-y-6">
                 {plant.careTips.map((tip, i) => (
                   <div key={i} className="flex gap-6 items-start group">
                      <div className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-[10px] font-mono text-white/20 group-hover:border-neon-green/30 group-hover:text-neon-green transition-all shrink-0">
                         0{i+1}
                      </div>
                      <div className="pt-1">
                         <p className="text-base md:text-lg text-white/50 group-hover:text-white/90 transition-colors leading-relaxed font-light italic">
                           {tip}
                         </p>
                      </div>
                   </div>
                 ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
