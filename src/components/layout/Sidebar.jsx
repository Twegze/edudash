import React from 'react';
import { GraduationCap, Users, Home, Sparkles, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, setShowSettingsModal, isSidebarCollapsed, setIsSidebarCollapsed }) => {
  return (
    <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white/60 dark:bg-black/30 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 shadow-xl flex flex-col p-4 z-20 transition-all duration-300`}>
      <div className={`flex items-center ${isSidebarCollapsed ? 'flex-col gap-4' : 'justify-between'} p-2 mb-8 mt-2`}>
        {isSidebarCollapsed ? (
          <>
            <button 
              onClick={() => setIsSidebarCollapsed(false)} 
              className="p-2 rounded-md text-slate-500 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              title="Développer le menu"
            >
              <PanelLeftOpen size={20} />
            </button>
            <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
              <GraduationCap size={24} className="text-white" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
                <GraduationCap size={24} className="text-white" />
              </div>
              <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 tracking-tight">EduDash</h1>
            </div>
            <button 
              onClick={() => setIsSidebarCollapsed(true)} 
              className="p-1 rounded-md text-slate-500 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              title="Réduire le menu"
            >
              <PanelLeftClose size={20} />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        <button 
          onClick={() => setActiveTab('classes')}
          className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} gap-4 p-4 rounded-full transition-all duration-200 ${
            activeTab === 'classes' ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Mes Classes"
        >
          <Users size={24} className={activeTab === 'classes' ? "text-slate-900 dark:text-white min-w-[24px]" : "min-w-[24px]"} />
          {!isSidebarCollapsed && <span>Mes Classes</span>}
        </button>

        <button 
          onClick={() => setActiveTab('tools')}
          className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} gap-4 p-4 rounded-full transition-all duration-200 ${
            activeTab === 'tools' ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Outils"
        >
          <Home size={24} className={activeTab === 'tools' ? "text-slate-900 dark:text-white min-w-[24px]" : "min-w-[24px]"} />
          {!isSidebarCollapsed && <span>Outils</span>}
        </button>
        
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} gap-4 p-4 rounded-full transition-all duration-200 ${
            activeTab === 'ai' ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Studio IA"
        >
          <Sparkles size={24} className={activeTab === 'ai' ? "text-slate-900 dark:text-white min-w-[24px]" : "min-w-[24px]"} />
          {!isSidebarCollapsed && <span>Studio IA ✨</span>}
        </button>
      </nav>

      <div className="mt-auto">
        <button 
          onClick={() => setShowSettingsModal(true)}
          className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} gap-4 p-4 rounded-full w-full text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors`}
          title="Personnaliser"
        >
          <Settings size={24} className="min-w-[24px]" />
          {!isSidebarCollapsed && <span className="font-medium">Personnaliser</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
