import React from 'react';
import { Square, CheckSquare, Clock, Tag } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onComplete: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete }) => {
  return (
    <div className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-green-500/50 rounded-xl p-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(74,222,128,0.1)]">
      <div className="flex items-start gap-4">
        
        {/* Checkbox Button */}
        <button
          onClick={() => onComplete(task)}
          className="mt-1 text-slate-500 hover:text-green-400 transition-colors shrink-0"
          aria-label="Concluir tarefa"
        >
          <Square size={24} strokeWidth={2} className="group-hover:hidden" />
          <CheckSquare size={24} strokeWidth={2} className="hidden group-hover:block text-green-400" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-medium text-slate-100 leading-tight break-words">
              {task.title}
            </h3>
            {task.time && (
              <div className="flex items-center gap-1 text-green-400 font-mono text-sm bg-green-400/10 px-2 py-1 rounded-md shrink-0 border border-green-400/20 shadow-[0_0_5px_rgba(74,222,128,0.2)]">
                <Clock size={12} />
                {task.time}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-md border border-slate-600/50">
              <Tag size={10} />
              {task.category}
            </span>
            {task.repeatWeekly && (
               <span className="text-xs text-slate-500 flex items-center gap-1">
                 Semanal
               </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
