import React, { useState, useEffect } from 'react';

import Sidebar from './components/layout/Sidebar';
import ZenThemeModal from './components/layout/ZenThemeModal';
import InstructionsWidget from './components/widgets/InstructionsWidget';
import GroupMakerWidget from './components/widgets/GroupMakerWidget';
import TimerWidget from './components/widgets/TimerWidget';
import RandomPickerWidget from './components/widgets/RandomPickerWidget';
import NoiseMeterWidget from './components/widgets/NoiseMeterWidget';
import ClassesFeed from './components/features/ClassesFeed';
import AiStudio from './components/features/AiStudio';

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

  /* Nouvelles classes de Dégradé (Gradient) */
  .bg-gradient-to-r.from-purple-500.to-pink-500.text-white { 
    background: var(--theme-gradient); 
    color: #ffffff; 
  }
  .bg-clip-text.text-transparent.bg-gradient-to-r.from-purple-400.to-pink-400 { 
    background: var(--theme-gradient); 
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent; 
    background-clip: text; 
    color: transparent;
  }

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

// --- COMPOSANT PRINCIPAL (LAYOUT) ---

export default function App() {
  const [activeTab, setActiveTab] = useState('classes'); 
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
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

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('eduDash_classes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erreur parsing eduDash_classes", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('eduDash_classes', JSON.stringify(classes));
  }, [classes]);

  const updateClassStudents = (classId, studentsText) => {
    setClasses(classes.map(c => c.id === classId ? { ...c, students: studentsText } : c));
  };

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('eduDash_courses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erreur parsing eduDash_courses", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('eduDash_courses', JSON.stringify(courses));
  }, [courses]);
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
      
      <div className={`theme-wrapper ${isDark ? 'dark' : ''} h-screen overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-neutral-900 dark:to-black font-sans flex transition-colors duration-300 text-slate-900 dark:text-white`}>
        
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setShowSettingsModal={setShowSettingsModal} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto">
          <header className="mb-8 flex items-center justify-between bg-white/60 dark:bg-black/30 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm p-4 md:p-8 sticky top-0 z-30">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {activeTab === 'tools' && 'Tableau de bord'}
                {activeTab === 'classes' && 'Gestion des Classes'}
                {activeTab === 'ai' && 'Studio Pédagogique IA'}
              </h2>
              <p className="text-slate-500 dark:text-white/60 mt-1 text-sm md:text-base">
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
