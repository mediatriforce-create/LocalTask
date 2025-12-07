
export interface UserProfile {
  name: string;
  categories: string[];
  isOnboarded: boolean;
  theme?: ThemeColor;
}

export type TaskStatus = 'todo' | 'doing' | 'done';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'max';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: TaskStatus;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:MM
  duration?: number; // In minutes
  priority: PriorityLevel;
  repeatWeekly?: boolean;
  createdAt: number;
  completedAt?: number;
}

export interface DayStats {
  date: string;
  total: number;
  completed: number;
}

export const DEFAULT_CATEGORIES = [
  "💼 Trabalho",
  "📚 Estudos",
  "🏃 Saúde",
  "🏠 Casa",
  "⭐ Pessoal",
  "🎯 Objetivos",
  "🛠️ Projetos"
];

export const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'A Fazer' },
  { id: 'doing', label: 'Fazendo' },
  { id: 'done', label: 'Concluído' },
];

export const PRIORITY_CONFIG: Record<PriorityLevel, { label: string; color: string; emoji: string }> = {
  low: { label: 'Baixa', color: 'text-slate-400 border-slate-500 bg-slate-500/10', emoji: '⚪' },
  medium: { label: 'Média', color: 'text-yellow-400 border-yellow-400 bg-yellow-400/10', emoji: '🟡' },
  high: { label: 'Alta', color: 'text-orange-500 border-orange-500 bg-orange-500/10', emoji: '🟠' },
  max: { label: 'Máxima', color: 'text-red-500 border-red-500 bg-red-500/10 animate-pulse', emoji: '🔴' },
};

export type ThemeColor = 'green' | 'blue' | 'purple' | 'pink' | 'yellow' | 'orange';

export const THEMES: Record<ThemeColor, { label: string; hex: string; rgb: string }> = {
  green: { label: 'Verde Neon', hex: '#39ff14', rgb: '57 255 20' },
  blue: { label: 'Azul Neon', hex: '#00eaff', rgb: '0 234 255' },
  purple: { label: 'Roxo Neon', hex: '#a020f0', rgb: '160 32 240' },
  pink: { label: 'Rosa Neon', hex: '#ff00ff', rgb: '255 0 255' },
  yellow: { label: 'Amarelo Neon', hex: '#ffee33', rgb: '255 238 51' },
  orange: { label: 'Laranja Neon', hex: '#ff8c00', rgb: '255 140 0' },
};
