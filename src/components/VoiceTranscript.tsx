import React, { useState } from 'react';
import { Send, Sparkles, MessageSquare, ArrowRight, CornerDownLeft } from 'lucide-react';

interface VoiceTranscriptProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  onExecuteCommand: (text: string) => void;
  lastSpokenResponse: string;
}

export const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({
  transcript,
  interimTranscript,
  isListening,
  onExecuteCommand,
  lastSpokenResponse,
}) => {
  const [manualText, setManualText] = useState('');

  const samplePrompts = [
    {
      label: 'PDF Example',
      text: 'Spent 250 rupees on lunch and remind me to submit the form on Friday.',
      tag: 'Multi-Action',
    },
    {
      label: 'Grievance Desk',
      text: 'Water pipe burst in Hostel Block B create urgent facilities ticket.',
      tag: 'Real World',
    },
    {
      label: 'Email & Travel',
      text: 'Spent 850 on Uber cab and send email to team@vocallabs.io regarding pitch deck.',
      tag: 'Ops Flow',
    },
    {
      label: 'Tech & Exam',
      text: 'Spent 1499 on GitHub copilot and remind me to practice viva oral exam tomorrow.',
      tag: 'Learning',
    },
  ];

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    onExecuteCommand(manualText.trim());
    setManualText('');
  };

  const displayText = interimTranscript
    ? `${transcript} ${interimTranscript}`.trim()
    : transcript || '';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-2 mb-6">
      {/* Live Speech Recognition Display Card */}
      <div className="relative rounded-2xl glass-panel p-4 sm:p-5 shadow-xl border border-slate-800/80 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Live Voice Transcript
            </span>
          </div>
          {isListening && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Recording Active
            </span>
          )}
        </div>

        {/* Dynamic Speech Box */}
        <div className="min-h-[58px] flex items-center bg-slate-950/60 rounded-xl px-4 py-3 border border-slate-800/60 overflow-hidden">
          {displayText ? (
            <p className="text-base sm:text-lg font-medium text-slate-100 break-words w-full">
              <span>{transcript}</span>
              {interimTranscript && (
                <span className="text-cyan-400/80 italic ml-1">
                  {interimTranscript}...
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm text-slate-500 italic flex items-center gap-2">
              <span>Click the microphone above and speak your voice command...</span>
            </p>
          )}
        </div>

        {/* Last AI Voice Confirmation Ticker */}
        {lastSpokenResponse && (
          <div className="mt-3 flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-violet-950/30 border border-violet-800/30 text-xs sm:text-sm text-violet-200 overflow-hidden">
            <span className="font-semibold text-violet-400 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> AI Spoke:
            </span>
            <span className="font-medium italic break-words flex-1">"{lastSpokenResponse}"</span>
          </div>
        )}

        {/* Manual Keyboard Input fallback */}
        <form onSubmit={handleManualSubmit} className="mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Or type voice command manually here (e.g. 'Spent 250 on lunch and remind me to submit form on Friday')..."
              className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-900/90 border border-slate-800 focus:border-emerald-500/60 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition"
            />
          </div>
          <button
            type="submit"
            disabled={!manualText.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-slate-950 transition shadow-sm shrink-0"
          >
            <span>Execute</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Voice Demo Presets */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Quick Voice Test Presets:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onExecuteCommand(p.text)}
              className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700 text-slate-300 hover:text-white transition"
              title={`Simulate voice input: "${p.text}"`}
            >
              <span className="px-1 py-0.2 rounded text-[10px] font-semibold bg-slate-800 text-cyan-400 group-hover:bg-slate-700">
                {p.tag}
              </span>
              <span className="truncate max-w-[190px] sm:max-w-[240px] text-left">
                {p.text}
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

