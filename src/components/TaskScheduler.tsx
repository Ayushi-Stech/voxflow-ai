import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Plus, Trash2, CalendarPlus, Download, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskItem } from '../types';
import { CalendarService } from '../services/calendarService';

interface TaskSchedulerProps {
  tasks: TaskItem[];
  onAddTask: (task: Omit<TaskItem, 'id' | 'timestamp'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskScheduler: React.FC<TaskSchedulerProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('Tomorrow');
  const [priority, setPriority] = useState<TaskItem['priority']>('medium');

  const pendingCount = tasks.filter((t) => !t.completed).length;

  const handleToggle = (id: string, currentState: boolean) => {
    onToggleTask(id);
    if (!currentState) {
      // Fire celebration confetti when completing a task!
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#6366f1'],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      dueDate,
      priority,
      completed: false,
    });

    setTitle('');
    setShowAddForm(false);
  };

  const getPriorityBadge = (p: TaskItem['priority']) => {
    switch (p) {
      case 'urgent':
        return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">Urgent</span>;
      case 'high':
        return <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">High</span>;
      case 'medium':
        return <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Medium</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-800 text-slate-400">Low</span>;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between pb-3.5 border-b border-slate-800/80 gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-sm font-bold text-white whitespace-nowrap">
                Task & Reminder Desk
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 whitespace-nowrap shrink-0">
                Action 2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">Voice-Scheduled Deadlines & Cal Sync</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition shrink-0 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span>New Task</span>
        </button>
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-medium">Pending Action Items:</span>
        </div>
        <span className="font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          {pendingCount} remaining
        </span>
      </div>

      {/* Manual add input form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mt-3 p-3 rounded-xl bg-slate-900/95 border border-slate-700/80 space-y-2.5 animate-fadeIn">
          <div className="text-xs font-semibold text-slate-300">Schedule Task Item</div>
          <input
            type="text"
            placeholder="Task title (e.g. Submit project form)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Due date (e.g. Friday, 5 PM)"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg"
            >
              Create Task
            </button>
          </div>
        </form>
      )}

      {/* Tasks List */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[310px]">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No tasks scheduled. Say: "Remind me to submit the form on Friday"
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-start justify-between p-3 rounded-xl border transition ${
                task.completed
                  ? 'bg-slate-950/40 border-slate-900/60 opacity-60'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <button
                  onClick={() => handleToggle(task.id, task.completed)}
                  className="mt-0.5 text-slate-500 hover:text-emerald-400 transition"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div
                    className={`text-xs font-semibold text-slate-200 break-words ${
                      task.completed ? 'line-through text-slate-500' : ''
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-300/90 font-medium">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {task.dueDate}
                    </span>
                    <span>•</span>
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              </div>

              {/* Action buttons: Google Calendar & .ics export */}
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <a
                  href={CalendarService.getGoogleCalendarUrl(task)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition"
                  title="Add to Google Calendar"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => CalendarService.downloadICS(task)}
                  className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition"
                  title="Download .ics Calendar File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

