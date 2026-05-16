import React, { useState } from 'react';
import { X, Sparkles, Sun, Moon, Plus, Minus, ChevronLeft, ChevronRight, Key, Cpu, ChevronDown } from 'lucide-react';

const predefinedPalettes = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#2dd4bf', '#38bdf8', '#818cf8', '#c084fc', '#f472b6'];

const ZenThemeModal = ({ isOpen, onClose, themeMode, setThemeMode, themeColors, setThemeColors, customApiKey, setCustomApiKey, selectedModel, setSelectedModel, availableModels, modelsLoading }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSettingsTab, setActiveSettingsTab] = useState('theme'); // 'theme' or 'api'

  if (!isOpen) return null;

  const handleAddColor = () => {
    if (themeColors.length >= 5) return;
    const newColors = [...themeColors];
    newColors.splice(activeIndex + 1, 0, themeColors[activeIndex]);
    setThemeColors(newColors);
    setActiveIndex(activeIndex + 1);
  };

  const handleRemoveColor = () => {
    if (themeColors.length <= 1) return;
    const newColors = themeColors.filter((_, i) => i !== activeIndex);
    setThemeColors(newColors);
    setActiveIndex(Math.max(0, activeIndex - 1));
  };

  const updateActiveColor = (color) => {
    const newColors = [...themeColors];
    newColors[activeIndex] = color;
    setThemeColors(newColors);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl w-full max-w-sm flex flex-col items-center p-6 relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors z-10">
          <X size={20} />
        </button>

        {/* Settings Tabs */}
        <div className="flex w-full bg-white/90 dark:bg-white/5 p-1 rounded-2xl mb-6 border border-slate-300 dark:border-white/10 mt-4 relative z-0">
          <button onClick={() => setActiveSettingsTab('theme')} className={`flex-1 p-2 rounded-xl text-sm font-medium transition-all ${activeSettingsTab === 'theme' ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-white/60 hover:text-slate-700 dark:hover:text-white/80'}`}>Thème</button>
          <button onClick={() => setActiveSettingsTab('api')} className={`flex-1 p-2 rounded-xl text-sm font-medium transition-all ${activeSettingsTab === 'api' ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-white/60 hover:text-slate-700 dark:hover:text-white/80'}`}>API & IA</button>
        </div>

        {activeSettingsTab === 'theme' ? (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Top Toggles (Auto, Light, Dark) */}
            <div className="flex bg-white/90 dark:bg-white/5 p-1 rounded-2xl mb-12 border border-slate-300 dark:border-white/10">
              <button 
                onClick={() => setThemeMode('auto')}
                className={`p-2 rounded-xl transition-all ${themeMode === 'auto' ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-white/60 hover:text-slate-700 dark:hover:text-white/80'}`}
              >
                <Sparkles size={18} />
              </button>
              <button 
                onClick={() => setThemeMode('light')}
                className={`p-2 rounded-xl transition-all ${themeMode === 'light' ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-white/60 hover:text-slate-700 dark:hover:text-white/80'}`}
              >
                <Sun size={18} />
              </button>
              <button 
                onClick={() => setThemeMode('dark')}
                className={`p-2 rounded-xl transition-all ${themeMode === 'dark' ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-white/60 hover:text-slate-700 dark:hover:text-white/80'}`}
              >
                <Moon size={18} />
              </button>
            </div>

            {/* Center: Interactive Gradient Stops */}
            <div className="flex items-center justify-center gap-4 h-32 mb-8 relative w-full">
              {themeColors.map((color, index) => {
                const isActive = index === activeIndex;
                return (
                  <div 
                    key={index} 
                    onClick={() => setActiveIndex(index)}
                    className={`rounded-full cursor-pointer transition-all duration-300 relative shadow-lg ${isActive ? 'w-20 h-20 border-[6px] border-slate-900 dark:border-white/90 z-10' : 'w-8 h-8 border-2 border-slate-300 dark:border-white/20 hover:scale-110 z-0'}`}
                    style={{ backgroundColor: color }}
                  >
                    {isActive && (
                      <input 
                        type="color" 
                        value={color}
                        onChange={(e) => updateActiveColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Choisir une couleur"
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Controls (+ / -) */}
            <div className="flex items-center gap-6 mb-10 text-slate-500 dark:text-white/60">
              <button onClick={handleAddColor} disabled={themeColors.length >= 5} className="hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-slate-400 dark:disabled:hover:text-white/50 p-2">
                <Plus size={24} />
              </button>
              <button onClick={handleRemoveColor} disabled={themeColors.length <= 1} className="hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-slate-400 dark:disabled:hover:text-white/50 p-2">
                <Minus size={24} />
              </button>
              <button className="hover:text-slate-900 dark:hover:text-white transition-colors p-2 opacity-50 cursor-not-allowed" title="Plus d'options à venir">
                 <div className="w-6 h-6 flex flex-wrap gap-1 justify-center items-center content-center">
                   <div className="w-[5px] h-[5px] rounded-full bg-current"></div>
                   <div className="w-[5px] h-[5px] rounded-full bg-current"></div>
                   <div className="w-[5px] h-[5px] rounded-full bg-current"></div>
                 </div>
              </button>
            </div>

            {/* Bottom: Palette */}
            <div className="flex items-center w-full justify-between gap-2 px-2 pb-4">
              <button className="text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/70"><ChevronLeft size={16}/></button>
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1">
                {predefinedPalettes.map(color => (
                  <button 
                    key={color}
                    onClick={() => updateActiveColor(color)}
                    className="w-6 h-6 shrink-0 rounded-full border border-slate-300 dark:border-white/10 shadow-sm hover:scale-125 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <button className="text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/70"><ChevronRight size={16}/></button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300 mb-4">
            <div className="flex flex-col gap-2">
               <label className="text-sm font-medium text-slate-700 dark:text-white/90 ml-1 flex items-center gap-2"><Key size={16}/> Clé API Gemini</label>
               <input 
                 type="password" 
                 value={customApiKey} 
                 onChange={e => setCustomApiKey(e.target.value)} 
                 placeholder="AIzaSy..." 
                 className="w-full bg-white/90 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-white/40 focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/20 transition-all" 
               />
               <p className="text-[11px] text-slate-500 dark:text-white/60 ml-1 mt-1 leading-tight">Laissez vide pour utiliser la clé par défaut de l'environnement (si disponible).</p>
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-sm font-medium text-slate-700 dark:text-white/90 ml-1 flex items-center gap-2">
                 <Cpu size={16}/> Modèle IA
                 {modelsLoading && <span className="text-[10px] bg-slate-200 dark:bg-white/20 px-2 py-0.5 rounded-full ml-2 animate-pulse">Chargement...</span>}
               </label>
               <div className="relative">
                 <select 
                   value={selectedModel} 
                   onChange={e => setSelectedModel(e.target.value)} 
                   className="w-full bg-white/90 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-2xl p-4 pr-10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-white/40 focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/20 transition-all appearance-none cursor-pointer"
                 >
                   {availableModels.length > 0 ? (
                     availableModels.map(m => (
                       <option key={m.id} value={m.id}>{m.displayName} ({m.version})</option>
                     ))
                   ) : (
                     <>
                       <option value="gemini-2.5-flash-preview-09-2025">Gemini 2.5 Flash (Défaut)</option>
                       <option value="gemini-2.5-pro-preview-09-2025">Gemini 2.5 Pro</option>
                       <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                       <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                     </>
                   )}
                 </select>
                 <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-white/60 pointer-events-none" />
               </div>
               <p className="text-[11px] text-slate-500 dark:text-white/60 ml-1 mt-1 leading-tight">
                 {availableModels.length > 0 ? "Liste des modèles synchronisée depuis l'API." : "Choisissez le moteur qui traitera vos documents et requêtes."}
               </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ZenThemeModal;