
import React from 'react';
import { ArrowLeft, BarChart3, CalendarDays } from 'lucide-react';
import { DayStats } from '../types';

interface HistoryViewProps {
  stats: DayStats[];
  onBack: () => void;
  onSelectDate: (date: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ stats, onBack, onSelectDate }) => {
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
          <BarChart3 size={20} className="text-neon" />
          Histórico (7 Dias)
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map(day => {
          const percentage = day.total === 0 ? 0 : Math.round((day.completed / day.total) * 100);
          
          return (
            <button
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-left hover:bg-slate-800 hover:border-neon/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-400 font-mono text-sm">{formatDate(day.date)}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${percentage === 100 ? 'bg-neon/20 text-neon' : 'bg-slate-800 text-slate-500'}`}>
                  {percentage}%
                </span>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{day.completed}</span>
                <span className="text-sm text-slate-500">/ {day.total} tarefas</span>
              </div>
              
              <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-neon/50 group-hover:bg-neon transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
      
      {stats.length === 0 && (
        <div className="text-center py-10 text-slate-500">
          Sem dados recentes.
        </div>
      )}
    </div>
  );
};
