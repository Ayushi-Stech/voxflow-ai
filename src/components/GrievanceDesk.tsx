import React, { useState } from 'react';
import { ShieldAlert, Plus, Trash2, CheckCircle, Clock, AlertTriangle, Building, Wrench, Siren, Laptop, FileText } from 'lucide-react';
import { TicketItem } from '../types';

interface GrievanceDeskProps {
  tickets: TicketItem[];
  onAddTicket: (ticket: Omit<TicketItem, 'id' | 'ticketNumber' | 'timestamp' | 'createdAt'>) => void;
  onUpdateStatus: (id: string, status: TicketItem['status']) => void;
  onDeleteTicket: (id: string) => void;
}

export const GrievanceDesk: React.FC<GrievanceDeskProps> = ({
  tickets,
  onAddTicket,
  onUpdateStatus,
  onDeleteTicket,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<TicketItem['department']>('IT Support');
  const [severity, setSeverity] = useState<TicketItem['severity']>('high');

  const openTickets = tickets.filter((t) => t.status !== 'Resolved').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slaHours = severity === 'critical' ? 2 : severity === 'high' ? 4 : 12;

    onAddTicket({
      title: title.trim(),
      description: description.trim() || 'Manual grievance reported',
      department,
      severity,
      status: 'Open',
      slaHours,
    });

    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  const getDeptIcon = (dept: TicketItem['department']) => {
    switch (dept) {
      case 'Facilities': return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
      case 'IT Support': return <Laptop className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Emergency': return <Siren className="w-3.5 h-3.5 text-rose-400 animate-pulse" />;
      case 'Campus Admin': return <Building className="w-3.5 h-3.5 text-violet-400" />;
      default: return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getSeverityBadge = (sev: TicketItem['severity']) => {
    switch (sev) {
      case 'critical':
        return <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">Critical</span>;
      case 'high':
        return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">High SLA</span>;
      case 'medium':
        return <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">Normal</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-800 text-slate-400">Low</span>;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between pb-3.5 border-b border-slate-800/80 gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-sm font-bold text-white whitespace-nowrap">
                Grievance Desk
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 whitespace-nowrap shrink-0">
                Action 3 • SLA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">Auto-Ticket & Emergency Triage</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition shrink-0 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-rose-400" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* SLA Triage Bar */}
      <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300 font-medium">Active Grievance Tickets:</span>
        </div>
        <span className="font-bold text-rose-400 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
          {openTickets} unresolved
        </span>
      </div>

      {/* Manual add input form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mt-3 p-3 rounded-xl bg-slate-900/95 border border-slate-700/80 space-y-2.5 animate-fadeIn">
          <div className="text-xs font-semibold text-slate-300">Raise Support Ticket</div>
          <input
            type="text"
            placeholder="Issue Title (e.g. Broken pipe in Hostel B)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-rose-500"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-rose-500"
            >
              <option value="IT Support">IT Support</option>
              <option value="Facilities">Facilities</option>
              <option value="Campus Admin">Campus Admin</option>
              <option value="Emergency">Emergency</option>
            </select>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-rose-500"
            >
              <option value="critical">Critical (1-2h SLA)</option>
              <option value="high">High (4h SLA)</option>
              <option value="medium">Medium (12h SLA)</option>
              <option value="low">Low (24h SLA)</option>
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
              className="px-3 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg"
            >
              Raise Ticket
            </button>
          </div>
        </form>
      )}

      {/* Tickets List */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[310px]">
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No grievance tickets filed. Say: "Burst water pipe create urgent facilities ticket"
          </div>
        ) : (
          tickets.map((t) => (
            <div
              key={t.id}
              className={`p-3 rounded-xl border transition ${
                t.status === 'Resolved'
                  ? 'bg-slate-950/40 border-slate-900/60 opacity-60'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-400">
                    {t.ticketNumber}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                    {getDeptIcon(t.department)}
                    {t.department}
                  </span>
                </div>
                {getSeverityBadge(t.severity)}
              </div>

              <div className="text-xs font-semibold text-slate-200 line-clamp-1 break-words">
                {t.title}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 break-words">
                {t.description}
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[11px] flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>SLA: {t.slaHours}h target</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={t.status}
                    onChange={(e) => onUpdateStatus(t.id, e.target.value as any)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-semibold focus:outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  <button
                    onClick={() => onDeleteTicket(t.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                    title="Delete ticket"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

