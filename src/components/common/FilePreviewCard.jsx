import React from 'react';
import { FileImage, FileSpreadsheet, FileText, File, Trash2 } from 'lucide-react';

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
      <div className="relative group overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl">
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
      <div className="relative group overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl h-[500px] flex flex-col">
        <div className="p-3 bg-white/90 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
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
    <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl relative group">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`p-3 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-300 dark:border-white/10 ${colorClass}`}>
          <Icon size={24} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium text-slate-900 dark:text-white truncate">{file.name}</span>
          <span className="text-xs text-slate-500 dark:text-white/60 uppercase tracking-wider">
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

export default FilePreviewCard;