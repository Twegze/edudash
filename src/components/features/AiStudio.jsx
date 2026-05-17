import React, { useState } from 'react';
import { Sparkles, Layers, ListChecks, BookOpen, Lightbulb, FileText, ChevronDown, AlertCircle } from 'lucide-react';

const VirtualQuiz = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!data || !Array.isArray(data) || data.length === 0) return <div className="text-red-500">Format de données invalide</div>;

  const currentQ = data[currentIndex];

  const handleSelect = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQ.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 animate-in fade-in zoom-in-95">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Score Final</h2>
        <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          {score} / {data.length}
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
          {score === data.length ? "Parfait ! Excellent travail ! 🏆" : "Bien joué ! Continuez de vous entraîner. 💪"}
        </p>
        <button onClick={handleReset} className="mt-4 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:opacity-90 shadow-lg hover:shadow-xl transition-all active:scale-95">
          Recommencer le quiz
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6 max-w-2xl mx-auto w-full animate-in fade-in">
      <div className="flex justify-between items-center text-sm font-medium text-slate-500 dark:text-slate-400">
        <span>Question {currentIndex + 1} sur {data.length}</span>
        <span className="bg-slate-200 dark:bg-white/10 px-3 py-1 rounded-full text-slate-700 dark:text-slate-200">Score: {score}</span>
      </div>
      
      <div className="bg-white/90 dark:bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
          {currentQ.question}
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white";
            
            if (selectedOption !== null) {
              if (idx === currentQ.correctIndex) {
                btnClass = "bg-green-100 dark:bg-green-500/20 border-green-400 dark:border-green-400/50 text-green-900 dark:text-green-100 shadow-md ring-2 ring-green-400";
              } else if (idx === selectedOption) {
                btnClass = "bg-red-100 dark:bg-red-500/20 border-red-400 dark:border-red-400/50 text-red-900 dark:text-red-100 shadow-md ring-2 ring-red-400";
              } else {
                btnClass = "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleSelect(idx)}
                className={`p-4 rounded-2xl border-2 text-left font-medium transition-all duration-300 ${btnClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {selectedOption !== null && (
        <div className="animate-in slide-in-from-bottom-4 flex flex-col gap-4">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-5 rounded-2xl border border-blue-200 dark:border-blue-500/30">
            <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
              <Lightbulb size={18} /> Explication :
            </h4>
            <p className="text-blue-800 dark:text-blue-100 text-sm leading-relaxed">{currentQ.explanation}</p>
          </div>
          <button 
            onClick={handleNext}
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold hover:opacity-90 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            {currentIndex < data.length - 1 ? "Question suivante" : "Voir le score final"}
          </button>
        </div>
      )}
    </div>
  );
};

const Flashcard = ({ front, back }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div 
      className="w-full h-56 cursor-pointer relative"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div 
        className="w-full h-full transition-transform duration-500 relative"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg flex flex-col items-center justify-center p-6 text-center hover:shadow-xl transition-shadow"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-500 flex items-center justify-center mb-4">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{front}</h3>
          <span className="absolute bottom-4 text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide uppercase">Cliquez pour retourner</span>
        </div>
        {/* Back */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 backdrop-blur-md rounded-3xl border border-purple-200 dark:border-purple-500/30 shadow-lg flex items-center justify-center p-6 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-base font-medium text-slate-900 dark:text-white leading-relaxed">{back}</p>
        </div>
      </div>
    </div>
  );
};

const FlashcardGrid = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return <div className="text-red-500">Format de données invalide</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 content-start animate-in fade-in">
      {data.map((card, idx) => (
        <Flashcard key={idx} front={card.front} back={card.back} />
      ))}
    </div>
  );
};

const SummaryInteractive = ({ data }) => {
  if (!data || !data.summary || !data.analogy) return <div className="text-red-500">Format de données invalide</div>;
  
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white/90 dark:bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-xl">
            <ListChecks size={24} className="text-purple-500" />
          </div>
          Résumé Express
        </h3>
        <ul className="space-y-4">
          {data.summary.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
              <span className="w-2.5 h-2.5 mt-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shrink-0 shadow-sm" />
              <span className="leading-relaxed font-medium">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-purple-200 dark:border-purple-500/20 shadow-xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 p-6 opacity-5 dark:opacity-10 pointer-events-none transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
           <Lightbulb size={200} />
        </div>
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-purple-500" /> L'analogie (Niveau 10 ans)
        </h3>
        <p className="text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-medium relative z-10 italic">
          "{data.analogy}"
        </p>
      </div>
    </div>
  );
};

const AiStudio = ({ classes, courses, customApiKey, selectedModel }) => {
  const runtimeApiKey = ""; 
  const finalApiKey = customApiKey || runtimeApiKey;
  
  const [loading, setLoading] = useState(false);
  const [interactiveData, setInteractiveData] = useState(null);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  
  const [sourceType, setSourceType] = useState("new"); 
  const [newText, setNewText] = useState("");
  
  const [selectedTool, setSelectedTool] = useState("quiz"); 
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
              parts: [{ text: "Tu es un expert en pédagogie et didactique. Tu conçois du matériel d'apprentissage structuré, stimulant et adapté pour des élèves, à partir des documents et images fournis. Réponds TOUJOURS avec du JSON pur, sans markdown, sans blabla." }]
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
    setInteractiveData(null);

    let prompt = "";

    if (selectedTool === "quiz") {
      prompt = `Génère un quiz à choix multiples (QCM) de ${numItems} questions à partir du document/cours et/ou de l'image fourni en pièce jointe.
      
      Résumé texte de référence :
      """
      ${sourceContent}
      """
      
      Consignes : 
      - Si une image ou un PDF est joint, base-toi en priorité sur son contenu visuel.
      - Format de sortie STRICTEMENT en JSON brut, SANS aucune balise Markdown (pas de \`\`\`json) ni texte supplémentaire.
      
      Format attendu :
      [
        {
          "question": "Texte de la question",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctIndex": 0,
          "explanation": "Courte explication du pourquoi"
        }
      ]
      `;
    } else if (selectedTool === "flashcards") {
      prompt = `Génère ${numItems} cartes mémoire (flashcards) pour aider les élèves à réviser les concepts clés du document et/ou de l'image fourni en pièce jointe.
      
      Résumé texte de référence :
      """
      ${sourceContent}
      """
      
      Consignes : 
      - Sélectionne les termes de vocabulaire, dates, ou concepts les plus importants.
      - Format de sortie STRICTEMENT en JSON brut, SANS aucune balise Markdown (pas de \`\`\`json) ni texte supplémentaire.
      
      Format attendu :
      [
        {
          "front": "Terme ou Concept / Question courte",
          "back": "Définition claire et concise en 1 ou 2 phrases maximum"
        }
      ]`;
    } else if (selectedTool === "simplify") {
      prompt = `Analyse le document et/ou l'image fourni en pièce jointe pour en faire une synthèse et une vulgarisation poussée.
      
      Résumé texte de référence :
      """
      ${sourceContent}
      """
      
      Consignes : 
      - Fais un résumé concis en quelques points clés.
      - Ensuite, réécris le concept général comme si tu devais l'expliquer à un enfant de 10 ans, en utilisant une métaphore ou une analogie pour rendre l'idée abstraite très visuelle et facile à comprendre.
      - Format de sortie STRICTEMENT en JSON brut, SANS aucune balise Markdown (pas de \`\`\`json) ni texte supplémentaire.
      
      Format attendu :
      {
        "summary": ["Point clé 1", "Point clé 2", "Point clé 3"],
        "analogy": "Insérer la métaphore et l'explication très accessible ici."
      }`;
    }

    try {
      const text = await generateWithRetry(prompt, fileInlineData);
      
      // Nettoyage des balises Markdown (ex: ```json ... ```) si l'IA en renvoie quand même
      let cleanText = text || "";
      cleanText = cleanText.replace(/```(json)?|```/gi, '').trim();
      
      try {
        const parsedData = JSON.parse(cleanText);
        setInteractiveData(parsedData);
      } catch (e) {
        setError("L'IA a généré une réponse, mais le format JSON est invalide. Veuillez réessayer.");
        console.error("JSON Parse Error:", e, text);
      }

    } catch (err) {
      setError("Erreur lors de la génération. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
      <div className="col-span-1 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 flex flex-col h-fit">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-slate-900 dark:text-white" size={24} />
          <h2 className="font-bold text-xl text-slate-900 dark:text-white">Studio IA ✨</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
          
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
                  <div className="text-xs opacity-70">QCM interactif</div>
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
                  <div className="text-xs opacity-70">Flashcards interactives</div>
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
                  <div className="text-xs opacity-70">Résumé et analogie "10 ans"</div>
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
        {!interactiveData && !loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 dark:text-white/60 p-6 text-center">
            <Sparkles size={64} className="mb-4 opacity-50 text-slate-900 dark:text-white" />
            <p className="text-lg font-medium">Sélectionnez un outil, une source et lancez la génération.</p>
            <p className="text-sm mt-2">Le matériel pédagogique interactif s'affichera ici.</p>
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

        {interactiveData && !loading && (
          <div className="h-full">
            {selectedTool === 'quiz' && <VirtualQuiz data={interactiveData} />}
            {selectedTool === 'flashcards' && <FlashcardGrid data={interactiveData} />}
            {selectedTool === 'simplify' && <SummaryInteractive data={interactiveData} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiStudio;