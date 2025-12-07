
import React from 'react';
import { Task, TaskStatus, COLUMNS } from '../types';
import { TaskCard } from './TaskCard';

interface BoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  isReadOnly?: boolean;
  currentTime?: Date;
}

export const Board: React.FC<BoardProps> = ({ tasks, onMoveTask, onEditTask, isReadOnly, currentTime }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (isReadOnly) return;
    
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      onMoveTask(taskId, status);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const isFuture = task.date > today;

    if (status === 'done' && isFuture) {
      if (window.confirm('Esta tarefa está agendada para o futuro. Deseja concluí-la mesmo assim?')) {
        onMoveTask(taskId, status);
      }
    } else {
      onMoveTask(taskId, status);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full pb-32 md:pb-4 overflow-y-auto md:overflow-hidden">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        
        return (
          <div 
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex-1 min-w-[280px] flex flex-col bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-lg"
          >
            {/* Column Header */}
            <div className={`p-4 border-b border-white/5 flex justify-between items-center
              ${col.id === 'todo' ? 'bg-gradient-to-r from-blue-500/10 to-transparent' : ''}
              ${col.id === 'doing' ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' : ''}
              ${col.id === 'done' ? 'bg-gradient-to-r from-neon/10 to-transparent' : ''}
            `}>
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 uppercase tracking-wider">
                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px]
                  ${col.id === 'todo' ? 'bg-blue-400 shadow-blue-400' : ''}
                  ${col.id === 'doing' ? 'bg-yellow-400 shadow-yellow-400' : ''}
                  ${col.id === 'done' ? 'bg-neon shadow-neon' : ''}
                `} />
                {col.label}
              </h3>
              <span className="text-xs font-mono font-bold text-black bg-white/20 px-2 py-0.5 rounded-full">
                {colTasks.length}
              </span>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-3 space-y-0 overflow-y-auto custom-scrollbar min-h-[150px]">
              {colTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onClick={() => onEditTask(task)}
                  isReadOnly={isReadOnly}
                  currentTime={currentTime}
                />
              ))}
              {colTasks.length === 0 && (
                <div className="h-24 flex items-center justify-center rounded-lg opacity-20">
                  <span className="text-xs text-white uppercase tracking-widest">Vazio</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
