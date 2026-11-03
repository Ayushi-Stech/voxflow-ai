import React, { useEffect } from 'react';
import { Timer, X, Play, Pause, Bell } from 'lucide-react';
import { ActiveTimer } from '../types';

interface ActiveTimerWidgetProps {
  timer: ActiveTimer | null;
  onDismiss: () => void;
  onTogglePause: () => void;
}

export const ActiveTimerWidget: React.FC<ActiveTimerWidgetProps> = ({
  timer,
  onDismiss,
  onTogglePause,
}) => {
  if (!timer) return null;

  const minutes = Math.floor(timer.remainingSeconds / 60);
  const seconds = timer.remainingSeconds % 60;
  const progressPercent = Math.max(
    0,
    Math.min(100, (timer.remainingSeconds / timer.totalSeconds) * 100)
  );

  const isFinished = timer.remainingSeconds <= 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-4 animate-fadeIn">
      <div
        className={`p-4 rounded-2xl border transition-all shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isFinished
            ? 'bg-rose-950/80 border-rose-500 text-rose-200 animate-pulse'
            : 'bg-slate-900/90 border-cyan-500/50 text-cyan-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isFinished ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/20 text-cyan-400'
            }`}
          >
            {isFinished ? (
              <Bell className="w-5 h-5 animate-bounce" />
            ) : (
              <Timer className="w-5 h-5 animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isFinished ? 'Timer Expired!' : timer.label}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Live Voice Action
              </span>
            </div>
            <div className="text-2xl font-extrabold font-mono tracking-tight text-white mt-0.5">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Progress bar in the center */}
        <div className="w-full sm:flex-1 sm:max-w-xs sm:mx-4">
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isFinished ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {!isFinished && (
            <button
              onClick={onTogglePause}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              title={timer.isRunning ? 'Pause timer' : 'Resume timer'}
            >
              {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={onDismiss}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition"
            title="Dismiss timer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

