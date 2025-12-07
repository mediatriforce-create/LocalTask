
import React from 'react';
import { X, Palette, Check } from 'lucide-react';
import { ThemeColor, THEMES } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  currentTheme,
  onThemeChange 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette size={20} className="text-slate-200" />
            Configurações
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
             Tema Visual
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
             {(Object.entries(THEMES) as [ThemeColor, typeof THEMES[ThemeColor]][]).map(([key, theme]) => {
                const isSelected = currentTheme === key;
                return (
                  <button
                    key={key}
                    onClick={() => onThemeChange(key)}
                    className={`
                       relative p-3 rounded-xl border transition-all flex items-center gap-3 overflow-hidden group
                       ${isSelected ? 'bg-white/10 border-white/50' : 'bg-black border-zinc-800 hover:border-zinc-600'}
                    `}
                  >
                     <div 
                        className="w-6 h-6 rounded-full shadow-[0_0_10px]" 
                        style={{ backgroundColor: theme.hex, boxShadow: `0 0 10px ${theme.hex}` }} 
                     />
                     <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        {theme.label}
                     </span>
                     {isSelected && (
                        <Check size={16} className="absolute top-2 right-2 text-white opacity-50" />
                     )}
                  </button>
                );
             })}
          </div>
        </div>

      </div>
    </div>
  );
};
