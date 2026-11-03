import React from 'react';
import { X, Mic, BrainCircuit, PlayCircle, Volume2, ArrowRight, CheckCircle2, Database, ShieldAlert, Calendar, Mail, IndianRupee } from 'lucide-react';

interface SystemArchitectureProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemArchitecture: React.FC<SystemArchitectureProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl glass-panel p-6 border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              System Architecture & Pipeline Flow
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                4-Step Hackathon Loop
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              End-to-End Voice In ➔ AI Brain ➔ Real Action ➔ Voice Out Execution Engine
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Diagram Flow */}
        <div className="mt-5 overflow-y-auto space-y-6 pr-1 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    STEP 01
                  </span>
                  <Mic className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Voice In</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  High-fidelity capture using Web Speech API with live audio waveform FFT spectrum analyser.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-emerald-300/80 bg-slate-950 p-2 rounded border border-slate-800 font-mono">
                webkitSpeechRecognition + Web Audio API
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    STEP 02
                  </span>
                  <BrainCircuit className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="text-sm font-bold text-white">AI Understands</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Gemini 1.5 Flash + Autonomous Semantic NLU. Deconstructs compound multi-clause sentences.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-cyan-300/80 bg-slate-950 p-2 rounded border border-slate-800 font-mono">
                Multi-Intent & Entity Extraction
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    STEP 03
                  </span>
                  <PlayCircle className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Real Action</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Executes deterministic operations: ledger, SLA ticketing, calendar sync, and mail dispatch.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-amber-300/80 bg-slate-950 p-2 rounded border border-slate-800 font-mono">
                Visible Concrete Actions
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-violet-500/30 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    STEP 04
                  </span>
                  <Volume2 className="w-4 h-4 text-violet-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Voice Out</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Synthesizes dynamic conversational vocal confirmation back to user with zero latency.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-violet-300/80 bg-slate-950 p-2 rounded border border-slate-800 font-mono">
                SpeechSynthesis Audio Engine
              </div>
            </div>
          </div>

          {/* Real Actions Matrix */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Integrated Real-World Action Engines:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <IndianRupee className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-200">Expense Ledger</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Budget bars, category classification, CSV export.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-200">Action Scheduler</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Google Calendar links & .ics file download.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-200">Grievance Desk</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Ticket #VOX auto-routing & SLA monitoring.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-200">Dispatch Center</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Structured email composer & mailto trigger.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl transition"
          >
            Close Flow
          </button>
        </div>
      </div>
    </div>
  );
};

