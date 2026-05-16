import React, { useState } from 'react';
import { Users, Shuffle } from 'lucide-react';

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
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-slate-900 dark:text-white" size={24} />
        <h3 className="font-semibold text-lg flex-1">Tirage au sort</h3>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        {selected ? (
          <div className="flex-1 bg-white/90 dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
            <span className="text-sm text-slate-500 dark:text-white/60 mb-2">
              {isPicking ? "Sélection en cours..." : "L'élève choisi est :"}
            </span>
            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">{selected}</span>
            {!isPicking && (
              <button 
                onClick={() => setSelected(null)}
                className="mt-6 text-sm px-4 py-2 bg-white/90 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
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
                setSelectedSource("manual");
              }}
              className="flex-1 w-full bg-white/90 dark:bg-white/5 rounded-2xl p-4 resize-none border border-slate-300 dark:border-white/10 focus:ring-2 focus:ring-slate-400 dark:focus:ring-white text-sm text-slate-900 dark:text-white outline-none"
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

export default RandomPickerWidget;