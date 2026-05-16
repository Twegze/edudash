import React, { useState } from 'react';
import { VolumeX, Volume2, Users } from 'lucide-react';

const InstructionsWidget = () => {
  const [activeMode, setActiveMode] = useState(null);
  
  const modes = [
    { id: 0, icon: VolumeX, title: "Silence absolu", desc: "Travail individuel" },
    { id: 1, icon: Volume2, title: "Chuchotements", desc: "Entraide autorisée" },
    { id: 2, icon: Users, title: "Travail de groupe", desc: "Échanges modérés" }
  ];

  return (
    <div className="md:col-span-2 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-around min-h-[160px] gap-4">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = activeMode === mode.id;
        const isDimmed = activeMode !== null && !isActive;
        return (
          <button 
            key={mode.id}
            onClick={() => setActiveMode(isActive ? null : mode.id)}
            className={`flex-1 text-center p-4 md:p-6 w-full rounded-2xl transition-all duration-300 border border-transparent ${isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-[1.02] shadow-xl dark:border-white/10' : isDimmed ? 'opacity-40 hover:opacity-70' : 'hover:bg-slate-200/50 dark:hover:bg-white/10'}`}
          >
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${isActive ? 'bg-[var(--md-sys-color-on-primary)] text-[var(--md-sys-color-primary)]' : 'bg-white/90 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white'}`}>
              <Icon size={32} />
            </div>
            <span className={`font-bold block ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{mode.title}</span>
            <span className={`text-sm mt-1 block ${isActive ? 'text-white/90' : 'text-slate-500 dark:text-white/60'}`}>{mode.desc}</span>
          </button>
        )
      })}
    </div>
  );
};

export default InstructionsWidget;