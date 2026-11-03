import React from 'react';
import { X, Cpu, CheckCircle, ArrowRight, BrainCircuit, Sparkles, Terminal } from 'lucide-react';
import { ParsedIntentResult } from '../types';

interface AiReasoningModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ParsedIntentResult | null;
}

export const AiReasoningModal: React.FC<AiReasoningModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel p-6 border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                AI Intent & Reasoning Engine
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {result.source === 'gemini' ? 'Gemini 1.5 Flash' : 'Smart Semantic NLU'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Step-by-step cognitive decomposition</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 overflow-y-auto space-y-4 pr-1 flex-1">
          {/* Ingested Voice */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              1. Ingested Acoustic Voice Input
            </span>
            <p className="mt-1 text-sm font-semibold text-emerald-400 break-words">
              "{result.rawTranscript}"
            </p>
          </div>

          {/* Reasoning Steps */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              2. Semantic Parsing & Entity Decomposition
            </span>
            <ul className="mt-2 space-y-1.5">
              {result.reasoning.map((step, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 break-words">
                  <span className="text-cyan-400 font-mono mt-0.5 shrink-0">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Executed Action Intents */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              3. Resolved Action Intents ({result.intents.length})
            </span>
            <div className="mt-2.5 space-y-2">
              {result.intents.map((intent, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/90 flex flex-col gap-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      Intent: {intent.type}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Confidence: {Math.round(intent.confidence * 100)}%
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 break-words">
                    {intent.summary}
                  </div>
                  <pre className="text-[10px] text-cyan-300/80 bg-slate-900 p-2 rounded overflow-x-auto font-mono whitespace-pre-wrap break-all">
                    {JSON.stringify(intent.entities, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Out Response */}
          <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-800/40">
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 4. Spoken SpeechSynthesis Response
            </span>
            <p className="mt-1 text-sm font-semibold text-violet-200 break-words">
              "{result.voiceResponse}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

