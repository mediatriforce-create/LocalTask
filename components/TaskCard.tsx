
import React, { useMemo } from 'react';
import { Tag, AlertCircle, Clock, Timer } from 'lucide-react';
import { Task, PRIORITY_CONFIG } from '../types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isReadOnly?: boolean;
  onAction?: (task: Task, action: 'start' | 'finish') => void;
  currentTime?: Date; // Passed from App for real-time late checking
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, isReadOnly, onAction, currentTime }) => {
  const handleDragStart = (e: React.DragEvent) => {
    if (isReadOnly) return;
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const today = new Date().toISOString().split('T')[0];
  const isFuture = task.date > today;
  
  // Late Logic Calculation V2.5 (Strict: Must have time)
  const isLate = useMemo(() => {
    if (task.status === 'done' || isReadOnly) return false;
    
    // Rule: Must have time to be late
    if (!task.time) return false;
    
    // Check Date (Past date with time set = Late)
    if (task.date < today) return true;

    // Check Time if it's today
    if (task.date === today && currentTime) {
       const [h, m] = task.time.split(':').map(Number);
       const startTime = new Date(currentTime);
       startTime.setHours(h, m, 0, 0);
       
       return currentTime > startTime;
    }
    return false;
  }, [task, today, isReadOnly, currentTime]);
  
  // Neon Colors based on State
  let borderColor = 'border-l-neon';
  let bgColor = 'bg-glass';
  let shadow = '';

  if (task.status === 'done') {
    borderColor = 'border-l-slate-600';
    bgColor = 'bg-black/40 opacity-50';
  } else if (isLate) {
    borderColor = 'border-l-red-600';
    bgColor = 'bg-red-900/10';
    shadow = 'shadow-[0_0_10px_rgba(220,38,38,0.2)] border border-red-500/30';
  } else if (isFuture) {
    borderColor = 'border-l-blue-500';
    bgColor = 'bg-blue-900/10';
  } else if (task.status === 'doing') {
    borderColor = 'border-l-yellow-400';
    bgColor = 'bg-zinc-900';
  }

  // Format Duration
  const formatDuration = (mins?: number) => {
      if (!mins) return '';
      if (mins < 60) return `${mins}m`;
      return `${Math.floor(mins/60)}h${mins%60 ? mins%60 : ''}`;
  };

  return (
    <div
      draggable={!isReadOnly}
      onDragStart={handleDragStart}
      onClick={onClick}
      className={`
        group relative ${bgColor} border-l-4 ${borderColor} rounded-r-lg p-3 shadow-md transition-all
        ${isReadOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing hover:shadow-neon-sm mb-3'}
        ${shadow}
      `}
    >
      <div className="cursor-pointer">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className={`font-medium text-sm leading-tight ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-white group-hover:text-neon transition-colors'}`}>
            {task.title}
          </h3>
          
          {/* Status Badges */}
          <div className="flex flex-col items-end gap-1 shrink-0">
             {isLate && (
               <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]">
                  ATRASADO
               </span>
             )}
             
             {isFuture ? (
                 <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                   <AlertCircle size={8} /> Futura
                 </span>
             ) : (
                 // Priority Badge
                 <div className={`w-2 h-2 rounded-full ${priorityConfig.color.replace('text-', 'bg-').replace('border-', 'shadow-')}`} title={priorityConfig.label} />
             )}
          </div>
        </div>

        {/* Info Row */}
        <div className="flex items-center flex-wrap gap-2 mt-2">
          {/* Category */}
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-300 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700">
            {task.category}
          </span>
          
          {/* Time & Duration */}
          {(task.time || task.duration) && (
            <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded px-1.5 py-0.5">
               {task.time && (
                 <span className="inline-flex items-center gap-1 text-[10px] text-neon font-mono">
                   <Clock size={10} /> {task.time}
                 </span>
               )}
               {task.time && task.duration && <span className="text-[8px] text-slate-500">|</span>}
               {task.duration && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Timer size={10} /> {formatDuration(task.duration)}
                  </span>
               )}
            </div>
          )}
          
          {/* Priority Badge Text (if not future) */}
          {!isFuture && (
             <span className={`text-[10px] px-1.5 py-0.5 rounded border ${priorityConfig.color} bg-black/20 flex items-center gap-1`}>
                {priorityConfig.emoji} {priorityConfig.label}
             </span>
          )}
        </div>
      </div>
    </div>
  );
};
