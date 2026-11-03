import React from 'react';
import { X, Play, Sparkles, CheckCircle2, Clock, Volume2, ShieldCheck, ArrowRight } from 'lucide-react';

interface DemoPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunScenario: (commandText: string) => void;
}

export const DemoPresetsModal: React.FC<DemoPresetsModalProps> = ({
  isOpen,
  onClose,
  onRunScenario,
}) => {
  if (!isOpen) return null;

  const scenarios = [
    {
      time: '0:00 - 0:45',
      title: 'Benchmark Scenario: Multi-Action Compound Intent',
      track: 'Voice to Action (PDF Slide 2 Benchmark)',
      description: 'Tests simultaneous intent parsing: logs an expense, calculates remaining budget, and schedules a calendar deadline with due date extraction.',
      command: 'Spent 250 rupees on lunch and remind me to submit the form on Friday.',
      expected: 'Logs ₹250 under Food, updates ledger bar, and creates task "Submit the form" due Friday.',
      accent: 'border-emerald-500/30 bg-emerald-950/10 text-emerald-400',
    },
    {
      time: '0:45 - 1:30',
      title: 'Real-World Grievance Desk & Auto-Ticket Triage',
      track: 'Real World Track (PDF Slide 3)',
      description: 'Extracts critical severity, maps to Facilities department, generates a unique ticket ID #VOX-XXXX with a 2-hour SLA target.',
      command: 'Water pipe burst in Hostel Block B create urgent facilities ticket.',
      expected: 'Auto-generates urgent Facilities ticket with 2h SLA and logs severity triage.',
      accent: 'border-rose-500/30 bg-rose-950/10 text-rose-400',
    },
    {
      time: '1:30 - 2:15',
      title: 'Enterprise Dispatch & Calendar Sync Flow',
      track: 'Meeting & Action Items Flow (PDF Slide 3)',
      description: 'Prepares an automated dispatch email for stakeholders and syncs task with Google Calendar & iCal export.',
      command: 'Spent 850 on Uber cab and send email to team@vocallabs.io regarding pitch deck.',
      expected: 'Logs ₹850 under Travel and formats email dispatch to team@vocallabs.io.',
      accent: 'border-cyan-500/30 bg-cyan-950/10 text-cyan-400',
    },
    {
      time: '2:15 - 3:00',
      title: 'Tech Operations & Exam Prep (Triple Action)',
      track: 'Learning & Coding Buddy (PDF Slide 3)',
      description: 'Demonstrates maximum cognitive complexity: IT tech expense + exam prep reminder + immediate voice confirmation.',
      command: 'Spent 1499 on GitHub copilot and remind me to practice viva oral exam tomorrow.',
      expected: 'Logs ₹1499 under Tech category and sets tomorrow exam preparation reminder.',
      accent: 'border-violet-500/30 bg-violet-950/10 text-violet-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl glass-panel p-6 border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                3-Minute Hackathon Demo Script
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Judges Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Optimized presentation flow covering all 4 hackathon tracks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Pitch Tips */}
        <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Rule:</strong> Max 3-minute demo time. Click <strong>"Execute Scenario"</strong> to trigger the complete Voice-In ➔ AI Understands ➔ Real Action ➔ Voice-Out loop!
            </span>
          </div>
        </div>

        {/* Scenarios List */}
        <div className="mt-4 overflow-y-auto space-y-3.5 pr-1 flex-1">
          {scenarios.map((sc, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${sc.accent} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-slate-900/60`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                    {sc.time}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {sc.title}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-400">
                  {sc.track}
                </div>
                <div className="p-2 rounded-lg bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800/80 break-words">
                  "{sc.command}"
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 break-words">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{sc.expected}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onRunScenario(sc.command);
                  onClose();
                }}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Scenario</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Covers Track 1 (Voice to action) & Track 2 (Real world)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

