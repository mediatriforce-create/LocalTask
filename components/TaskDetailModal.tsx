
import React from 'react';
import { X, Calendar, Clock, Tag, AlignLeft, Timer, Play, Check, Edit2 } from 'lucide-react';
import { Task, PRIORITY_CONFIG } from '../types';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onAction: (task: Task, action: 'start' | 'finish') => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ 
  task, 
  isOpen, 
  onClose, 
  onEdit, 
  onAction 
}) => {
  if (!isOpen || !task) return null;

  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const formatDuration = (mins?: number) => {
    if (!mins) return '';
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins/60)}h${mins%60 ? mins%60 + 'm' : ''}`;
  };

  const today = new Date().toISOString().split('T')[0];
  const isFuture = task.date > today;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header with Priority Color */}
        <div className={`h-2 w-full ${priorityConfig.color.replace('text-', 'bg-').replace('border-', '')}`}></div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`px-2 py-1 rounded text-xs font-bold border ${priorityConfig.color} bg-black/50 inline-flex items-center gap-1 uppercase tracking-wider`}>
               <span>{priorityConfig.emoji}</span>
               {priorityConfig.label}
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
              <X size={24} />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{task.title}</h2>

          <div className="space-y-4 mb-8">
            {/* Meta info Grid */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                 <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-1">
                    <Calendar size={12} /> Data
                 </div>
                 <div className="text-white font-mono">
                    {new Date(task.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                 </div>
               </div>

               <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                 <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-1">
                    <Tag size={12} /> Categoria
                 </div>
                 <div className="text-white">
                    {task.category}
                 </div>
               </div>

               {task.time && (
                 <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                   <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-1">
                      <Clock size={12} /> Início
                   </div>
                   <div className="text-neon font-mono text-lg">
                      {task.time}
                   </div>
                 </div>
               )}

               {task.duration && (
                 <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                   <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-1">
                      <Timer size={12} /> Duração
                   </div>
                   <div className="text-white font-mono">
                      {formatDuration(task.duration)}
                   </div>
                 </div>
               )}
            </div>

            {/* Description */}
            {task.description ? (
               <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                 <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                    <AlignLeft size={12} /> Detalhes
                 </div>
                 <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {task.description}
                 </p>
               </div>
            ) : (
                <div className="text-slate-500 text-sm italic text-center py-2">
                    Sem descrição adicional.
                </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
             <div className="flex gap-3">
               {!isFuture && task.status === 'todo' && (
                 <button 
                   onClick={() => { onAction(task, 'start'); onClose(); }}
                   className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase tracking-wide"
                 >
                   <Play size={18} fill="currentColor" /> Iniciar
                 </button>
               )}
               
               {!isFuture && (task.status === 'todo' || task.status === 'doing') && (
                 <button 
                   onClick={() => { onAction(task, 'finish'); onClose(); }}
                   className="flex-1 bg-neon hover:bg-[#32d911] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase tracking-wide"
                 >
                   <Check size={20} strokeWidth={3} /> Concluir
                 </button>
               )}
             </div>

             <div className="flex gap-3">
               <button 
                   onClick={() => { onEdit(task); onClose(); }}
                   className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                 >
                   <Edit2 size={16} /> Editar
               </button>
               
               {task.status === 'done' && (
                   <button 
                    onClick={() => { onAction(task, 'start'); onClose(); }} // Reopen
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                   >
                     Reabrir Tarefa
                   </button>
               )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
