
import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlignLeft, Clock, Smile, Flag, Timer } from 'lucide-react';
import { Task, PriorityLevel, PRIORITY_CONFIG } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  initialData?: Partial<Task>;
  categories: string[];
  defaultDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  categories,
  defaultDate 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [priority, setPriority] = useState<PriorityLevel>('low');
  
  // New Category State
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('📌');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setDescription(initialData?.description || '');
      setCategory(initialData?.category || '');
      setDate(initialData?.date || defaultDate || new Date().toISOString().split('T')[0]);
      setTime(initialData?.time || '');
      setDuration(initialData?.duration || '');
      setPriority(initialData?.priority || 'low');
      setIsCreatingCategory(false);
    }
  }, [isOpen, initialData, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || (!category && !isCreatingCategory) || !date) return;
    
    // Default duration for UX if time is set but duration is missing
    if (time && !duration) {
       setDuration(15);
    }

    let finalCategory = category;
    
    if (isCreatingCategory) {
      if (!newCatName.trim()) return;
      finalCategory = `${newCatEmoji} ${newCatName.trim()}`;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      category: finalCategory,
      date,
      time: time || undefined,
      duration: time ? Number(duration || 15) : undefined,
      priority
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-black border border-neon/30 rounded-2xl shadow-neon-glow overflow-hidden animate-in zoom-in-95 duration-200 mb-16 sm:mb-0 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="p-4 border-b border-neon/20 flex justify-between items-center bg-zinc-900/50 sticky top-0 z-10 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {initialData?.id ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-neon transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Título */}
          <div>
            <label className="block text-sm font-bold text-neon mb-1 uppercase tracking-wide">Título</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O que precisa ser feito?"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-all"
            />
          </div>

          {/* Prioridade */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm text-slate-400">
               <Flag size={16} />
               <span>Prioridade</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
               {(Object.keys(PRIORITY_CONFIG) as PriorityLevel[]).map((level) => (
                 <button
                   key={level}
                   type="button"
                   onClick={() => setPriority(level)}
                   className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-xs font-bold gap-1
                     ${priority === level 
                        ? `bg-zinc-800 ${PRIORITY_CONFIG[level].color}` 
                        : 'border-zinc-800 text-slate-600 bg-zinc-900/50 hover:bg-zinc-800'
                     }
                   `}
                 >
                    <span className="text-lg">{PRIORITY_CONFIG[level].emoji}</span>
                    <span className="truncate w-full text-center">{PRIORITY_CONFIG[level].label}</span>
                 </button>
               ))}
            </div>
          </div>

          {/* Categorias - Toggle Logic */}
          <div>
            <div className="flex items-center justify-between mb-1">
               <div className="flex items-center gap-2 text-sm text-slate-400">
                <Tag size={16} />
                <span>Categoria</span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                className="text-xs text-neon hover:underline flex items-center gap-1"
              >
                {isCreatingCategory ? 'Selecionar existente' : '+ Nova Categoria'}
              </button>
            </div>

            {isCreatingCategory ? (
               <div className="flex gap-2">
                  <div className="relative w-16">
                    <input 
                      type="text"
                      value={newCatEmoji}
                      onChange={e => setNewCatEmoji(e.target.value)}
                      className="w-full text-center bg-zinc-900 border border-neon/50 rounded-lg py-2.5 text-xl focus:outline-none"
                      maxLength={2}
                    />
                    <Smile size={12} className="absolute bottom-1 right-1 text-slate-500 pointer-events-none" />
                  </div>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nome da categoria"
                    className="flex-1 bg-zinc-900 border border-neon/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-neon"
                  />
               </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:border-neon focus:outline-none appearance-none"
              >
                <option value="" disabled>Selecione uma categoria...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 text-sm text-slate-400">
                <Calendar size={16} />
                <span>Data</span>
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:border-neon focus:outline-none [color-scheme:dark]"
              />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1 text-sm text-slate-400">
                <Clock size={16} />
                <span>Horário Início</span>
              </div>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:border-neon focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Duração (só aparece se tiver horário) */}
          {time && (
            <div className="animate-in slide-in-from-top-2">
               <div className="flex items-center gap-2 mb-2 text-sm text-slate-400">
                  <Timer size={16} />
                  <span>Duração Estimada <span className="text-neon">*</span></span>
               </div>
               <div className="flex flex-wrap gap-2">
                  {[15, 30, 45, 60, 90, 120].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDuration(mins)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors
                        ${duration === mins 
                          ? 'bg-neon text-black border-neon font-bold' 
                          : 'bg-zinc-900 text-slate-300 border-zinc-700 hover:border-neon'
                        }
                      `}
                    >
                      {mins < 60 ? `${mins}m` : `${mins/60}h${mins%60 ? mins%60 + 'm' : ''}`}
                    </button>
                  ))}
                  <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1.5 focus-within:border-neon">
                     <input
                        type="number"
                        placeholder="Outro"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-12 bg-transparent text-white text-sm focus:outline-none text-center"
                     />
                     <span className="text-slate-500 text-xs">min</span>
                  </div>
               </div>
            </div>
          )}

          {/* Descrição */}
          <div>
            <div className="flex items-center gap-2 mb-1 text-sm text-slate-400">
              <AlignLeft size={16} />
              <span>Descrição (Opcional)</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes adicionais..."
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!title.trim() || (!category && !isCreatingCategory) || (!!time && !duration)}
              className="w-full py-3 bg-neon hover:bg-[#32d911] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-lg rounded-xl shadow-neon-sm hover:shadow-neon transition-all uppercase tracking-widest"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
