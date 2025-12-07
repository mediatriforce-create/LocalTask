
import React from 'react';
import { ArrowLeft, Calendar, Edit2 } from 'lucide-react';
import { Task } from '../types';

interface FutureListProps {
  tasks: Task[];
  onBack: () => void;
  onEdit: (task: Task) => void;
}

export const FutureList: React.FC<FutureListProps> = ({ tasks, onBack, onEdit }) => {
  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}`;
  };

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar size={20} className="text-blue-400" />
          Futuras Demandas
        </h2>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p>Nenhuma tarefa agendada para o futuro.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-blue-500/30 transition-colors">
              <div>
                <h3 className="text-slate-200 font-medium">{task.title}</h3>
                <div className="flex gap-3 text-xs mt-1">
                  <span className="text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded">
                    {formatDate(task.date)}
                  </span>
                  <span className="text-slate-500">{task.category}</span>
                </div>
              </div>
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-slate-600 hover:text-blue-400 transition-colors"
              >
                <Edit2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
