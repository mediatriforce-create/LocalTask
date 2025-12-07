
import React from 'react';

interface ProgressBarProps {
  total: number;
  completed: number;
  percentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ total, completed, percentage }) => {
  return (
    <div className="mb-6 bg-glass p-4 rounded-2xl border border-white/5 shadow-lg">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Progresso do Dia</span>
        <div className="text-right">
          <span className="text-2xl font-black text-neon drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]">{percentage}%</span>
          <span className="text-xs text-slate-500 ml-2 font-mono">({completed}/{total})</span>
        </div>
      </div>
      <div className="h-3 w-full bg-black rounded-full overflow-hidden border border-white/10">
        <div 
          className="h-full bg-neon shadow-[0_0_15px_#39ff14] transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
