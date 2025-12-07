
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, AlertOctagon, Settings } from 'lucide-react';
import { useTaskManager } from './hooks/useTaskManager';
import { Onboarding } from './components/Onboarding';
import { TaskModal } from './components/TaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { NotificationPanel } from './components/NotificationPanel';
import { SettingsModal } from './components/SettingsModal';
import { Board } from './components/Board';
import { ProgressBar } from './components/ProgressBar';
import { HistoryView } from './components/HistoryView';
import { Task, THEMES } from './types';

const App: React.FC = () => {
  const { 
    profile, 
    tasks,
    completeOnboarding, 
    addCategory, 
    setTheme,
    addTask,
    updateTask,
    moveTask,
    getTasksByDate,
    getProgress,
    getHistoryStats,
    checkIsLate,
    getTodayString
  } = useTaskManager();

  // "Today" is strictly local device time
  const [currentTime, setCurrentTime] = useState(new Date());
  const todayStr = getTodayString();
  
  const [view, setView] = useState<'board' | 'history'>('board');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [activeTask, setActiveTask] = useState<Task | null>(null); // For Details or Edit
  const [isEditingMode, setIsEditingMode] = useState(false); // Flag to know if activeTask is for edit

  // Background Particles Logic
  const particles = Array.from({ length: 30 });
  const isToday = selectedDate === todayStr;

  // Real-time Clock Tick (every minute)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1 min
    return () => clearInterval(timer);
  }, []);

  // Theme Application Logic
  useEffect(() => {
     if (profile.theme) {
        const themeConfig = THEMES[profile.theme] || THEMES['green'];
        document.documentElement.style.setProperty('--color-neon', themeConfig.rgb);
     }
  }, [profile.theme]);

  // Sync selected date if it was today and day changed naturally
  useEffect(() => {
     if (isToday && selectedDate !== todayStr) {
        setSelectedDate(todayStr);
     }
  }, [todayStr]);
  
  // Handlers
  const openCreateModal = () => {
    setActiveTask(null);
    setIsEditingMode(false);
    setIsModalOpen(true);
  };

  const openTaskDetail = (task: Task) => {
    setActiveTask(task);
    setIsDetailModalOpen(true);
  };

  const openEditFromDetail = (task: Task) => {
    setActiveTask(task);
    setIsEditingMode(true); 
    setIsDetailModalOpen(false); 
    setIsModalOpen(true); 
  };

  const handleSaveTask = (taskData: any) => {
    if (!profile.categories.includes(taskData.category)) {
      addCategory(taskData.category);
    }

    if (activeTask && isEditingMode) {
      updateTask(activeTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleTaskAction = (task: Task, action: 'start' | 'finish') => {
      if (action === 'start') {
        moveTask(task.id, 'doing');
      } else if (action === 'finish') {
         const isFuture = task.date > todayStr;
         if (isFuture) {
            if (window.confirm('Esta tarefa está agendada para o futuro. Deseja concluí-la mesmo assim?')) {
              moveTask(task.id, 'done');
            }
         } else {
           moveTask(task.id, 'done');
         }
      }
  };

  const changeDate = (days: number) => {
    const date = new Date(selectedDate + 'T00:00:00');
    date.setDate(date.getDate() + days);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
  };

  // Check for Warnings (to animate Notification Button)
  // PRD 2.5: Pisca verde/vermelho quando existe tarefa atrasada ou prioridade máxima
  const hasWarnings = React.useMemo(() => {
    return tasks.some(t => {
       if (t.status === 'done') return false;
       if (checkIsLate(t, currentTime)) return true; // Late
       if (t.priority === 'max') return true; // Critical/Max Priority
       return false;
    });
  }, [tasks, currentTime, checkIsLate]);

  if (!profile.isOnboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
        <div className="particles-container">
          {particles.map((_, i) => (
             <div key={i} className="particle" style={{
                 width: Math.random() * 4 + 1 + 'px',
                 height: Math.random() * 4 + 1 + 'px',
                 left: Math.random() * 100 + '%',
                 top: Math.random() * 100 + '%',
                 animationDuration: Math.random() * 10 + 5 + 's',
                 animationDelay: Math.random() * 5 + 's'
               }}
             />
          ))}
        </div>
        <div className="z-10 w-full flex justify-center">
            <Onboarding onComplete={completeOnboarding} />
        </div>
      </div>
    );
  }

  const currentViewTasks = getTasksByDate(selectedDate);
  const progress = getProgress(selectedDate);

  const dateDisplay = new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  return (
    <div className="min-h-screen text-slate-200 flex flex-col relative bg-black">
      {/* Particle Background */}
      <div className="particles-container">
          {particles.map((_, i) => (
             <div key={i} className="particle" style={{
                 width: Math.random() * 3 + 1 + 'px',
                 height: Math.random() * 3 + 1 + 'px',
                 left: Math.random() * 100 + '%',
                 top: Math.random() * 100 + '%',
                 animationDuration: Math.random() * 20 + 10 + 's',
                 animationDelay: Math.random() * 5 + 's'
               }}
             />
          ))}
      </div>

      {/* Header */}
      <div className="z-10 w-full px-4 pt-6 pb-2 flex-none max-w-5xl mx-auto">
        {view === 'board' && (
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
               LocalTask <span className="text-neon text-xs border border-neon px-1 rounded uppercase">V2.5</span>
            </h1>
            <div className="flex gap-2">
               {/* Configurações Button */}
               <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 bg-zinc-900/80 text-slate-400 hover:text-neon rounded-xl border border-white/10 hover:border-neon hover:shadow-neon-sm transition-all shadow-lg"
                title="Configurações"
              >
                <Settings size={20} />
              </button>
               
               {/* Avisos Button */}
               <button 
                onClick={() => setIsNotifPanelOpen(true)}
                className={`p-2 bg-zinc-900/80 text-slate-400 hover:text-neon rounded-xl border border-white/10 hover:border-neon hover:shadow-neon-sm transition-all shadow-lg relative group ${hasWarnings ? '!border-red-500/50 !text-red-400 animate-pulse' : ''}`}
                title="Avisos"
              >
                <AlertOctagon size={20} />
                {hasWarnings && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />}
              </button>
              
              {/* Histórico Button - Roxo Neon Fixo (#a020f0) */}
              <button 
                onClick={() => setView('history')}
                className="p-2 bg-zinc-900/80 text-[#a020f0] hover:text-[#c040ff] rounded-xl border border-white/10 hover:border-[#a020f0] hover:shadow-[0_0_10px_#a020f0] transition-all shadow-lg"
                title="Histórico"
              >
                <Clock size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Date Title & Progress (Only on Board) */}
        {view === 'board' && (
           <div className="animate-in slide-in-from-top-4 duration-500">
             <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-white capitalize tracking-tight drop-shadow-md">
                   {isToday ? 'Hoje' : dateDisplay}
                </h2>
                {!isToday && (
                  <button onClick={() => setSelectedDate(todayStr)} className="text-xs text-neon hover:underline mt-1 font-bold uppercase tracking-widest">
                    Voltar para Hoje
                  </button>
                )}
             </div>
             
             <ProgressBar {...progress} />
           </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="z-10 flex-1 px-4 pb-32 max-w-5xl mx-auto w-full overflow-hidden flex flex-col">
        {view === 'board' && (
           <Board 
             tasks={currentViewTasks} 
             onMoveTask={moveTask} 
             onEditTask={openTaskDetail} // Generic click opens Detail
             isReadOnly={!isToday && selectedDate < todayStr}
             currentTime={currentTime}
           />
        )}

        {view === 'history' && (
          <div className="h-full">
            <HistoryView 
              stats={getHistoryStats()}
              onBack={() => setView('board')}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setView('board');
              }}
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar (Fixed) */}
      {view === 'board' && (
        <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-black via-black to-transparent pointer-events-none">
           <div className="max-w-md mx-auto pointer-events-auto flex items-end justify-between gap-4">
              
              {/* Prev Day */}
              <button 
                onClick={() => changeDate(-1)}
                className="w-14 h-14 bg-zinc-900/80 backdrop-blur-md border border-neon/30 hover:border-neon text-neon rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95"
              >
                <ChevronLeft size={28} />
              </button>

              {/* Create Task (Main) */}
              <button
                onClick={openCreateModal}
                className="w-20 h-20 bg-neon hover:brightness-110 text-black rounded-3xl shadow-neon flex items-center justify-center transition-all transform hover:-translate-y-2 active:scale-95 mb-2"
              >
                <Plus size={40} strokeWidth={2.5} />
              </button>

              {/* Next Day */}
              <button 
                onClick={() => changeDate(1)}
                className="w-14 h-14 bg-zinc-900/80 backdrop-blur-md border border-neon/30 hover:border-neon text-neon rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95"
              >
                <ChevronRight size={28} />
              </button>

           </div>
        </div>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialData={activeTask && isEditingMode ? activeTask : undefined}
        categories={profile.categories}
        defaultDate={selectedDate}
      />

      <TaskDetailModal
        task={activeTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={openEditFromDetail}
        onAction={handleTaskAction}
      />
      
      <NotificationPanel 
         isOpen={isNotifPanelOpen} 
         onClose={() => setIsNotifPanelOpen(false)}
         tasks={tasks}
         currentTime={currentTime}
         onTaskClick={(t) => { openTaskDetail(t); setIsNotifPanelOpen(false); }}
      />

      <SettingsModal 
         isOpen={isSettingsOpen}
         onClose={() => setIsSettingsOpen(false)}
         currentTheme={profile.theme || 'green'}
         onThemeChange={setTheme}
      />
    </div>
  );
};

export default App;
