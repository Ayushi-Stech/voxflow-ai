import React from 'react';
import { Mic, Activity, Cpu, Volume2, Sparkles, Sliders, Download, Layers, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenDemo: () => void;
  onOpenArchitecture: () => void;
  onOpenSettings: () => void;
  onExport: () => void;
  hasGeminiKey: boolean;
  totalExpenses: number;
  openTasksCount: number;
  openTicketsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDemo,
  onOpenArchitecture,
  onOpenSettings,
  onExport,
  hasGeminiKey,
  totalExpenses,
  openTasksCount,
  openTicketsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 p-[1px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Mic className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                VoxFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-extrabold">AI</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Vocal Labs Round 2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Speak. Understand. Act. — Autonomous Voice Operations
            </p>
          </div>
        </div>

        {/* Live system state badges */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>STT Voice-In</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{hasGeminiKey ? 'Gemini 1.5 Flash' : 'Smart Semantic NLU'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            <Volume2 className="w-3.5 h-3.5 text-violet-400" />
            <span>TTS Voice-Out</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/30 transition shadow-sm shrink-0"
            title="Open 3-Minute Demo Script with PDF benchmark tests"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>3-Min Demo Script</span>
          </button>

          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition shrink-0"
            title="Inspect 4-step Voice AI architecture flow"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pipeline Flow</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition shrink-0"
            title="Export full ledger and tickets to CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition shrink-0"
            title="Configure Gemini API key & Voice settings"
          >
            <Sliders className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

