import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Sparkles, Settings, Clock, Users, Mic, Volume2, 
  Moon, Sun, Palette, Play, Pause, RotateCcw, VolumeX,
  BookOpen, GraduationCap, Send, ChevronRight, Shuffle, 
  CheckCircle2, Plus, Calendar, FileText, Search, ListChecks,
  ChevronDown, X, UploadCloud, FileImage, FileSpreadsheet, 
  File, Trash2, Paperclip, AlertCircle, Minus, ChevronLeft,
  Lightbulb, Layers, Key, Cpu
} from 'lucide-react';

// --- STYLES MATERIAL YOU & DÉGRADÉS ---
const materialThemeStyles = `
  :root {
    --transition-colors: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }
  
  .theme-wrapper {
    --md-sys-color-primary: hsl(var(--hue), 70%, 40%);
    --md-sys-color-on-primary: #ffffff;
    --md-sys-color-primary-container: hsl(var(--hue), 80%, 90%);
    --md-sys-color-on-primary-container: hsl(var(--hue), 90%, 15%);
    --md-sys-color-secondary-container: hsl(var(--hue), 30%, 90%);
    --md-sys-color-on-secondary-container: hsl(var(--hue), 40%, 15%);
    --md-sys-color-surface: hsl(var(--hue), 20%, 98%);
    --md-sys-color-surface-variant: hsl(var(--hue), 15%, 92%);
    --md-sys-color-on-surface: hsl(var(--hue), 10%, 10%);
    --md-sys-color-on-surface-variant: hsl(var(--hue), 10%, 30%);
    --md-sys-color-outline: hsl(var(--hue), 10%, 50%);
    --md-sys-color-error: #ba1a1a;
    --md-sys-color-on-error: #ffffff;
    --md-sys-color-error-container: #ffdad6;
    --md-sys-color-on-error-container: #410002;
  }

  .theme-wrapper.dark {
    --md-sys-color-primary: hsl(var(--hue), 80%, 75%);
    --md-sys-color-on-primary: hsl(var(--hue), 90%, 15%);
    --md-sys-color-primary-container: hsl(var(--hue), 60%, 25%);
    --md-sys-color-on-primary-container: hsl(var(--hue), 80%, 90%);
    --md-sys-color-secondary-container: hsl(var(--hue), 30%, 25%);
    --md-sys-color-on-secondary-container: hsl(var(--hue), 40%, 90%);
    --md-sys-color-surface: hsl(var(--hue), 15%, 8%);
    --md-sys-color-surface-variant: hsl(var(--hue), 15%, 15%);
    --md-sys-color-on-surface: hsl(var(--hue), 10%, 95%);
    --md-sys-color-on-surface-variant: hsl(var(--hue), 10%, 75%);
    --md-sys-color-outline: hsl(var(--hue), 10%, 60%);
    --md-sys-color-error: #ffb4ab;
    --md-sys-color-on-error: #690005;
    --md-sys-color-error-container: #93000a;
    --md-sys-color-on-error-container: #ffdad6;
  }

  .bg-white/5 backdrop-blur-md border border-white/10 shadow-xl { background-color: var(--md-sys-color-surface); color: var(--md-sys-color-on-surface); transition: var(--transition-colors); }
  .bg-white/5 backdrop-blur-md border border-white/10 shadow-xl { background-color: var(--md-sys-color-surface-variant); color: var(--md-sys-color-on-surface); transition: var(--transition-colors); }
  .bg-primary { background-color: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); transition: var(--transition-colors); }
  .bg-white/5 backdrop-blur-md border border-white/10 shadow-xl { background-color: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container); transition: var(--transition-colors); }
  .bg-white/5 backdrop-blur-md border border-white/10 shadow-xl { background-color: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); transition: var(--transition-colors); }
  
  /* Nouvelles classes de Dégradé (Gradient) */
  .bg-gradient-to-r from-purple-500 to-pink-500 text-white { 
    background: var(--theme-gradient); 
    color: #ffffff; 
  }
  .bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 { 
    background: var(--theme-gradient); 
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent; 
    background-clip: text; 
    color: transparent;
  }
  
  .text-primary { color: var(--md-sys-color-primary); transition: var(--transition-colors); }
  .text-white-variant { color: var(--md-sys-color-on-surface-variant); transition: var(--transition-colors); }
  .text-white { color: var(--md-sys-color-on-primary-container); transition: var(--transition-colors); }
  .border-white/10 { border-color: var(--md-sys-color-outline); transition: var(--transition-colors); }

  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--md-sys-color-outline); border-radius: 4px; opacity: 0.5; }
  
  /* Grille pointillée pour le Zen Modal */
  .zen-grid-bg {
    background-color: #1a1a1c;
    background-image: radial-gradient(circle, #ffffff15 1px, transparent 1px);
    background-size: 16px 16px;
  }
`;

// --- UTILITAIRES ---
const hexToHue = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  if (max !== min) {
    let d = max - min;
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return Math.round(h * 360);
};

const predefinedPalettes = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#2dd4bf', '#38bdf8', '#818cf8', '#c084fc', '#f472b6'];


// --- COMPOSANT MODAL PERSONNALISATION (STYLE ZEN BROWSER) ---

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
      <div className="bg-black/40 backdrop-blur-xl w-full max-w-sm rounded-[40px] shadow-2xl flex flex-col items-center p-6 relative overflow-hidden border border-white/10 animate-in zoom-in-95 duration-300">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10">
          <X size={20} />
        </button>

        {/* Settings Tabs */}
        <div className="flex w-full bg-white/5 p-1 rounded-2xl mb-6 border border-white/5 shadow-inner mt-4 relative z-0">
          <button onClick={() => setActiveSettingsTab('theme')} className={`flex-1 p-2 rounded-xl text-sm font-medium transition-all ${activeSettingsTab === 'theme' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}>Thème</button>
          <button onClick={() => setActiveSettingsTab('api')} className={`flex-1 p-2 rounded-xl text-sm font-medium transition-all ${activeSettingsTab === 'api' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}>API & IA</button>
        </div>

        {activeSettingsTab === 'theme' ? (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Top Toggles (Auto, Light, Dark) */}
            <div className="flex bg-white/5 p-1 rounded-2xl mb-12 border border-white/5 shadow-inner">
              <button 
                onClick={() => setThemeMode('auto')}
                className={`p-2 rounded-xl transition-all ${themeMode === 'auto' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                <Sparkles size={18} />
              </button>
              <button 
                onClick={() => setThemeMode('light')}
                className={`p-2 rounded-xl transition-all ${themeMode === 'light' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                <Sun size={18} />
              </button>
              <button 
                onClick={() => setThemeMode('dark')}
                className={`p-2 rounded-xl transition-all ${themeMode === 'dark' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
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
                    className={`rounded-full cursor-pointer transition-all duration-300 relative shadow-lg ${isActive ? 'w-20 h-20 border-[6px] border-white/90 z-10' : 'w-8 h-8 border-2 border-white/20 hover:scale-110 z-0'}`}
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
            <div className="flex items-center gap-6 mb-10 text-white/50">
              <button onClick={handleAddColor} disabled={themeColors.length >= 5} className="hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-white/50 p-2">
                <Plus size={24} />
              </button>
              <button onClick={handleRemoveColor} disabled={themeColors.length <= 1} className="hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-white/50 p-2">
                <Minus size={24} />
              </button>
              <button className="hover:text-white transition-colors p-2 opacity-50 cursor-not-allowed" title="Plus d'options à venir">
                 <div className="w-6 h-6 flex flex-wrap gap-1 justify-center items-center content-center">
                   <div className="w-[5px] h-[5px] rounded-full bg-current"></div>
                   <div className="w-[5px] h-[5px] rounded-full bg-current"></div>
                   <div className="w-[5px] h-[5px] rounded-full bg-current"></div>
                 </div>
              </button>
            </div>

            {/* Bottom: Palette */}
            <div className="flex items-center w-full justify-between gap-2 px-2 pb-4">
              <button className="text-white/30 hover:text-white/70"><ChevronLeft size={16}/></button>
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1">
                {predefinedPalettes.map(color => (
                  <button 
                    key={color}
                    onClick={() => updateActiveColor(color)}
                    className="w-6 h-6 shrink-0 rounded-full border border-white/10 shadow-sm hover:scale-125 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <button className="text-white/30 hover:text-white/70"><ChevronRight size={16}/></button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300 mb-4">
            <div className="flex flex-col gap-2">
               <label className="text-sm font-medium text-white/90 ml-1 flex items-center gap-2"><Key size={16}/> Clé API Gemini</label>
               <input 
                 type="password" 
                 value={customApiKey} 
                 onChange={e => setCustomApiKey(e.target.value)} 
                 placeholder="AIzaSy..." 
                 className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all" 
               />
               <p className="text-[11px] text-white/50 ml-1 mt-1 leading-tight">Laissez vide pour utiliser la clé par défaut de l'environnement (si disponible).</p>
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-sm font-medium text-white/90 ml-1 flex items-center gap-2">
                 <Cpu size={16}/> Modèle IA
                 {modelsLoading && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full ml-2 animate-pulse">Chargement...</span>}
               </label>
               <div className="relative">
                 <select 
                   value={selectedModel} 
                   onChange={e => setSelectedModel(e.target.value)} 
                   className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pr-10 text-white text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all appearance-none cursor-pointer"
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
                 <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
               </div>
               <p className="text-[11px] text-white/50 ml-1 mt-1 leading-tight">
                 {availableModels.length > 0 ? "Liste des modèles synchronisée depuis l'API." : "Choisissez le moteur qui traitera vos documents et requêtes."}
               </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


// --- COMPOSANTS DE PRÉVISUALISATION DE FICHIERS ---
const FilePreviewCard = ({ file, onRemove, compact = false }) => {
  if (!file) return null;

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  const isExcel = file.type.includes('excel') || file.type.includes('spreadsheet');
  const isWord = file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx');
  const isPPT = file.type.includes('presentation') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx');

  const Icon = isImage ? FileImage : isExcel ? FileSpreadsheet : isWord ? FileText : File;
  const colorClass = isImage ? "text-blue-500" : isPDF ? "text-red-500" : isExcel ? "text-green-500" : isWord ? "text-blue-700" : isPPT ? "text-orange-500" : "text-gray-500";

  if (!compact && isImage) {
    return (
      <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
        <img src={file.dataUrl} alt={file.name} className="w-full max-h-[400px] object-contain bg-black/5" />
        <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-sm font-medium truncate px-2">{file.name}</span>
          {onRemove && (
            <button onClick={onRemove} type="button" className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!compact && isPDF) {
    return (
      <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl h-[500px] flex flex-col">
        <div className="p-3 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-2 text-white">
             <File size={18} className="text-red-500" />
             <span className="font-medium text-sm truncate">{file.name}</span>
          </div>
          {onRemove && (
            <button onClick={onRemove} type="button" className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <iframe src={`${file.dataUrl}#toolbar=0`} className="w-full flex-1" title={file.name} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl border border-white/10 shadow-sm relative group">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl ${colorClass}`}>
          <Icon size={24} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium text-white truncate">{file.name}</span>
          <span className="text-xs text-white-variant uppercase tracking-wider">
            {isImage ? 'Image' : isPDF ? 'Document PDF' : isWord ? 'Document Word' : isExcel ? 'Classeur Excel' : isPPT ? 'Présentation' : 'Fichier attaché'}
          </span>
        </div>
      </div>
      {onRemove && (
        <button onClick={onRemove} type="button" className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
};


// --- OUTILS DE CLASSE ---

const InstructionsWidget = () => {
  const [activeMode, setActiveMode] = useState(null);
  
  const modes = [
    { id: 0, icon: VolumeX, title: "Silence absolu", desc: "Travail individuel" },
    { id: 1, icon: Volume2, title: "Chuchotements", desc: "Entraide autorisée" },
    { id: 2, icon: Users, title: "Travail de groupe", desc: "Échanges modérés" }
  ];

  return (
    <div className="md:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-around shadow-sm min-h-[160px] gap-4">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = activeMode === mode.id;
        const isDimmed = activeMode !== null && !isActive;
        return (
          <button 
            key={mode.id}
            onClick={() => setActiveMode(isActive ? null : mode.id)}
            className={`flex-1 text-center p-4 md:p-6 w-full rounded-2xl transition-all duration-300 border border-transparent ${isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-[1.02] shadow-xl border-white/10' : isDimmed ? 'opacity-40 hover:opacity-70' : 'hover:bg-white/20'}`}
          >
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 shadow-sm transition-colors ${isActive ? 'bg-[var(--md-sys-color-on-primary)] text-primary' : 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-primary'}`}>
              <Icon size={32} />
            </div>
            <span className={`font-bold block ${isActive ? 'text-white' : 'text-white'}`}>{mode.title}</span>
            <span className={`text-sm mt-1 block ${isActive ? 'text-white/90' : 'text-white opacity-80'}`}>{mode.desc}</span>
          </button>
        )
      })}
    </div>
  );
};

const GroupMakerWidget = ({ classes }) => {
  const [names, setNames] = useState("Jade\nRaphaël\nLouis\nInès\nLucas\nChloé\nHugo\nAntoine\nNathan\nCamille\nManon\nEmma\nSarah\nLéa\nThéo");
  const [numGroups, setNumGroups] = useState(4);
  const [groups, setGroups] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [selectedSource, setSelectedSource] = useState("manual");

  const handleSourceChange = (e) => {
    const val = e.target.value;
    setSelectedSource(val);
    if (val !== "manual") {
      const cls = classes.find(c => c.id === val);
      if (cls) setNames(cls.students || "");
    }
  };

  const generateGroups = () => {
    const list = names.split('\n').map(n => n.trim()).filter(n => n);
    if (list.length === 0) return;
    const actualNumGroups = Math.min(numGroups, list.length);
    
    let shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const newGroups = Array.from({ length: actualNumGroups }, () => []);
    shuffled.forEach((name, i) => {
      newGroups[i % actualNumGroups].push(name);
    });
    
    setGroups(newGroups);
    setIsGenerated(true);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-6 flex flex-col shadow-sm h-full max-h-[400px]">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-primary" size={24} />
        <h3 className="font-semibold text-lg flex-1">Générateur de Groupes</h3>
      </div>
      
      {isGenerated ? (
        <div className="flex-1 flex flex-col overflow-hidden">
           <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 gap-2 mb-4">
              {groups.map((g, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-3 rounded-xl border border-white/10 text-sm">
                  <div className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-1 border-b border-white/10 pb-1">Groupe {i+1}</div>
                  <ul className="text-white">
                    {g.map((name, j) => <li key={j}>• {name}</li>)}
                  </ul>
                </div>
              ))}
           </div>
           <button onClick={() => setIsGenerated(false)} className="w-full py-3 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-full text-white hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl transition-colors font-medium border border-white/10">
             Modifier / Recommencer
           </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <select 
              value={selectedSource} 
              onChange={handleSourceChange}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-2 rounded-xl text-sm border border-white/10 focus:ring-2 focus:ring-primary text-white outline-none shadow-inner"
            >
              <option value="manual">-- Liste manuelle --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>Classe : {c.name}</option>
              ))}
            </select>
            
            <textarea
              value={names}
              onChange={(e) => {
                setNames(e.target.value);
                setSelectedSource("manual"); // Repasse en manuel si on édite
              }}
              className="flex-1 w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-4 resize-none border border-white/10 focus:ring-2 focus:ring-primary text-sm text-white outline-none shadow-inner"
              placeholder="Liste des élèves (un par ligne)..."
            />
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-2 rounded-2xl shadow-inner border border-white/10">
              <label className="text-sm text-white-variant ml-2 flex-1">Nb. de groupes :</label>
              <input 
                type="number" min="2" max="15" 
                value={numGroups} onChange={(e) => setNumGroups(parseInt(e.target.value)||2)}
                className="w-16 text-center bg-transparent border-none focus:ring-0 text-white font-bold outline-none"
              />
            </div>
            <button 
              onClick={generateGroups}
              disabled={names.trim().length === 0}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
            >
              Créer les groupes
            </button>
        </div>
      )}
    </div>
  );
};

const TimerWidget = () => {
  const [time, setTime] = useState(15 * 60);
  const [isActive, setIsActive] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(15);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => { setIsActive(false); setTime(inputMinutes * 60); };
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm h-full">
      <div className="flex items-center gap-2 mb-4 w-full">
        <Clock className="text-primary" size={24} />
        <h3 className="font-semibold text-lg">Chronomètre</h3>
      </div>
      <div className="text-6xl font-bold font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
        {formatTime(time)}
      </div>
      <div className="flex gap-4 mb-4">
        <button onClick={toggle} className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center hover:opacity-90 shadow-md transition-transform active:scale-95">
          {isActive ? <Pause fill="white" size={24} /> : <Play fill="white" size={24} className="ml-1" />}
        </button>
        <button onClick={reset} className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl flex items-center justify-center hover:opacity-90 shadow-sm transition-transform active:scale-95">
          <RotateCcw size={24} className="text-white" />
        </button>
      </div>
      {!isActive && (
        <div className="flex items-center gap-2 mt-4 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-2 rounded-2xl shadow-inner">
          <input 
            type="number" min="1" max="90" value={inputMinutes} 
            onChange={(e) => setInputMinutes(parseInt(e.target.value) || 1)}
            className="w-16 text-center bg-transparent border-none focus:ring-0 text-white font-semibold outline-none"
          />
          <span className="text-sm text-white-variant">min</span>
          <button onClick={reset} className="ml-2 text-primary p-2 hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl transition-colors">
            <CheckCircle2 size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

const RandomPickerWidget = ({ classes }) => {
  const [names, setNames] = useState("Alice\nBob\nCharlie\nDiana\nÉric\nFatima\nGabriel");
  const [selected, setSelected] = useState(null);
  const [isPicking, setIsPicking] = useState(false);
  const [selectedSource, setSelectedSource] = useState("manual");

  const handleSourceChange = (e) => {
    const val = e.target.value;
    setSelectedSource(val);
    if (val !== "manual") {
      const cls = classes.find(c => c.id === val);
      if (cls) setNames(cls.students || "");
    }
  };

  const pickRandom = () => {
    const list = names.split('\n').map(n => n.trim()).filter(n => n);
    if (list.length === 0) return;
    setIsPicking(true);
    setSelected(null);
    let count = 0;
    const interval = setInterval(() => {
      setSelected(list[Math.floor(Math.random() * list.length)]);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setIsPicking(false);
        setSelected(list[Math.floor(Math.random() * list.length)]);
      }
    }, 100);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-6 flex flex-col shadow-sm h-full">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-primary" size={24} />
        <h3 className="font-semibold text-lg flex-1">Tirage au sort</h3>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        {selected ? (
          <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300 shadow-inner">
            <span className="text-sm text-white opacity-80 mb-2">
              {isPicking ? "Sélection en cours..." : "L'élève choisi est :"}
            </span>
            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">{selected}</span>
            {!isPicking && (
              <button 
                onClick={() => setSelected(null)}
                className="mt-6 text-sm px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-full shadow-sm hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl transition-colors text-white"
              >
                Retour à la liste
              </button>
            )}
          </div>
        ) : (
          <>
            <select 
              value={selectedSource} 
              onChange={handleSourceChange}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-2 rounded-xl text-sm border border-white/10 focus:ring-2 focus:ring-primary text-white outline-none shadow-inner"
            >
              <option value="manual">-- Liste manuelle --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>Classe : {c.name}</option>
              ))}
            </select>
            <textarea
              value={names}
              onChange={(e) => {
                setNames(e.target.value);
                setSelectedSource("manual");
              }}
              className="flex-1 w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-4 resize-none border border-white/10 focus:border-transparent focus:ring-2 focus:ring-[var(--md-sys-color-primary)] text-sm text-white shadow-inner outline-none"
              placeholder="Collez votre liste d'élèves ici (un par ligne)..."
            />
          </>
        )}
        <button 
          onClick={pickRandom}
          disabled={isPicking || names.trim().length === 0}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
        >
          <Shuffle size={20} /> Tirer au sort
        </button>
      </div>
    </div>
  );
};

const NoiseMeterWidget = () => {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const updateVolume = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    const avg = sum / dataArray.length;
    const normalizedVolume = Math.min(100, Math.round((avg / 128) * 100));
    setVolume(normalizedVolume);
    animationFrameRef.current = requestAnimationFrame(updateVolume);
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      setIsListening(true);
      updateVolume();
    } catch (err) {
      console.error(err);
      setIsListening(true);
      const fakeVolumeLoop = () => {
        setVolume(Math.floor(Math.random() * 30) + 10);
        animationFrameRef.current = setTimeout(fakeVolumeLoop, 300);
      };
      fakeVolumeLoop();
    }
  };

  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
    audioContextRef.current = null;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      clearTimeout(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsListening(false);
    setVolume(0);
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  let barColor = "bg-green-500";
  let statusText = "Calme";
  if (volume > 40) { barColor = "bg-yellow-500"; statusText = "Attention"; }
  if (volume > 75) { barColor = "bg-red-500"; statusText = "Trop bruyant !"; }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-6 flex flex-col shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mic className="text-primary" size={24} />
          <h3 className="font-semibold text-lg">Sonomètre</h3>
        </div>
        <button 
          onClick={isListening ? stopListening : startListening}
          className={`p-3 rounded-full flex items-center justify-center transition-colors shadow-sm ${
            isListening ? 'bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)]' : 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-white hover:opacity-80'
          }`}
        >
          {isListening ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="w-full h-8 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-full overflow-hidden border border-white/10 shadow-inner">
          <div className={`h-full transition-all duration-100 ease-out ${barColor}`} style={{ width: `${Math.max(5, volume)}%` }} />
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-1">{volume} %</div>
          <div className="text-sm font-medium text-white-variant uppercase tracking-wider">{statusText}</div>
        </div>
      </div>
      {!isListening && (
        <p className="text-xs text-center text-white-variant mt-4 opacity-70">
          Cliquez sur l'icône pour activer le microphone.
        </p>
      )}
    </div>
  );
};


// --- COMPOSANT FILS D'ACTUALITÉ DES CLASSES ---

const ClassesFeed = ({ classes, setClasses, courses, setCourses, updateClassStudents }) => {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || null);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [activeSubTab, setActiveSubTab] = useState('feed'); // 'feed' or 'students'
  
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ 
    title: "", 
    content: "", 
    date: new Date().toISOString().split('T')[0],
    file: null 
  });
  
  const [filterDate, setFilterDate] = useState("");
  const fileInputRef = useRef(null);

  // States for student management
  const [localStudentsText, setLocalStudentsText] = useState("");
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const selectedClass = classes.find(c => c.id === selectedClassId);

  // Sync local text area with the selected class students
  useEffect(() => {
    if (selectedClass) {
      setLocalStudentsText(selectedClass.students || "");
    }
  }, [selectedClassId, classes]);

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const newClass = { id: Date.now().toString(), name: newClassName.trim(), students: "" };
    setClasses([...classes, newClass]);
    setSelectedClassId(newClass.id);
    setActiveSubTab('feed');
    setNewClassName("");
    setIsAddingClass(false);
  };

  const handleSaveStudents = () => {
    updateClassStudents(selectedClassId, localStudentsText);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewCourse({
        ...newCourse,
        file: {
          name: file.name,
          type: file.type,
          dataUrl: event.target.result
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setNewCourse({ ...newCourse, file: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return; 
    const course = {
      id: Date.now().toString(),
      classId: selectedClassId,
      ...newCourse
    };
    setCourses([course, ...courses]);
    setIsAddingCourse(false);
    setNewCourse({ title: "", content: "", date: new Date().toISOString().split('T')[0], file: null });
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const filteredCourses = courses
    .filter(c => c.classId === selectedClassId)
    .filter(c => filterDate ? c.date === filterDate : true)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-[600px]">
      
      {/* Sidebar Classes */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <Users size={20} className="text-primary"/> Mes Classes
            </h2>
          </div>
          
          <div className="flex flex-col gap-2">
            {classes.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedClassId(c.id); setActiveSubTab('feed'); }}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                  selectedClassId === c.id 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md font-medium' 
                    : 'hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-white-variant'
                }`}
              >
                <span>{c.name}</span>
                <ChevronRight size={16} className={selectedClassId === c.id ? 'opacity-100' : 'opacity-0'} />
              </button>
            ))}

            {isAddingClass ? (
              <form onSubmit={handleAddClass} className="flex items-center gap-2 mt-2">
                <input 
                  type="text" autoFocus
                  value={newClassName} onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Nom de la classe..."
                  className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-2 rounded-xl text-sm border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none"
                />
                <button type="submit" className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-sm hover:opacity-90 transition-opacity">
                  <CheckCircle2 size={16} />
                </button>
                <button type="button" onClick={() => setIsAddingClass(false)} className="p-2 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-white-variant rounded-xl shadow-sm hover:bg-outline/10 transition-colors">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsAddingClass(true)}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-white/10 text-white-variant hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:text-primary transition-colors"
              >
                <Plus size={18} /> Ajouter une classe
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col gap-4">
        {selectedClass ? (
          <>
            {/* Header & SubTabs */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-4 shadow-sm flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-xl text-white">Classe : {selectedClass.name}</h2>
                </div>
                
                {/* Sub-navigation Tabs */}
                <div className="flex bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-1 rounded-2xl shadow-inner border border-white/10">
                  <button 
                    onClick={() => setActiveSubTab('feed')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSubTab === 'feed' ? 'bg-primary text-white shadow-md' : 'text-white-variant hover:text-primary'}`}
                  >
                    Documents & Cours
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('students')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSubTab === 'students' ? 'bg-primary text-white shadow-md' : 'text-white-variant hover:text-primary'}`}
                  >
                    Liste des Élèves
                  </button>
                </div>
              </div>
            </div>

            {/* Content Switch based on SubTab */}
            {activeSubTab === 'students' ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-6 shadow-sm border border-white/10 flex-1 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                    <Users size={20} /> Gestion des élèves
                  </h3>
                  <span className="text-sm font-medium bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-white px-3 py-1 rounded-full shadow-inner">
                    {localStudentsText.split('\n').filter(n => n.trim()).length} élèves
                  </span>
                </div>
                
                <p className="text-sm text-white-variant">
                  Copiez-collez votre liste d'élèves ici. Saisissez <strong>un élève par ligne</strong>. Cette liste sera automatiquement proposée dans les outils "Tirage au sort" et "Générateur de groupes".
                </p>
                
                <textarea
                  value={localStudentsText}
                  onChange={(e) => setLocalStudentsText(e.target.value)}
                  className="flex-1 w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-4 resize-none border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary text-white shadow-inner outline-none min-h-[300px]"
                  placeholder="Ex:\nJean Dupont\nMarie Curie\nAlbert Einstein..."
                />

                <div className="flex items-center justify-end gap-4 mt-2">
                  {showSavedMsg && (
                    <span className="text-green-500 font-medium text-sm flex items-center gap-1 animate-in slide-in-from-right">
                      <CheckCircle2 size={16} /> Enregistré
                    </span>
                  )}
                  <button 
                    onClick={handleSaveStudents}
                    className="px-6 py-3 rounded-full font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:opacity-90 flex items-center gap-2 transition-all active:scale-95"
                  >
                    Enregistrer la liste
                  </button>
                </div>
              </div>
            ) : (
              /* SubTab : Feed (Cours & Documents) */
              <>
                <div className="flex justify-end gap-2">
                  <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-2 rounded-2xl border border-white/10 shadow-inner">
                    <Calendar size={18} className="text-primary ml-2" />
                    <input 
                      type="date" 
                      value={filterDate} 
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 text-sm text-white cursor-pointer outline-none"
                    />
                    {filterDate && (
                      <button onClick={() => setFilterDate("")} className="mr-2 text-white-variant hover:text-[var(--md-sys-color-error)] transition-colors">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {isAddingCourse ? (
                  <form onSubmit={handleAddCourse} className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-6 shadow-md animate-in slide-in-from-top-4 fade-in">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <FileText size={20} /> Déposer un nouveau document
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-3">
                        <input 
                          type="text" placeholder="Titre du cours..." required
                          value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                          className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-3 rounded-2xl border border-white/10 text-white focus:ring-2 focus:ring-primary outline-none"
                        />
                        <input 
                          type="date" required
                          value={newCourse.date} onChange={(e) => setNewCourse({...newCourse, date: e.target.value})}
                          className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-3 rounded-2xl border border-white/10 text-white focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      
                      <textarea 
                        placeholder="Contenu du cours ou résumé (optionnel si fichier joint)..." rows="3"
                        value={newCourse.content} onChange={(e) => setNewCourse({...newCourse, content: e.target.value})}
                        className="w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-3 rounded-2xl border border-white/10 text-white focus:ring-2 focus:ring-primary outline-none resize-none"
                      />

                      <div className="border-2 border-dashed border-white/10 rounded-2xl p-4 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-center relative overflow-hidden transition-colors hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:border-primary">
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        />
                        {!newCourse.file ? (
                          <div className="flex flex-col items-center justify-center pointer-events-none text-white-variant py-4">
                            <UploadCloud size={32} className="mb-2 opacity-70" />
                            <span className="font-medium text-sm">Cliquez ou glissez pour joindre un document</span>
                            <span className="text-xs opacity-70 mt-1">Images, PDF, Word, Excel, PowerPoint...</span>
                          </div>
                        ) : (
                          <div className="relative z-20 pointer-events-auto text-left">
                            <FilePreviewCard file={newCourse.file} onRemove={removeFile} compact={true} />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={() => setIsAddingCourse(false)} className="px-4 py-2 rounded-full font-medium text-white-variant hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl transition-colors">
                          Annuler
                        </button>
                        <button type="submit" disabled={!newCourse.title.trim()} className="px-6 py-2 rounded-full font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-all">
                          <CheckCircle2 size={18} /> Publier
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => setIsAddingCourse(true)}
                    className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-4 shadow-sm border border-white/10 text-white-variant hover:text-primary transition-all flex items-center justify-center gap-2 group font-medium relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-primary flex items-center justify-center group-hover:bg-gradient-to-r from-purple-500 to-pink-500 text-white group-hover:text-white transition-colors relative z-10">
                      <Plus size={20} />
                    </div>
                    <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-500">
                      Déposer un nouveau cours ou document
                    </span>
                  </button>
                )}

                <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 pb-10">
                  {filteredCourses.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-10 text-center flex flex-col items-center justify-center text-white-variant opacity-70 border border-dashed border-white/10 h-full">
                      <Search size={48} className="mb-4 opacity-50" />
                      <p className="text-lg font-medium">Aucun cours trouvé.</p>
                      <p className="text-sm mt-1">{filterDate ? "Essayez une autre date." : "Commencez par déposer un premier document pour cette classe."}</p>
                    </div>
                  ) : (
                    filteredCourses.map(course => (
                      <div key={course.id} className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-6 shadow-sm border border-white/10 group relative animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-2">
                            {course.file ? <Paperclip size={18} className="opacity-50 text-white" /> : <BookOpen size={18} className="opacity-50 text-white" />}
                            {course.title}
                          </h3>
                          <span className="text-xs font-medium px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-white rounded-full flex items-center gap-1 shadow-inner">
                            <Calendar size={12} /> {new Date(course.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </span>
                        </div>

                        {course.content && (
                          <div className="text-white bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap border border-white/10">
                            {course.content}
                          </div>
                        )}

                        {course.file && (
                           <FilePreviewCard file={course.file} />
                        )}

                        <button 
                          onClick={() => deleteCourse(course.id)}
                          className="absolute top-4 right-4 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl"
                          title="Supprimer ce cours"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-10 text-center flex flex-col items-center justify-center text-white-variant h-full shadow-sm">
            <Users size={64} className="mb-4 text-primary opacity-50" />
            <p className="text-xl font-bold text-white mb-2">Aucune classe sélectionnée</p>
            <p className="text-md opacity-80">Sélectionnez une classe à gauche ou créez-en une nouvelle pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  );
};


// --- COMPOSANT GÉNÉRATEUR DE QUIZ IA MULTIMODAL ---

const AiStudio = ({ classes, courses, customApiKey, selectedModel }) => {
  const runtimeApiKey = ""; // API Key provided by runtime
  const finalApiKey = customApiKey || runtimeApiKey;
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  
  const [sourceType, setSourceType] = useState("new"); 
  const [newText, setNewText] = useState("");
  
  // Nouveaux états pour le Studio IA
  const [selectedTool, setSelectedTool] = useState("quiz"); // 'quiz', 'flashcards', 'simplify'
  const [numItems, setNumItems] = useState(5);

  const generateWithRetry = async (prompt, inlineData = null, retries = 5, delay = 1000) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${finalApiKey}`;
    
    let parts = [{ text: prompt }];
    if (inlineData) {
      parts.push({ inlineData });
    }

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: parts }],
            systemInstruction: { 
              parts: [{ text: "Tu es un expert en pédagogie et didactique. Tu conçois du matériel d'apprentissage structuré, stimulant et adapté pour des élèves, à partir des documents et images fournis." }]
            }
          })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(res => setTimeout(res, delay * Math.pow(2, i))); 
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!finalApiKey) {
      setError("Clé API manquante. Veuillez l'ajouter dans les paramètres (API & IA).");
      return;
    }

    let sourceContent = "";
    let fileInlineData = null;
    setInfoMessage("");

    if (sourceType === "new") {
      sourceContent = newText;
      if (!sourceContent.trim()) { setError("Veuillez coller un texte."); return; }
    } else {
      const course = courses.find(c => c.id === sourceType);
      if (!course) { setError("Cours introuvable."); return; }
      
      sourceContent = `${course.title}\n\n${course.content}`;
      
      if (course.file) {
        if (course.file.type.startsWith('image/') || course.file.type === 'application/pdf') {
           try {
             const base64Data = course.file.dataUrl.split(',')[1];
             fileInlineData = {
               mimeType: course.file.type,
               data: base64Data
             };
             setInfoMessage(`Le fichier "${course.file.name}" a été inclus dans l'analyse de l'IA.`);
           } catch (err) {
             console.error("Erreur d'extraction base64", err);
           }
        } else {
           setInfoMessage(`Le format du fichier "${course.file.name}" ne peut pas être lu directement par l'IA. L'outil se basera uniquement sur le texte/résumé du cours.`);
        }
      }
    }
    
    setLoading(true);
    setError("");
    setResult("");

    let prompt = "";

    // Construction du prompt en fonction de l'outil sélectionné
    if (selectedTool === "quiz") {
      prompt = `Génère un quiz à choix multiples (QCM) de ${numItems} questions à partir du document/cours et/ou de l'image fourni en pièce jointe.
      
      Résumé texte de référence :
      """
      ${sourceContent}
      """
      
      Consignes : 
      - Si une image ou un PDF est joint, base-toi en priorité sur son contenu visuel.
      - Format de sortie STRICTEMENT en Markdown.
      
      Format attendu :
      ### 📝 Quiz de révision

      **Question 1 : [Texte de la question]**
      - A) [Option 1]
      - B) [Option 2]
      - C) [Option 3]
      - D) [Option 4]

      (Continuer pour toutes les questions)

      ---
      ### ✅ Corrections et Explications
      **1. Réponse [A/B/C/D]** : [Courte explication du pourquoi]
      `;
    } else if (selectedTool === "flashcards") {
      prompt = `Génère ${numItems} cartes mémoire (flashcards) pour aider les élèves à réviser les concepts clés du document et/ou de l'image fourni en pièce jointe.
      
      Résumé texte de référence :
      """
      ${sourceContent}
      """
      
      Consignes : 
      - Sélectionne les termes de vocabulaire, dates, ou concepts les plus importants.
      - Format de sortie STRICTEMENT en Markdown.
      
      Format attendu :
      ### 📇 Cartes Mémoire (Flashcards)

      **1. [Terme ou Concept]** 💡 *Définition* : [Définition claire et concise en 1 ou 2 phrases maximum]

      **2. [Terme ou Concept]** 💡 *Définition* : [Définition]
      
      (Continuer pour toutes les cartes)`;
    } else if (selectedTool === "simplify") {
      prompt = `Analyse le document et/ou l'image fourni en pièce jointe pour en faire une synthèse et une vulgarisation poussée.
      
      Résumé texte de référence :
      """
      ${sourceContent}
      """
      
      Consignes : 
      - Fais un résumé concis en quelques points clés.
      - Ensuite, réécris le concept général comme si tu devais l'expliquer à un enfant de 10 ans, en utilisant une métaphore ou une analogie pour rendre l'idée abstraite très visuelle et facile à comprendre.
      - Format de sortie STRICTEMENT en Markdown.
      
      Format attendu :
      ### 📊 Résumé Express
      - [Point clé 1]
      - [Point clé 2]
      - [Point clé 3]

      ---
      ### 👶 Explication simplifiée (Niveau 10 ans)
      [Insérer la métaphore et l'explication très accessible ici.]`;
    }

    try {
      const text = await generateWithRetry(prompt, fileInlineData);
      setResult(text || "Aucune réponse générée.");
    } catch (err) {
      setError("Erreur lors de la génération. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    let html = [];
    lines.forEach((line, idx) => {
      if (line.startsWith('### ')) { html.push(<h3 key={idx} className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">{line.substring(4).replace(/\*\*/g, '')}</h3>); }
      else if (line.startsWith('## ')) { html.push(<h2 key={idx}>{line.substring(3).replace(/\*\*/g, '')}</h2>); }
      else if (line.startsWith('# ')) { html.push(<h1 key={idx}>{line.substring(2).replace(/\*\*/g, '')}</h1>); }
      else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        html.push(<li key={idx} dangerouslySetInnerHTML={{__html: parseInline(line.substring(2))}} className="ml-4 mb-2" />);
      }
      else if (line.startsWith('---')) { html.push(<hr key={idx} className="my-6 border-white/10" />); }
      else if (line.startsWith('**') && line.endsWith('**')) {
        html.push(<p key={idx} className="font-bold mt-4 text-white">{line.replace(/\*\*/g, '')}</p>);
      }
      else if (line.trim() !== "") {
        html.push(<p key={idx} dangerouslySetInnerHTML={{__html: parseInline(line)}} className="mb-2 text-white" />);
      }
    });
    return <div className="prose max-w-none">{html}</div>;
  };

  const parseInline = (text) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
      <div className="col-span-1 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-6 shadow-sm flex flex-col h-fit">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-primary" size={24} />
          <h2 className="font-bold text-xl text-white">Studio IA ✨</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
          
          {/* SÉLECTION DE L'OUTIL IA */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white-variant flex items-center gap-2">
              <Layers size={16} /> Outil Pédagogique
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button 
                type="button" onClick={() => setSelectedTool("quiz")}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${selectedTool === "quiz" ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-white/10 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-white-variant hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl/80"}`}
              >
                <div className={`p-2 rounded-full ${selectedTool === "quiz" ? "bg-primary text-white" : "bg-white/5 backdrop-blur-md border border-white/10 shadow-xl"}`}>
                  <ListChecks size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm">Générateur de Quiz</div>
                  <div className="text-xs opacity-70">QCM avec corrections</div>
                </div>
              </button>

              <button 
                type="button" onClick={() => setSelectedTool("flashcards")}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${selectedTool === "flashcards" ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-white/10 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-white-variant hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl/80"}`}
              >
                <div className={`p-2 rounded-full ${selectedTool === "flashcards" ? "bg-primary text-white" : "bg-white/5 backdrop-blur-md border border-white/10 shadow-xl"}`}>
                  <BookOpen size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm">Cartes Mémoire</div>
                  <div className="text-xs opacity-70">Concepts clés & flashcards</div>
                </div>
              </button>

              <button 
                type="button" onClick={() => setSelectedTool("simplify")}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${selectedTool === "simplify" ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-white/10 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-white-variant hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl/80"}`}
              >
                <div className={`p-2 rounded-full ${selectedTool === "simplify" ? "bg-primary text-white" : "bg-white/5 backdrop-blur-md border border-white/10 shadow-xl"}`}>
                  <Lightbulb size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm">Synthèse & Simplification</div>
                  <div className="text-xs opacity-70">Résumé et niveau "10 ans"</div>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <label className="text-sm font-medium text-white-variant flex items-center gap-2">
              <FileText size={16} /> Source du document
            </label>
            <div className="relative">
              <select 
                value={sourceType} onChange={(e) => setSourceType(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-3 pr-10 rounded-2xl border border-white/10 focus:ring-2 focus:ring-primary text-white appearance-none outline-none shadow-inner"
              >
                <option value="new">-- Coller un nouveau texte --</option>
                {classes.map(c => {
                  const classCourses = courses.filter(course => course.classId === c.id);
                  if (classCourses.length === 0) return null;
                  return (
                    <optgroup key={c.id} label={`Classe : ${c.name}`}>
                      {classCourses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.title} {course.file ? `(avec ${course.file.type.startsWith('image') ? 'Image' : 'Fichier'})` : ''}
                        </option>
                      ))}
                    </optgroup>
                  )
                })}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white-variant pointer-events-none" />
            </div>
          </div>

          {sourceType === "new" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <textarea 
                value={newText} onChange={(e) => setNewText(e.target.value)} rows="4"
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-3 rounded-2xl border border-white/10 focus:ring-2 focus:ring-primary text-white resize-none shadow-inner outline-none"
                placeholder="Collez ici le cours ou le texte sur lequel l'IA doit se baser..."
              />
            </div>
          )}

          {(selectedTool === "quiz" || selectedTool === "flashcards") && (
            <div className="space-y-2 mb-2 animate-in fade-in">
              <label className="text-sm font-medium text-white-variant flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ListChecks size={16} /> Quantité générée
                </span>
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">{numItems} {selectedTool === "quiz" ? "questions" : "cartes"}</span>
              </label>
              <input 
                type="range" min="3" max="15" step="1"
                value={numItems} onChange={(e) => setNumItems(e.target.value)}
                className="w-full accent-primary"
              />
            </div>
          )}

          <button 
            type="submit" disabled={loading || (sourceType === 'new' && !newText.trim())}
            className="mt-auto w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-95"
          >
            {loading ? (
              <span className="animate-pulse flex items-center gap-2 text-white">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                IA au travail...
              </span>
            ) : (
              <> <Sparkles size={20} className="text-white" /> <span className="text-white">Générer avec l'IA</span> </>
            )}
          </button>
        </form>
      </div>

      <div className="col-span-1 lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-3xl p-8 border border-white/10 shadow-inner overflow-y-auto relative h-[600px] lg:h-auto">
        {!result && !loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white-variant opacity-50 p-6 text-center">
            <Sparkles size={64} className="mb-4 opacity-50 text-primary" />
            <p className="text-lg font-medium">Sélectionnez un outil, une source et lancez la génération.</p>
            <p className="text-sm mt-2">Le matériel pédagogique généré s'affichera ici.</p>
          </div>
        )}

        {infoMessage && !loading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-2xl mb-4 border border-blue-200 dark:border-blue-800 flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{infoMessage}</p>
          </div>
        )}

        {error && (
          <div className="bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)] p-4 rounded-2xl mb-4 border border-red-200 dark:border-red-800 text-sm font-medium">
            {error}
          </div>
        )}

        {result && !loading && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
            {renderMarkdown(result)}
          </div>
        )}
      </div>
    </div>
  );
};


// --- COMPOSANT PRINCIPAL (LAYOUT) ---

export default function App() {
  const [activeTab, setActiveTab] = useState('classes'); 
  
  // Theme & API State
  const [themeMode, setThemeMode] = useState('auto'); // 'auto', 'light', 'dark'
  const [themeColors, setThemeColors] = useState(['#6366f1', '#a855f7', '#ec4899']); 
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('eduDash_apiKey') || "");
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('eduDash_model') || "gemini-2.5-flash-preview-09-2025");

  // Nouveaux états pour la liste dynamique des modèles
  const [availableModels, setAvailableModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('eduDash_apiKey', customApiKey);
  }, [customApiKey]);

  useEffect(() => {
    localStorage.setItem('eduDash_model', selectedModel);
  }, [selectedModel]);

  // Récupération dynamique des modèles via l'API
  useEffect(() => {
    const fetchModels = async () => {
      const runtimeApiKey = ""; // Clé injectée par l'environnement
      const finalApiKey = customApiKey || runtimeApiKey;
      
      if (!finalApiKey) {
        setAvailableModels([]);
        return;
      }

      setModelsLoading(true);
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${finalApiKey}`);
        if (!res.ok) throw new Error("Erreur lors de la récupération des modèles");
        const data = await res.json();
        
        // Filtrer uniquement les modèles Gemini supportant la génération de contenu
        const models = data.models
          .filter(m => m.name.includes("gemini") && m.supportedGenerationMethods?.includes("generateContent"))
          .map(m => ({
            id: m.name.replace('models/', ''), // Nettoyer l'ID pour l'URL
            displayName: m.displayName,
            version: m.version
          }));
          
        setAvailableModels(models);

        // Si la liste charge et que le modèle actuellement sélectionné n'est plus valide, on prend le premier
        if (models.length > 0 && !models.some(m => m.id === selectedModel)) {
           // Optionnel: on peut forcer la mise à jour, ou simplement laisser l'utilisateur choisir.
        }

      } catch (err) {
        console.error("Erreur lors du chargement des modèles :", err);
        setAvailableModels([]); // Repli sur la liste hardcodée en cas d'erreur réseau/clé invalide
      } finally {
        setModelsLoading(false);
      }
    };
    
    fetchModels();
  }, [customApiKey]);

  const [classes, setClasses] = useState([
    { id: 'c1', name: '4ème A', students: "Jade\nRaphaël\nLouis\nInès\nLucas\nChloé\nHugo\nAntoine\nNathan\nCamille\nManon\nEmma\nSarah\nLéa\nThéo" },
    { id: 'c2', name: '3ème B', students: "Alice\nBob\nCharlie\nDiana\nÉric\nFatima\nGabriel" }
  ]);

  const updateClassStudents = (classId, studentsText) => {
    setClasses(classes.map(c => c.id === classId ? { ...c, students: studentsText } : c));
  };

  const [courses, setCourses] = useState([
    { 
      id: 'doc1', classId: 'c1', 
      title: 'Introduction à la Révolution Industrielle', 
      content: "La révolution industrielle désigne le processus historique du XIXe siècle qui fait basculer une société à dominante agraire et artisanale vers une société commerciale et industrielle. Elle commence en Grande-Bretagne avec l'invention de la machine à vapeur par James Watt.", 
      date: new Date().toISOString().split('T')[0],
      file: null
    }
  ]);

  // Apply Theme (Gradient & Mode)
  useEffect(() => {
    const root = document.documentElement;
    // Calculate base hue for structural Material You colors
    const baseHue = themeColors.length > 0 ? hexToHue(themeColors[0]) : 250;
    root.style.setProperty('--hue', baseHue);
    
    // Create custom gradient string
    const gradientString = `linear-gradient(135deg, ${themeColors.join(', ')})`;
    root.style.setProperty('--theme-gradient', gradientString);
    
  }, [themeColors]);

  // Derive final dark mode flag
  const isDark = themeMode === 'dark' || (themeMode === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <>
      <style>{materialThemeStyles}</style>
      
      <div className={`theme-wrapper dark min-h-screen bg-gradient-to-br from-neutral-900 to-black font-sans flex transition-colors duration-300 text-white`}>
        
        {/* Sidebar */}
        <aside className="w-20 md:w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col p-4 z-20 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-center md:justify-start gap-3 p-2 mb-8 mt-4">
            <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
              <GraduationCap size={24} className="text-white" />
            </div>
            <h1 className="font-bold text-xl hidden md:block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 tracking-tight">EduDash</h1>
          </div>

          <nav className="flex-1 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('classes')}
              className={`flex items-center justify-center md:justify-start gap-4 p-4 rounded-full transition-all duration-200 ${
                activeTab === 'classes' ? 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-white font-bold shadow-sm' : 'text-white-variant hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:text-white'
              }`}
              title="Mes Classes"
            >
              <Users size={24} className={activeTab === 'classes' ? "text-primary" : ""} />
              <span className="hidden md:block">Mes Classes</span>
            </button>

            <button 
              onClick={() => setActiveTab('tools')}
              className={`flex items-center justify-center md:justify-start gap-4 p-4 rounded-full transition-all duration-200 ${
                activeTab === 'tools' ? 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-white font-bold shadow-sm' : 'text-white-variant hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:text-white'
              }`}
              title="Outils"
            >
              <Home size={24} className={activeTab === 'tools' ? "text-primary" : ""} />
              <span className="hidden md:block">Outils</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex items-center justify-center md:justify-start gap-4 p-4 rounded-full transition-all duration-200 ${
                activeTab === 'ai' ? 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl text-white font-bold shadow-sm' : 'text-white-variant hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:text-white'
              }`}
              title="Studio IA"
            >
              <Sparkles size={24} className={activeTab === 'ai' ? "text-primary" : ""} />
              <span className="hidden md:block">Studio IA ✨</span>
            </button>
          </nav>

          <div className="mt-auto">
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-full w-full text-white-variant hover:bg-white/5 backdrop-blur-md border border-white/10 shadow-xl transition-colors"
            >
              <Settings size={24} />
              <span className="hidden md:block font-medium">Personnaliser</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <header className="mb-8 flex items-center justify-between bg-black/30 backdrop-blur-xl border-b border-white/10 p-4 md:p-8 sticky top-0 z-30 shadow-sm">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {activeTab === 'tools' && 'Tableau de bord'}
                {activeTab === 'classes' && 'Gestion des Classes'}
                {activeTab === 'ai' && 'Studio Pédagogique IA'}
              </h2>
              <p className="text-white-variant mt-1 text-sm md:text-base">
                {activeTab === 'tools' && 'Gérez votre temps et animez votre classe facilement.'}
                {activeTab === 'classes' && 'Déposez vos cours, images et gérez vos listes d\'élèves.'}
                {activeTab === 'ai' && 'Générez des évaluations, des flashcards et simplifiez vos cours grâce à l\'IA.'}
              </p>
            </div>
          </header>

          <div className="max-w-7xl mx-auto h-[calc(100%-100px)] px-4 md:px-8">
            {activeTab === 'tools' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                <InstructionsWidget />
                <div className="h-[350px]"><TimerWidget /></div>
                <div className="h-[350px]"><NoiseMeterWidget /></div>
                <div className="h-[400px]"><RandomPickerWidget classes={classes} /></div>
                <div className="h-[400px]"><GroupMakerWidget classes={classes} /></div>
              </div>
            )}

            {activeTab === 'classes' && (
              <ClassesFeed 
                classes={classes} setClasses={setClasses} 
                courses={courses} setCourses={setCourses} 
                updateClassStudents={updateClassStudents}
              />
            )}

            {activeTab === 'ai' && (
              <AiStudio classes={classes} courses={courses} customApiKey={customApiKey} selectedModel={selectedModel} />
            )}
          </div>
        </main>
      </div>

      {/* Zen Theme Modal Overlay */}
      <ZenThemeModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        themeColors={themeColors}
        setThemeColors={setThemeColors}
        customApiKey={customApiKey}
        setCustomApiKey={setCustomApiKey}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        availableModels={availableModels}
        modelsLoading={modelsLoading}
      />
    </>
  );
}