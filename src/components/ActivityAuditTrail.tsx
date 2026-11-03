import React from 'react';
import { Activity, Clock, IndianRupee, Calendar, ShieldAlert, Mail, Terminal } from 'lucide-react';
import { ActionLog } from '../types';

interface ActivityAuditTrailProps {
  logs: ActionLog[];
  onClearLogs: () => void;
}

export const ActivityAuditTrail: React.FC<ActivityAuditTrailProps> = ({
  logs,
  onClearLogs,
}) => {
  const getActionBadge = (type: ActionLog['actionType']) => {
    switch (type) {
      case 'EXPENSE':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <IndianRupee className="w-2.5 h-2.5" /> EXPENSE
          </span>
        );
      case 'TASK':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Calendar className="w-2.5 h-2.5" /> REMINDER
          </span>
        );
      case 'TICKET':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-2.5 h-2.5" /> GRIEVANCE
          </span>
        );
      case 'EMAIL':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Mail className="w-2.5 h-2.5" /> DISPATCH
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300">
            ACTION
          </span>
        );
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between pb-3.5 border-b border-slate-800/80 gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-sm font-bold text-white whitespace-nowrap">
                Audit Trail
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 whitespace-nowrap shrink-0">
                Live Feed
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">Deterministic Real-World Execution Stream</p>
          </div>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="text-xs text-slate-500 hover:text-slate-300 transition shrink-0 whitespace-nowrap px-2 py-1 rounded hover:bg-slate-900"
          >
            Clear Log
          </button>
        )}
      </div>

      {/* Logs feed */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1 max-h-[310px]">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No system actions recorded yet. Speak a voice command to start!
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  {getActionBadge(log.actionType)}
                  <span className="font-semibold text-slate-200">
                    {log.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {log.timeString}
                </span>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed">
                {log.summary}
              </p>

              {log.details && Object.keys(log.details).length > 0 && (
                <div className="mt-2 p-2 rounded-lg bg-slate-950 font-mono text-[10px] text-emerald-400/90 border border-slate-800/60 overflow-x-auto">
                  {JSON.stringify(log.details)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

