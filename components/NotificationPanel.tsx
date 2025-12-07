
import React, { useMemo } from 'react';
import { X, AlertTriangle, Clock, AlertOctagon, Calendar, Check, Flag } from 'lucide-react';
import { Task, PRIORITY_CONFIG } from '../types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  currentTime: Date;
  onTaskClick: (task: Task) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  isOpen, 
  onClose, 
  tasks, 
  currentTime,
  onTaskClick
}) => {
  const todayStr = currentTime.toISOString().split('T')[0];

  const { priorityTasks, lateTasks, upcomingTasks } = useMemo(() => {
    const priority: Task[] = [];
    const late: Task[] = [];
    const upcoming: Task[] = [];

    tasks.forEach(task => {
      if (task.status === 'done') return;
      
      const isToday = task.date === todayStr;
      
      // 1. Late Logic (V2.4: passed start time)
      let isTaskLate = false;
      if (task.date < todayStr) {
        isTaskLate = true;
      } else if (isToday && task.time) {
         const [h, m] = task.time.split(':').map(Number);
         const startTime = new Date(currentTime);
         startTime.setHours(h, m, 0, 0);
         if (currentTime > startTime) isTaskLate = true;
      }

      if (isTaskLate) {
        late.push(task);
        return; // Don't add to other lists if late (it's the biggest issue)
      }

      // 2. Priority Logic (High or Max)
      if (task.priority === 'max' || task.priority === 'high') {
        priority.push(task);
      }

      // 3. Upcoming Logic (within 30 mins)
      if (isToday && task.time) {
         const [h, m] = task.time.split(':').map(Number);
         const startTime = new Date(currentTime);
         startTime.setHours(h, m, 0, 0);
         const diff = startTime.getTime() - currentTime.getTime();
         // 0 < diff < 30 mins in ms
         if (diff > 0 && diff <= 30 * 60 * 1000) {
            upcoming.push(task);
         }
      }
    });

    // Sort Priority: Max first, then High
    priority.sort((a, b) => {
        if (a.priority === b.priority) return 0;
        return a.priority === 'max' ? -1 : 1;
    });
    
    // Sort late by date/time (oldest first)
    late.sort((a, b) => {
        if (a.date === b.date && a.time && b.time) return a.time.localeCompare(b.time);
        return a.date > b.date ? 1 : -1;
    });

    return { priorityTasks: priority, lateTasks: late, upcomingTasks: upcoming };
  }, [tasks, currentTime, todayStr]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel */}
      <div className="relative w-full max-w-sm bg-black border-l border-neon/30 h-full shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b border-neon/20 flex justify-between items-center bg-zinc-900/80 backdrop-blur">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <AlertOctagon className="text-neon" /> Avisos
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
           
           {/* Late Section (Top) */}
           {lateTasks.length > 0 && (
             <div>
               <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                 <AlertTriangle size={14} /> Atrasadas
               </h3>
               <div className="space-y-2">
                 {lateTasks.map(task => (
                   <div key={task.id} onClick={() => { onTaskClick(task); onClose(); }} className="bg-red-900/10 border border-red-500/30 p-3 rounded-lg hover:bg-red-900/20 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start">
                         <span className="text-slate-200 font-medium">{task.title}</span>
                         <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600 text-white font-bold animate-pulse">
                           ATRASADO
                         </span>
                      </div>
                      <div className="mt-1 text-xs text-red-400 flex items-center gap-1">
                         <Calendar size={10} /> {new Date(task.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                         {task.time && <span>• {task.time}</span>}
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* Priority Section (High/Max) */}
           {priorityTasks.length > 0 && (
             <div>
               <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                 <Flag size={14} /> Prioridade Alta
               </h3>
               <div className="space-y-2">
                 {priorityTasks.map(task => (
                   <div key={task.id} onClick={() => { onTaskClick(task); onClose(); }} className="bg-zinc-900/50 border border-orange-500/30 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start">
                         <span className="text-white font-medium">{task.title}</span>
                         <span className={`text-[10px] px-1.5 py-0.5 rounded bg-black border ${PRIORITY_CONFIG[task.priority].color} text-white`}>
                           {PRIORITY_CONFIG[task.priority].label}
                         </span>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* Upcoming Section */}
           {upcomingTasks.length > 0 && (
             <div>
               <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                 <Clock size={14} /> Próximas 30min
               </h3>
               <div className="space-y-2">
                 {upcomingTasks.map(task => (
                   <div key={task.id} onClick={() => { onTaskClick(task); onClose(); }} className="bg-zinc-900/50 border border-blue-500/30 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start">
                         <span className="text-white font-medium">{task.title}</span>
                         <span className="text-neon font-mono font-bold">{task.time}</span>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {priorityTasks.length === 0 && lateTasks.length === 0 && upcomingTasks.length === 0 && (
              <div className="text-center py-10 opacity-50">
                 <Check className="mx-auto mb-2 text-neon" size={40} />
                 <p className="text-slate-400">Tudo sob controle!</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
