import React, { useState } from 'react';
import { Mail, Send, ExternalLink, Trash2, CheckCircle2, Plus } from 'lucide-react';
import { EmailItem } from '../types';

interface EmailDispatcherProps {
  emails: EmailItem[];
  onAddEmail: (email: Omit<EmailItem, 'id' | 'timestamp'>) => void;
  onSendEmail: (id: string) => void;
  onDeleteEmail: (id: string) => void;
}

export const EmailDispatcher: React.FC<EmailDispatcherProps> = ({
  emails,
  onAddEmail,
  onSendEmail,
  onDeleteEmail,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !subject.trim()) return;

    onAddEmail({
      recipient: recipient.trim(),
      subject: subject.trim(),
      body: body.trim() || 'Dispatched via VoxFlow Voice AI Hub.',
      status: 'Sent',
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setRecipient('');
    setSubject('');
    setBody('');
    setShowAddForm(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between pb-3.5 border-b border-slate-800/80 gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="w-4 h-4 text-violet-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-sm font-bold text-white whitespace-nowrap">
                Dispatch Center
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-violet-500/10 text-violet-300 border border-violet-500/30 whitespace-nowrap shrink-0">
                Action 4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">Voice-Triggered Email Dispatch</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition shrink-0 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-violet-400" />
          <span>New Dispatch</span>
        </button>
      </div>

      {/* Manual add input form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mt-3 p-3 rounded-xl bg-slate-900/95 border border-slate-700/80 space-y-2.5 animate-fadeIn">
          <div className="text-xs font-semibold text-slate-300">Compose Dispatch</div>
          <input
            type="email"
            placeholder="Recipient email (e.g. team@company.com)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-violet-500"
            required
          />
          <input
            type="text"
            placeholder="Subject line"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-violet-500"
            required
          />
          <textarea
            placeholder="Email body message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-violet-500"
          />
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
              className="px-3 py-1 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg"
            >
              Dispatch Mail
            </button>
          </div>
        </form>
      )}

      {/* Emails List */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[310px]">
        {emails.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No outgoing emails dispatched yet. Say: "Send email to team@vocallabs.io about project"
          </div>
        ) : (
          emails.map((mail) => (
            <div
              key={mail.id}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 truncate">
                  <Mail className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span className="truncate">{mail.recipient}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {mail.status}
                </span>
              </div>

              <div className="text-xs font-medium text-slate-300 break-words line-clamp-1">
                {mail.subject}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 break-words">
                {mail.body}
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[11px] flex-wrap gap-2">
                <span className="text-slate-500 text-[10px] shrink-0">
                  {mail.sentAt ? `Dispatched at ${mail.sentAt}` : 'Ready to send'}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`mailto:${mail.recipient}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`}
                    className="flex items-center gap-1 text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition"
                  >
                    <span>Open in Mail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => onDeleteEmail(mail.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                    title="Delete mail"
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

