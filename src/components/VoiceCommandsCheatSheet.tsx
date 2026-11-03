import React from 'react';
import { Sparkles, Terminal, Volume2, Globe, Timer, Calculator, IndianRupee, Calendar, ShieldAlert } from 'lucide-react';

interface VoiceCommandsCheatSheetProps {
  onRunCommand: (cmd: string) => void;
}

export const VoiceCommandsCheatSheet: React.FC<VoiceCommandsCheatSheetProps> = ({
  onRunCommand,
}) => {
  const commands = [
    {
      category: 'Hackathon Slide 2',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
      text: 'Spent 250 rupees on lunch and remind me to submit the form on Friday.',
      label: 'Multi-Action Loop',
    },
    {
      category: 'Real World SLA',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
      text: 'Water pipe burst in Hostel Block B create urgent facilities ticket.',
      label: 'Ticket Triage',
    },
    {
      category: 'Live Voice Query',
      icon: <Volume2 className="w-3.5 h-3.5 text-cyan-400" />,
      text: 'What are my pending tasks?',
      label: 'Reads Aloud',
    },
    {
      category: 'Countdown Alarm',
      icon: <Timer className="w-3.5 h-3.5 text-emerald-400" />,
      text: 'Set a timer for 15 seconds',
      label: 'Starts Live Timer',
    },
    {
      category: 'Web Launcher',
      icon: <Globe className="w-3.5 h-3.5 text-blue-400" />,
      text: 'Search Google for Voice AI hackathon projects',
      label: 'Opens Google',
    },
    {
      category: 'Instant Math',
      icon: <Calculator className="w-3.5 h-3.5 text-violet-400" />,
      text: 'What is 4500 divided by 12?',
      label: 'Math Engine',
    },
    {
      category: 'Budget Query',
      icon: <IndianRupee className="w-3.5 h-3.5 text-amber-400" />,
      text: 'How much have I spent so far?',
      label: 'Calculates Total',
    },
    {
      category: 'Clock & Date',
      icon: <Calendar className="w-3.5 h-3.5 text-cyan-400" />,
      text: 'What is the current time?',
      label: 'Live Clock',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-6">
      <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Real Spoken Voice Commands Supported
            </span>
          </div>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            Speak into your mic or tap any command below
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {commands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => onRunCommand(cmd.text)}
              className="group text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/70 hover:border-slate-700 transition flex flex-col justify-between"
              title={`Say: "${cmd.text}"`}
            >
              <div className="flex items-center justify-between w-full mb-1 gap-1">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 min-w-0 truncate">
                  {cmd.icon}
                  <span className="truncate">{cmd.category}</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 group-hover:text-emerald-300 shrink-0">
                  {cmd.label}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-200 line-clamp-2 mt-1 break-words">
                "{cmd.text}"
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

