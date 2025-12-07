
import { useState, useEffect, useCallback } from 'react';
import { Task, UserProfile, DEFAULT_CATEGORIES, TaskStatus, DayStats, PriorityLevel, ThemeColor } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'localtask-profile-v3',
  TASKS: 'localtask-tasks-v3',
};

export const useTaskManager = () => {
  // --- Estados ---
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : { name: '', categories: DEFAULT_CATEGORIES, isOnboarded: false, theme: 'green' };
    } catch {
      return { name: '', categories: DEFAULT_CATEGORIES, isOnboarded: false, theme: 'green' };
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!saved) return [];
      
      const parsedTasks = JSON.parse(saved);
      
      // Migration: Ensure 'priority' exists if coming from older version with 'urgency'
      return parsedTasks.map((t: any) => {
        if (!t.priority) {
          const oldUrgency = t.urgency || 'low';
          let newPriority: PriorityLevel = 'low';
          if (oldUrgency === 'moderate') newPriority = 'medium';
          if (oldUrgency === 'important') newPriority = 'high';
          if (oldUrgency === 'urgent' || oldUrgency === 'critical') newPriority = 'max';
          
          return { ...t, priority: newPriority };
        }
        return t;
      });

    } catch {
      return [];
    }
  });

  // --- Persistência ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  // --- Helpers ---
  const getTodayString = () => {
    // Return strictly local YYYY-MM-DD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const checkIsLate = (task: Task, currentDateTime: Date) => {
    // Regra 1: Se já está concluída, não está atrasada.
    if (task.status === 'done') return false;
    
    // Regra 2: Se NÃO tem horário definido, NUNCA fica atrasada (PRD 2.5).
    if (!task.time) return false;

    const todayStr = getTodayString();
    
    // Regra 3: Data da tarefa já passou (Ontem ou antes)
    if (task.date < todayStr) return true;
    
    // Regra 4: É hoje, tem horário, e o horário atual já passou.
    if (task.date === todayStr) {
       const [hours, minutes] = task.time.split(':').map(Number);
       const taskStartTime = new Date(currentDateTime);
       taskStartTime.setHours(hours, minutes, 0, 0);
       
       return currentDateTime > taskStartTime;
    }

    // Data futura
    return false;
  };

  // --- Ações de Perfil ---
  const completeOnboarding = useCallback((name: string) => {
    setProfile(prev => ({
      ...prev,
      name,
      categories: DEFAULT_CATEGORIES,
      isOnboarded: true,
    }));
  }, []);

  const addCategory = useCallback((newCategory: string) => {
    setProfile(prev => {
      if (prev.categories.includes(newCategory)) return prev;
      return { ...prev, categories: [...prev.categories, newCategory] };
    });
  }, []);

  const setTheme = useCallback((theme: ThemeColor) => {
    setProfile(prev => ({ ...prev, theme }));
  }, []);

  // --- Ações de Tarefas ---
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'status' | 'date'> & { date?: string }) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      status: 'todo',
      date: taskData.date || getTodayString(),
      priority: taskData.priority || 'low',
      createdAt: Date.now(),
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      
      const updatedTask = { ...t, ...updates };
      
      if (updates.status === 'done' && t.status !== 'done') {
        updatedTask.completedAt = Date.now();
      } else if (updates.status !== 'done' && t.status === 'done') {
        updatedTask.completedAt = undefined;
      }

      return updatedTask;
    }));
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      
      const updates: Partial<Task> = { status: newStatus };
      if (newStatus === 'done') updates.completedAt = Date.now();
      else updates.completedAt = undefined;

      return { ...t, ...updates };
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // --- Getters & Filtros ---
  const getTasksByDate = useCallback((date: string) => {
    const today = getTodayString();
    
    return tasks.filter(t => {
      // Show if it's strictly for this date
      if (t.date === date) return true;
      // Show future tasks on today's view as per PRD requirements ("Tarefas de dias futuros ainda aparecem no dia atual")
      if (date === today && t.date > today) return true;
      return false;
    }).sort((a, b) => {
        // Ordenação por prioridade
        const priorityWeight = { max: 4, high: 3, medium: 2, low: 1 };
        if (a.priority !== b.priority) {
            return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        
        // Depois por horário
        if (a.date === b.date) {
            if (a.time && b.time) return a.time.localeCompare(b.time);
            return 0;
        }
        return a.date > b.date ? 1 : -1;
    });
  }, [tasks]);

  const getProgress = useCallback((date: string) => {
    // Progress bar only counts tasks for the specific day, ignoring Future tasks that might be visible
    const dayTasks = tasks.filter(t => t.date === date);
    const total = dayTasks.length;
    const completed = dayTasks.filter(t => t.status === 'done').length;
    return { total, completed, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
  }, [tasks]);

  const getHistoryStats = useCallback((): DayStats[] => {
    const stats: DayStats[] = [];
    const today = new Date();
    
    // Last 7 days
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const dayTasks = tasks.filter(t => t.date === dateStr);
      stats.push({
        date: dateStr,
        total: dayTasks.length,
        completed: dayTasks.filter(t => t.status === 'done').length
      });
    }
    return stats;
  }, [tasks]);

  return {
    profile,
    tasks,
    completeOnboarding,
    addCategory,
    setTheme,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    getTasksByDate,
    getProgress,
    getHistoryStats,
    checkIsLate,
    getTodayString
  };
};
