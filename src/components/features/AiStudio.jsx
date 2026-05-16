import React, { useState } from 'react';
import { Sparkles, Layers, ListChecks, BookOpen, Lightbulb, FileText, ChevronDown, AlertCircle } from 'lucide-react';

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
      if (line.startsWith('### ')) { html.push(<h3 key={idx} className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 font-bold mt-4 mb-2">{line.substring(4).replace(/\*\*/g, '')}</h3>); }
      else if (line.startsWith('## ')) { html.push(<h2 key={idx} className="font-bold mt-4 mb-2 text-slate-900 dark:text-white">{line.substring(3).replace(/\*\*/g, '')}</h2>); }
      else if (line.startsWith('# ')) { html.push(<h1 key={idx} className="font-bold mt-4 mb-2 text-xl text-slate-900 dark:text-white">{line.substring(2).replace(/\*\*/g, '')}</h1>); }
      else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        html.push(<li key={idx} dangerouslySetInnerHTML={{__html: parseInline(line.substring(2))}} className="ml-4 mb-2 text-slate-900 dark:text-white" />);
      }
      else if (line.startsWith('---')) { html.push(<hr key={idx} className="my-6 border-slate-200 dark:border-white/10" />); }
      else if (line.startsWith('**') && line.endsWith('**')) {
        html.push(<p key={idx} className="font-bold mt-4 text-slate-900 dark:text-white">{line.replace(/\*\*/g, '')}</p>);
      }
      else if (line.trim() !== "") {
        html.push(<p key={idx} dangerouslySetInnerHTML={{__html: parseInline(line)}} className="mb-2 text-slate-900 dark:text-white" />);
      }
    });
    return <div className="prose max-w-none">{html}</div>;
  };

  const parseInline = (text) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
      <div className="col-span-1 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 flex flex-col h-fit">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-slate-900 dark:text-white" size={24} />
          <h2 className="font-bold text-xl text-slate-900 dark:text-white">Studio IA ✨</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
          
          {/* SÉLECTION DE L'OUTIL IA */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-500 dark:text-white/60 flex items-center gap-2">
              <Layers size={16} /> Outil Pédagogique
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button 
                type="button" onClick={() => setSelectedTool("quiz")}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${selectedTool === "quiz" ? "border-slate-400 dark:border-white/40 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" : "border-slate-200 dark:border-white/10 bg-white/90 dark:bg-white/5 text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10"}`}
              >
                <div className={`p-2 rounded-full ${selectedTool === "quiz" ? "bg-slate-300 dark:bg-white/20 text-slate-900 dark:text-white" : "bg-slate-100 dark:bg-white/5"}`}>
                  <ListChecks size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm">Générateur de Quiz</div>
                  <div className="text-xs opacity-70">QCM avec corrections</div>
                </div>
              </button>

              <button 
                type="button" onClick={() => setSelectedTool("flashcards")}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${selectedTool === "flashcards" ? "border-slate-400 dark:border-white/40 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" : "border-slate-200 dark:border-white/10 bg-white/90 dark:bg-white/5 text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10"}`}
              >
                <div className={`p-2 rounded-full ${selectedTool === "flashcards" ? "bg-slate-300 dark:bg-white/20 text-slate-900 dark:text-white" : "bg-slate-100 dark:bg-white/5"}`}>
                  <BookOpen size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm">Cartes Mémoire</div>
                  <div className="text-xs opacity-70">Concepts clés & flashcards</div>
                </div>
              </button>

              <button 
                type="button" onClick={() => setSelectedTool("simplify")}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${selectedTool === "simplify" ? "border-slate-400 dark:border-white/40 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" : "border-slate-200 dark:border-white/10 bg-white/90 dark:bg-white/5 text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10"}`}
              >
                <div className={`p-2 rounded-full ${selectedTool === "simplify" ? "bg-slate-300 dark:bg-white/20 text-slate-900 dark:text-white" : "bg-slate-100 dark:bg-white/5"}`}>
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
            <label className="text-sm font-medium text-slate-500 dark:text-white/60 flex items-center gap-2">
              <FileText size={16} /> Source du document
            </label>
            <div className="relative">
              <select 
                value={sourceType} onChange={(e) => setSourceType(e.target.value)}
                className="w-full bg-white/90 dark:bg-white/5 p-3 pr-10 rounded-2xl border border-slate-300 dark:border-white/10 focus:ring-2 focus:ring-slate-400 dark:focus:ring-white text-slate-900 dark:text-white appearance-none outline-none"
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
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-white/60 pointer-events-none" />
            </div>
          </div>

          {sourceType === "new" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <textarea 
                value={newText} onChange={(e) => setNewText(e.target.value)} rows="4"
                className="w-full bg-white/90 dark:bg-white/5 p-3 rounded-2xl border border-slate-300 dark:border-white/10 focus:ring-2 focus:ring-slate-400 dark:focus:ring-white text-slate-900 dark:text-white resize-none outline-none"
                placeholder="Collez ici le cours ou le texte sur lequel l'IA doit se baser..."
              />
            </div>
          )}

          {(selectedTool === "quiz" || selectedTool === "flashcards") && (
            <div className="space-y-2 mb-2 animate-in fade-in">
              <label className="text-sm font-medium text-slate-500 dark:text-white/60 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ListChecks size={16} /> Quantité générée
                </span>
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">{numItems} {selectedTool === "quiz" ? "questions" : "cartes"}</span>
              </label>
              <input 
                type="range" min="3" max="15" step="1"
                value={numItems} onChange={(e) => setNumItems(e.target.value)}
                className="w-full accent-slate-900 dark:accent-white"
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

      <div className="col-span-1 lg:col-span-2 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-8 overflow-y-auto relative h-[600px] lg:h-auto">
        {!result && !loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 dark:text-white/60 p-6 text-center">
            <Sparkles size={64} className="mb-4 opacity-50 text-slate-900 dark:text-white" />
            <p className="text-lg font-medium">Sélectionnez un outil, une source et lancez la génération.</p>
            <p className="text-sm mt-2">Le matériel pédagogique généré s'affichera ici.</p>
          </div>
        )}

        {infoMessage && !loading && (
          <div className="bg-blue-50 dark:bg-blue-50/10 text-blue-700 dark:text-blue-300 p-4 rounded-2xl mb-4 border border-blue-200 dark:border-blue-500/30 flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{infoMessage}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 p-4 rounded-2xl mb-4 border border-red-200 dark:border-red-500/30 text-sm font-medium">
            {error}
          </div>
        )}

        {result && !loading && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {renderMarkdown(result)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiStudio;