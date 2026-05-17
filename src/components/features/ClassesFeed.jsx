import React, { useState, useEffect, useRef } from 'react';
import { Users, ChevronRight, CheckCircle2, X, Plus, Calendar, FileText, Search, Paperclip, BookOpen, Trash2, UploadCloud, Tag, AlertCircle } from 'lucide-react';
import FilePreviewCard from '../common/FilePreviewCard';

const ClassesFeed = ({ classes, setClasses, courses, setCourses, updateClassStudents }) => {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || null);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [activeSubTab, setActiveSubTab] = useState('feed'); // 'feed' or 'students'
  
  // Categories State
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('eduDash_categories')) || []);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ 
    title: "", 
    categoryId: "",
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
  const classCourses = courses.filter(c => c.classId === selectedClassId);

  // Derive unique dates for the selected class
  const uniqueDates = [...new Set(classCourses.map(c => c.date))].sort((a, b) => new Date(b) - new Date(a));

  // Sync local text area with the selected class students
  useEffect(() => {
    if (selectedClass) {
      setLocalStudentsText(selectedClass.students || "");
    }
    // Clear date filter on class change
    setFilterDate("");
  }, [selectedClassId, classes]);

  // Save categories to localStorage
  useEffect(() => {
    localStorage.setItem('eduDash_categories', JSON.stringify(categories));
  }, [categories]);

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

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const newCategory = { id: Date.now().toString(), name: newCategoryName.trim() };
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setIsAddingCategory(false);
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
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
    if (!newCourse.title.trim() || !newCourse.categoryId) return; 
    const course = {
      id: Date.now().toString(),
      classId: selectedClassId,
      ...newCourse
    };
    setCourses([course, ...courses]);
    setIsAddingCourse(false);
    setNewCourse({ title: "", categoryId: "", content: "", date: new Date().toISOString().split('T')[0], file: null });
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const filteredCourses = classCourses
    .filter(c => filterDate ? c.date === filterDate : true)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-[600px] overflow-hidden">
      
      {/* Sidebar Classes & Categories */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 overflow-y-auto pb-4 pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
        
        {/* Classes Block */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-4 shrink-0">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={20} className="text-slate-900 dark:text-white"/> Mes Classes
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
                    : 'hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
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
                  className="flex-1 bg-white/90 dark:bg-white/5 p-2 rounded-xl text-sm border border-slate-300 dark:border-white/10 focus:border-slate-400 dark:focus:border-white text-slate-900 dark:text-white outline-none min-w-0"
                />
                <button type="submit" className="p-2 shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-sm hover:opacity-90 transition-opacity">
                  <CheckCircle2 size={16} />
                </button>
                <button type="button" onClick={() => setIsAddingClass(false)} className="p-2 shrink-0 bg-white/90 dark:bg-white/5 text-slate-500 dark:text-white/60 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsAddingClass(true)}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/60 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Plus size={18} /> Ajouter une classe
              </button>
            )}
          </div>
        </div>

        {/* Categories Block */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-4 shrink-0">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Tag size={20} className="text-slate-900 dark:text-white"/> Mes Catégories
            </h2>
          </div>
          
          <div className="flex flex-col gap-2">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80"
              >
                <span>{cat.name}</span>
                <button onClick={() => deleteCategory(cat.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {isAddingCategory ? (
              <form onSubmit={handleAddCategory} className="flex items-center gap-2 mt-2">
                <input 
                  type="text" autoFocus
                  value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Matière (ex: NSI)..."
                  className="flex-1 bg-white/90 dark:bg-white/5 p-2 rounded-xl text-sm border border-slate-300 dark:border-white/10 focus:border-slate-400 dark:focus:border-white text-slate-900 dark:text-white outline-none min-w-0"
                />
                <button type="submit" className="p-2 shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-sm hover:opacity-90 transition-opacity">
                  <CheckCircle2 size={16} />
                </button>
                <button type="button" onClick={() => setIsAddingCategory(false)} className="p-2 shrink-0 bg-white/90 dark:bg-white/5 text-slate-500 dark:text-white/60 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsAddingCategory(true)}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/60 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Plus size={18} /> Nouvelle catégorie
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Main Area */}
      <div className="flex-1 h-full flex flex-col gap-4 overflow-hidden">
        {selectedClass ? (
          <>
            {/* Header & SubTabs (Fixed) */}
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-4 flex flex-col gap-4 shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-xl text-slate-900 dark:text-white">Classe : {selectedClass.name}</h2>
                </div>
                
                {/* Sub-navigation Tabs */}
                <div className="flex bg-white/90 dark:bg-white/5 p-1 rounded-2xl border border-slate-300 dark:border-white/10">
                  <button 
                    onClick={() => setActiveSubTab('feed')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSubTab === 'feed' ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    Documents & Cours
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('students')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSubTab === 'students' ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    Liste des Élèves
                  </button>
                </div>
              </div>
            </div>

            {/* Content Switch based on SubTab */}
            {activeSubTab === 'students' ? (
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 flex-1 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
                <div className="flex items-center justify-between shrink-0">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Users size={20} /> Gestion des élèves
                  </h3>
                  <span className="text-sm font-medium bg-white/90 dark:bg-white/5 text-slate-900 dark:text-white px-3 py-1 rounded-full border border-slate-300 dark:border-white/10">
                    {localStudentsText.split('\n').filter(n => n.trim()).length} élèves
                  </span>
                </div>
                
                <p className="text-sm text-slate-500 dark:text-white/60 shrink-0">
                  Copiez-collez votre liste d'élèves ici. Saisissez <strong>un élève par ligne</strong>. Cette liste sera automatiquement proposée dans les outils "Tirage au sort" et "Générateur de groupes".
                </p>
                
                <textarea
                  value={localStudentsText}
                  onChange={(e) => setLocalStudentsText(e.target.value)}
                  className="flex-1 w-full bg-white/90 dark:bg-white/5 rounded-2xl p-4 resize-none border border-slate-300 dark:border-white/10 focus:ring-2 focus:ring-slate-400 dark:focus:ring-white text-slate-900 dark:text-white outline-none min-h-[300px]"
                  placeholder="Ex:\nJean Dupont\nMarie Curie\nAlbert Einstein..."
                />

                <div className="flex items-center justify-end gap-4 mt-2 shrink-0">
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
                {/* Timeline Selector (Fixed at the top) */}
                {uniqueDates.length > 0 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 shrink-0 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10 px-1">
                    <button
                      onClick={() => setFilterDate("")}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                        !filterDate 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                          : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:bg-white dark:hover:bg-white/10'
                      }`}
                    >
                      <Calendar size={16} /> Tous les jours
                    </button>
                    {uniqueDates.map(date => {
                      const isSelected = filterDate === date;
                      const d = new Date(date);
                      const label = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
                      return (
                        <button
                          key={date}
                          onClick={() => setFilterDate(date)}
                          className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            isSelected 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                              : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:bg-white dark:hover:bg-white/10'
                          }`}
                        >
                          <span className="capitalize">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Course List & Form (Independent Scroll) */}
                <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 pb-10 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
                  {isAddingCourse ? (
                    categories.length === 0 ? (
                      <div className="bg-amber-100/80 dark:bg-amber-500/10 backdrop-blur-md border border-amber-300 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 p-6 rounded-3xl mb-2 text-sm font-medium flex items-center gap-3 animate-in fade-in">
                        <AlertCircle size={24} className="shrink-0" />
                        <span>Veuillez d'abord créer une catégorie dans la barre latérale pour pouvoir publier un cours.</span>
                        <button 
                          onClick={() => setIsAddingCourse(false)}
                          className="ml-auto p-2 hover:bg-amber-200/50 dark:hover:bg-amber-500/20 rounded-xl transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleAddCourse} className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 animate-in slide-in-from-top-4 fade-in shrink-0">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                          <FileText size={20} /> Déposer un nouveau document
                        </h3>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                              type="text" placeholder="Titre du cours..." required
                              value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                              className="flex-1 bg-white/90 dark:bg-white/5 p-3 rounded-2xl border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 dark:focus:ring-white outline-none"
                            />
                            <select
                              value={newCourse.categoryId}
                              onChange={(e) => setNewCourse({...newCourse, categoryId: e.target.value})}
                              required
                              className="bg-white/90 dark:bg-white/5 p-3 rounded-2xl border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 dark:focus:ring-white outline-none min-w-[200px]"
                            >
                              <option value="" disabled>Choisir la catégorie</option>
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id} className="text-slate-900">{cat.name}</option>
                              ))}
                            </select>
                            <input 
                              type="date" required
                              value={newCourse.date} onChange={(e) => setNewCourse({...newCourse, date: e.target.value})}
                              className="bg-white/90 dark:bg-white/5 p-3 rounded-2xl border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 dark:focus:ring-white outline-none"
                            />
                          </div>
                          
                          <textarea 
                            placeholder="Contenu du cours ou résumé (optionnel si fichier joint)..." rows="3"
                            value={newCourse.content} onChange={(e) => setNewCourse({...newCourse, content: e.target.value})}
                            className="w-full bg-white/90 dark:bg-white/5 p-3 rounded-2xl border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 dark:focus:ring-white outline-none resize-none"
                          />

                          <div className="border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-4 bg-white/90 dark:bg-white/5 text-center relative overflow-hidden transition-colors hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/30">
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                            />
                            {!newCourse.file ? (
                              <div className="flex flex-col items-center justify-center pointer-events-none text-slate-500 dark:text-white/60 py-4">
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
                            <button type="button" onClick={() => setIsAddingCourse(false)} className="px-4 py-2 rounded-full font-medium text-slate-500 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors">
                              Annuler
                            </button>
                            <button type="submit" disabled={!newCourse.title.trim() || !newCourse.categoryId} className="px-6 py-2 rounded-full font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-all">
                              <CheckCircle2 size={18} /> Publier
                            </button>
                          </div>
                        </div>
                      </form>
                    )
                  ) : (
                    <button 
                      onClick={() => setIsAddingCourse(true)}
                      className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-4 text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 group font-medium relative overflow-hidden shrink-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <div className="w-8 h-8 rounded-full bg-white/90 dark:bg-white/5 text-slate-900 dark:text-white flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white transition-colors relative z-10">
                        <Plus size={20} />
                      </div>
                      <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400">
                        Déposer un nouveau cours ou document
                      </span>
                    </button>
                  )}

                  {filteredCourses.length === 0 ? (
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-10 text-center flex flex-col items-center justify-center text-slate-500 dark:text-white/60 border-2 border-dashed border-slate-300 dark:border-white/10 flex-1 min-h-[200px]">
                      <Search size={48} className="mb-4 opacity-50" />
                      <p className="text-lg font-medium">Aucun cours trouvé.</p>
                      <p className="text-sm mt-1">{filterDate ? "Essayez une autre date." : "Commencez par déposer un premier document pour cette classe."}</p>
                    </div>
                  ) : (
                    filteredCourses.map(course => {
                      const categoryName = categories.find(c => c.id === course.categoryId)?.name || "Général";
                      
                      return (
                        <div key={course.id} className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 group relative animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-4 shrink-0">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-300 rounded-full flex items-center gap-1 w-fit border border-purple-500/20">
                                <Tag size={12} /> {categoryName}
                              </span>
                              <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-2 mt-1">
                                {course.file ? <Paperclip size={18} className="opacity-50 text-slate-900 dark:text-white" /> : <BookOpen size={18} className="opacity-50 text-slate-900 dark:text-white" />}
                                {course.title}
                              </h3>
                            </div>
                            <span className="text-xs font-medium px-3 py-1 bg-white/90 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-full flex items-center gap-1">
                              <Calendar size={12} /> {new Date(course.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                          </div>

                          {course.content && (
                            <div className="text-slate-900 dark:text-white bg-white/90 dark:bg-white/5 p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap border border-slate-300 dark:border-white/10">
                              {course.content}
                            </div>
                          )}

                          {course.file && (
                             <FilePreviewCard file={course.file} />
                          )}

                          <button 
                            onClick={() => deleteCourse(course.id)}
                            className="absolute top-4 right-4 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-300 dark:border-white/10"
                            title="Supprimer ce cours"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-10 text-center flex flex-col items-center justify-center text-slate-500 dark:text-white/60 h-full">
            <Users size={64} className="mb-4 text-slate-400 dark:text-white/30" />
            <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">Aucune classe sélectionnée</p>
            <p className="text-md opacity-80">Sélectionnez une classe à gauche ou créez-en une nouvelle pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesFeed;
