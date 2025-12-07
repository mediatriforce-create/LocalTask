
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (name: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');

  const finish = () => {
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="w-full max-w-md bg-glass backdrop-blur-md p-8 rounded-2xl border border-neon/30 shadow-neon-glow">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Bem-vindo ao <span className="text-neon drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]">LocalTask</span>
        </h1>
        <p className="text-slate-400 mb-8">Para começarmos, como devemos te chamar?</p>
        
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-neon placeholder:text-slate-600 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all text-xl mb-6 shadow-inner"
          onKeyDown={(e) => e.key === 'Enter' && finish()}
        />

        <button
          onClick={finish}
          disabled={!name.trim()}
          className="w-full py-4 bg-neon hover:bg-[#32d911] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-lg uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 group shadow-neon-sm hover:shadow-neon"
        >
          Iniciar
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
