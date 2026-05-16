import React, { useState } from 'react';
import { Users } from 'lucide-react';

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
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 flex flex-col h-full max-h-[400px]">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-slate-900 dark:text-white" size={24} />
        <h3 className="font-semibold text-lg flex-1">Générateur de Groupes</h3>
      </div>
      
      {isGenerated ? (
        <div className="flex-1 flex flex-col overflow-hidden">
           <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 gap-2 mb-4">
              {groups.map((g, i) => (
                <div key={i} className="bg-white/90 dark:bg-white/5 p-3 rounded-xl border border-slate-300 dark:border-white/10 text-sm">
                  <div className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-1 border-b border-slate-300 dark:border-white/10 pb-1">Groupe {i+1}</div>
                  <ul className="text-slate-900 dark:text-white">
                    {g.map((name, j) => <li key={j}>• {name}</li>)}
                  </ul>
                </div>
              ))}
           </div>
           <button onClick={() => setIsGenerated(false)} className="w-full py-3 bg-white/90 dark:bg-white/5 rounded-full text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-medium border border-slate-300 dark:border-white/10">
             Modifier / Recommencer
           </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <select 
              value={selectedSource} 
              onChange={handleSourceChange}
              className="w-full bg-white/90 dark:bg-white/5 p-2 rounded-xl text-sm border border-slate-300 dark:border-white/10 focus:ring-2 focus:ring-slate-400 dark:focus:ring-white text-slate-900 dark:text-white outline-none"
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
              className="flex-1 w-full bg-white/90 dark:bg-white/5 rounded-2xl p-4 resize-none border border-slate-300 dark:border-white/10 focus:ring-2 focus:ring-slate-400 dark:focus:ring-white text-sm text-slate-900 dark:text-white outline-none"
              placeholder="Liste des élèves (un par ligne)..."
            />
            <div className="flex items-center gap-2 bg-white/90 dark:bg-white/5 p-2 rounded-2xl border border-slate-300 dark:border-white/10">
              <label className="text-sm text-slate-500 dark:text-white/60 ml-2 flex-1">Nb. de groupes :</label>
              <input 
                type="number" min="2" max="15" 
                value={numGroups} onChange={(e) => setNumGroups(parseInt(e.target.value)||2)}
                className="w-16 text-center bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-bold outline-none"
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

export default GroupMakerWidget;