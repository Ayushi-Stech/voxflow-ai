import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Mic,
  BrainCircuit,
  Sparkles,
  Layers,
  Sliders,
  Download,
  IndianRupee,
  Calendar,
  ShieldAlert,
  Mail,
  Terminal,
  Activity,
  CheckCircle,
  AlertTriangle,
  Radio,
  Globe,
  ExternalLink,
  X,
} from 'lucide-react';

import {
  ExpenseItem,
  TaskItem,
  TicketItem,
  EmailItem,
  ActionLog,
  ParsedIntentResult,
  ActiveTimer,
} from './types';

import { speechService } from './services/speechRecognition';
import { ttsService } from './services/speechSynthesis';
import { soundEffects } from './services/audioFeedback';
import { NLUEngine } from './services/nluEngine';
import { StorageService } from './services/storageService';

import { Header } from './components/Header';
import { VoiceOrb } from './components/VoiceOrb';
import { VoiceTranscript } from './components/VoiceTranscript';
import { ExpenseTracker } from './components/ExpenseTracker';
import { TaskScheduler } from './components/TaskScheduler';
import { GrievanceDesk } from './components/GrievanceDesk';
import { EmailDispatcher } from './components/EmailDispatcher';
import { ActivityAuditTrail } from './components/ActivityAuditTrail';
import { AiReasoningModal } from './components/AiReasoningModal';
import { DemoPresetsModal } from './components/DemoPresetsModal';
import { SystemArchitecture } from './components/SystemArchitecture';
import { SettingsModal } from './components/SettingsModal';
import { ActiveTimerWidget } from './components/ActiveTimerWidget';
import { VoiceCommandsCheatSheet } from './components/VoiceCommandsCheatSheet';

export const App: React.FC = () => {
  // Main Data States loaded from Storage
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => StorageService.loadExpenses());
  const [tasks, setTasks] = useState<TaskItem[]>(() => StorageService.loadTasks());
  const [tickets, setTickets] = useState<TicketItem[]>(() => StorageService.loadTickets());
  const [emails, setEmails] = useState<EmailItem[]>(() => StorageService.loadEmails());
  const [logs, setLogs] = useState<ActionLog[]>(() => StorageService.loadLogs());

  // Configuration States
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => StorageService.loadApiKey());
  const [monthlyBudget, setMonthlyBudget] = useState<number>(25000);

  // Live Timer State
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);

  // Live Web Navigation Toast State
  const [activeWebNavToast, setActiveWebNavToast] = useState<{ url: string; target: string } | null>(null);

  // Voice Interaction States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [continuousMode, setContinuousMode] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [statusText, setStatusText] = useState<string>('Ready for voice command');
  const [lastSpokenResponse, setLastSpokenResponse] = useState<string>('');

  // Modals & Inspection States
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isReasoningOpen, setIsReasoningOpen] = useState<boolean>(false);
  const [lastParsedResult, setLastParsedResult] = useState<ParsedIntentResult | null>(null);

  // Active View Filter
  const [activeTab, setActiveTab] = useState<'ALL' | 'EXPENSE' | 'TASK' | 'TICKET' | 'EMAIL' | 'AUDIT'>('ALL');

  const continuousRef = useRef(continuousMode);
  continuousRef.current = continuousMode;

  // Sync to localStorage
  useEffect(() => { StorageService.saveExpenses(expenses); }, [expenses]);
  useEffect(() => { StorageService.saveTasks(tasks); }, [tasks]);
  useEffect(() => { StorageService.saveTickets(tickets); }, [tickets]);
  useEffect(() => { StorageService.saveEmails(emails); }, [emails]);
  useEffect(() => { StorageService.saveLogs(logs); }, [logs]);

  // Live Countdown Timer Interval
  useEffect(() => {
    if (!activeTimer || !activeTimer.isRunning || activeTimer.remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setActiveTimer((prev) => {
        if (!prev || !prev.isRunning) return prev;
        if (prev.remainingSeconds <= 1) {
          clearInterval(interval);
          soundEffects.playAlarm();
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
          ttsService.speak(`Your timer for ${prev.label} has finished!`);
          return { ...prev, remainingSeconds: 0, isRunning: false };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const handleExportCSV = useCallback(() => {
    StorageService.exportCSV(expenses, tickets);
  }, [expenses, tickets]);

  // Execute Real Voice Command Pipeline
  const handleExecuteCommand = useCallback(
    async (commandText: string) => {
      const trimmed = commandText.trim();
      if (!trimmed) return;

      setIsProcessing(true);
      setStatusText('AI analyzing intent & executing real action...');
      setTranscript(trimmed);
      setInterimTranscript('');

      try {
        // Step 2: AI Understands (with real context)
        const result = await NLUEngine.processTranscript(trimmed, geminiApiKey, {
          expenses,
          tasks,
          tickets,
        });

        setLastParsedResult(result);

        const newLogs: ActionLog[] = [];
        let newExpenses = [...expenses];
        let newTasks = [...tasks];
        let newTickets = [...tickets];
        let newEmails = [...emails];

        // Step 3: Real Action Execution
        for (const intent of result.intents) {
          const timestamp = Date.now();
          const timeString = 'Just now';

          if (intent.type === 'EXPENSE') {
            const expItem: ExpenseItem = {
              id: `exp-${timestamp}-${Math.random().toString(36).substr(2, 4)}`,
              amount: intent.entities.amount || 100,
              currency: intent.entities.currency || 'INR',
              category: intent.entities.category || 'General',
              description: intent.entities.description || 'Voice expense',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              timestamp,
            };
            newExpenses = [expItem, ...newExpenses];
            newLogs.push({
              id: `log-${timestamp}`,
              actionType: 'EXPENSE',
              title: `Expense Logged: ₹${expItem.amount}`,
              summary: intent.summary,
              details: intent.entities,
              timestamp,
              timeString,
            });
          } else if (intent.type === 'TASK') {
            const taskItem: TaskItem = {
              id: `task-${timestamp}-${Math.random().toString(36).substr(2, 4)}`,
              title: intent.entities.title || 'Scheduled Action',
              dueDate: intent.entities.dueDate || 'Today',
              dueTime: intent.entities.dueTime,
              priority: intent.entities.priority || 'medium',
              completed: false,
              timestamp,
            };
            newTasks = [taskItem, ...newTasks];
            newLogs.push({
              id: `log-${timestamp}`,
              actionType: 'TASK',
              title: `Task Scheduled: ${taskItem.title}`,
              summary: intent.summary,
              details: intent.entities,
              timestamp,
              timeString,
            });
          } else if (intent.type === 'TICKET') {
            const tickNum = `VOX-${Math.floor(1000 + Math.random() * 9000)}`;
            const ticketItem: TicketItem = {
              id: `tick-${timestamp}-${Math.random().toString(36).substr(2, 4)}`,
              ticketNumber: tickNum,
              title: intent.entities.title || 'Reported Grievance',
              description: intent.entities.description || 'Reported via Voice AI desk',
              department: intent.entities.department || 'IT Support',
              severity: intent.entities.severity || 'high',
              status: 'Open',
              slaHours: intent.entities.slaHours || 4,
              createdAt: 'Just now',
              timestamp,
            };
            newTickets = [ticketItem, ...newTickets];
            newLogs.push({
              id: `log-${timestamp}`,
              actionType: 'TICKET',
              title: `Ticket Created: #${tickNum}`,
              summary: intent.summary,
              details: intent.entities,
              timestamp,
              timeString,
            });
          } else if (intent.type === 'EMAIL') {
            const emailItem: EmailItem = {
              id: `mail-${timestamp}-${Math.random().toString(36).substr(2, 4)}`,
              recipient: intent.entities.recipient || 'team@vocallabs.io',
              subject: intent.entities.subject || 'Voice AI Notification',
              body: intent.entities.body || 'Dispatched via VoxFlow AI Hub.',
              status: 'Sent',
              sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              timestamp,
            };
            newEmails = [emailItem, ...newEmails];
            newLogs.push({
              id: `log-${timestamp}`,
              actionType: 'EMAIL',
              title: `Email Dispatched: ${emailItem.recipient}`,
              summary: intent.summary,
              details: intent.entities,
              timestamp,
              timeString,
            });
          } else if (intent.type === 'TIMER') {
            // Real countdown timer action!
            const totalSec = intent.entities.totalSeconds || 60;
            setActiveTimer({
              id: `timer-${timestamp}`,
              label: intent.entities.label || 'Timer',
              totalSeconds: totalSec,
              remainingSeconds: totalSec,
              isRunning: true,
              createdAt: timestamp,
            });
            newLogs.push({
              id: `log-${timestamp}`,
              actionType: 'TIMER',
              title: `Timer Started: ${totalSec}s`,
              summary: intent.summary,
              details: intent.entities,
              timestamp,
              timeString,
            });
          } else if (intent.type === 'WEB_NAV') {
            // Real web navigation action!
            const url = intent.entities.url;
            const target = intent.entities.target || 'Web';
            if (url) {
              setActiveWebNavToast({ url, target });
              try {
                window.open(url, '_blank', 'noopener,noreferrer');
              } catch (e) {}
            }
            newLogs.push({
              id: `log-${timestamp}`,
              actionType: 'WEB_NAV',
              title: `Opened: ${target}`,
              summary: intent.summary,
              details: intent.entities,
              timestamp,
              timeString,
            });
          } else if (intent.type === 'SYSTEM_CONTROL') {
            if (intent.entities.action === 'EXPORT_CSV') {
              handleExportCSV();
            }
            newLogs.push({
              id: `log-${timestamp}`,
              actionType: 'SYSTEM_CONTROL',
              title: 'System Control Executed',
              summary: intent.summary,
              details: intent.entities,
              timestamp,
              timeString,
            });
          } else if (intent.type === 'CALCULATE' || intent.type === 'QUERY' || intent.type === 'CONVERSATION') {
            newLogs.push({
              id: `log-${timestamp}`,
              actionType: intent.type,
              title: intent.summary,
              summary: result.voiceResponse,
              details: intent.entities,
              timestamp,
              timeString,
            });
          }
        }

        // Apply state updates
        setExpenses(newExpenses);
        setTasks(newTasks);
        setTickets(newTickets);
        setEmails(newEmails);
        if (newLogs.length > 0) {
          setLogs((prev) => [...newLogs, ...prev]);
        }

        // Procedural Audio
        soundEffects.playSuccess();
        if (result.intents.some((i) => i.type === 'EXPENSE' || i.type === 'TICKET' || i.type === 'TASK')) {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6'],
          });
        }

        // Step 4: Voice Out (Text-to-Speech)
        setLastSpokenResponse(result.voiceResponse);
        setStatusText('Speaking response...');
        setIsSpeaking(true);

        await ttsService.speak(result.voiceResponse, {
          onStart: () => setIsSpeaking(true),
          onEnd: () => {
            setIsSpeaking(false);
            setStatusText(continuousRef.current ? 'Listening for next command...' : 'Ready for next command');
            // If continuous hands-free mode is enabled, immediately listen for the next command!
            if (continuousRef.current) {
              speechService.startListening();
            }
          },
          onError: () => {
            setIsSpeaking(false);
            setStatusText('Ready for next command');
          },
        });
      } catch (err: any) {
        console.error('Command processing error:', err);
        setStatusText(`Error: ${err.message || 'Failed to process'}`);
      } finally {
        setIsProcessing(false);
      }
    },
    [geminiApiKey, expenses, tasks, tickets, emails, handleExportCSV]
  );

  // Setup Web Speech Recognition callbacks
  useEffect(() => {
    speechService.setCallbacks({
      onStart: () => {
        setIsListening(true);
        setStatusText('Listening... Speak your command clearly.');
        soundEffects.playMicStart();
      },
      onResult: (text, isFinal) => {
        if (isFinal) {
          setTranscript(text);
          setInterimTranscript('');
          handleExecuteCommand(text);
        } else {
          setInterimTranscript(text);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setStatusText(`Microphone: ${err}`);
      },
      onEnd: () => {
        setIsListening(false);
        soundEffects.playMicStop();
      },
    });
  }, [handleExecuteCommand]);

  // Toggle Microphone
  const handleToggleListen = async () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      if (isSpeaking) {
        ttsService.stop();
        setIsSpeaking(false);
      }
      setTranscript('');
      setInterimTranscript('');
      await speechService.startListening();
    }
  };

  const handleAddExpense = (expense: Omit<ExpenseItem, 'id' | 'timestamp'>) => {
    const timestamp = Date.now();
    const item: ExpenseItem = { ...expense, id: `exp-${timestamp}`, timestamp };
    setExpenses([item, ...expenses]);
    soundEffects.playActionPulse();
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleAddTask = (task: Omit<TaskItem, 'id' | 'timestamp'>) => {
    const timestamp = Date.now();
    const item: TaskItem = { ...task, id: `task-${timestamp}`, timestamp };
    setTasks([item, ...tasks]);
    soundEffects.playActionPulse();
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleAddTicket = (ticket: Omit<TicketItem, 'id' | 'ticketNumber' | 'timestamp' | 'createdAt'>) => {
    const timestamp = Date.now();
    const item: TicketItem = {
      ...ticket,
      id: `tick-${timestamp}`,
      ticketNumber: `VOX-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Just now',
      timestamp,
    };
    setTickets([item, ...tickets]);
    soundEffects.playActionPulse();
  };

  const handleUpdateTicketStatus = (id: string, status: TicketItem['status']) => {
    setTickets(tickets.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  const handleAddEmail = (email: Omit<EmailItem, 'id' | 'timestamp'>) => {
    const timestamp = Date.now();
    const item: EmailItem = { ...email, id: `mail-${timestamp}`, timestamp };
    setEmails([item, ...emails]);
    soundEffects.playActionPulse();
  };

  const handleDeleteEmail = (id: string) => {
    setEmails(emails.filter((m) => m.id !== id));
  };

  const openTasksCount = tasks.filter((t) => !t.completed).length;
  const openTicketsCount = tickets.filter((t) => t.status !== 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Header
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExport={handleExportCSV}
        hasGeminiKey={Boolean(geminiApiKey)}
        totalExpenses={expenses.reduce((s, e) => s + e.amount, 0)}
        openTasksCount={openTasksCount}
        openTicketsCount={openTicketsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col">
        {/* Hands-Free Live Mode Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2.5 px-4 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-3 gap-2.5">
          <div className="flex items-center gap-2 text-xs">
            <Radio className={`w-3.5 h-3.5 ${continuousMode ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-slate-300 font-medium">Hands-Free Conversation Mode:</span>
            <span className={`font-semibold ${continuousMode ? 'text-emerald-400' : 'text-slate-500'}`}>
              {continuousMode ? 'Active (Auto-listens after replying)' : 'Push-to-Speak'}
            </span>
          </div>
          <button
            onClick={() => {
              const next = !continuousMode;
              setContinuousMode(next);
              speechService.setContinuousMode(next);
              if (next && !isListening) {
                speechService.startListening();
              }
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
              continuousMode
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {continuousMode ? 'Disable Hands-Free' : 'Enable Hands-Free'}
          </button>
        </div>

        {/* Live Active Countdown Timer Widget */}
        <ActiveTimerWidget
          timer={activeTimer}
          onDismiss={() => setActiveTimer(null)}
          onTogglePause={() => {
            if (activeTimer) {
              setActiveTimer({ ...activeTimer, isRunning: !activeTimer.isRunning });
            }
          }}
        />

        {/* Live Web Navigation Toast Widget */}
        {activeWebNavToast && (
          <div className="w-full max-w-4xl mx-auto px-4 mb-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/90 via-slate-900/90 to-cyan-950/90 border border-cyan-500/50 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Globe className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Opening {activeWebNavToast.target}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Web Launch
                    </span>
                  </div>
                  <p className="text-xs text-cyan-200 mt-0.5 break-all">
                    Destination: <span className="font-mono text-[11px] underline">{activeWebNavToast.url}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                <a
                  href={activeWebNavToast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <span>Open Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setActiveWebNavToast(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section with Interactive Voice Orb */}
        <section className="flex flex-col items-center justify-center">
          <VoiceOrb
            isListening={isListening}
            isProcessing={isProcessing}
            isSpeaking={isSpeaking}
            onToggleListen={handleToggleListen}
            statusText={statusText}
          />

          {/* Real-time Voice Transcript & Fallback Controls */}
          <VoiceTranscript
            transcript={transcript}
            interimTranscript={interimTranscript}
            isListening={isListening}
            onExecuteCommand={handleExecuteCommand}
            lastSpokenResponse={lastSpokenResponse}
          />
        </section>

        {/* Real Voice Commands Cheat Sheet */}
        <VoiceCommandsCheatSheet onRunCommand={handleExecuteCommand} />

        {/* AI Reasoning Trigger Pill */}
        {lastParsedResult && (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setIsReasoningOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 transition shadow-lg shadow-cyan-950/50"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inspect AI Intent & Cognitive Breakdown</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-800/80 text-white font-mono">
                {lastParsedResult.intents.length} Action(s)
              </span>
            </button>
          </div>
        )}

        {/* Action Views Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/80 pb-3 mb-6 gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-medium w-full sm:w-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'ALL'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>All Action Desks</span>
            </button>
            <button
              onClick={() => setActiveTab('EXPENSE')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'EXPENSE'
                  ? 'bg-amber-950/40 text-amber-300 border border-amber-800/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
              <span>Expenses ({expenses.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('TASK')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'TASK'
                  ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-800/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tasks & Deadlines ({tasks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('TICKET')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'TICKET'
                  ? 'bg-rose-950/40 text-rose-300 border border-rose-800/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Grievance Desk ({tickets.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('EMAIL')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'EMAIL'
                  ? 'bg-violet-950/40 text-violet-300 border border-violet-800/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-violet-400" />
              <span>Dispatches ({emails.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'AUDIT'
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Audit Feed</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block shrink-0">
            Deterministic Real-Action Execution
          </div>
        </div>

        {/* Dynamic Action Desks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 flex-1">
          {(activeTab === 'ALL' || activeTab === 'EXPENSE') && (
            <div className="min-h-[460px]">
              <ExpenseTracker
                expenses={expenses}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
                monthlyBudget={monthlyBudget}
              />
            </div>
          )}

          {(activeTab === 'ALL' || activeTab === 'TASK') && (
            <div className="min-h-[460px]">
              <TaskScheduler
                tasks={tasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          )}

          {(activeTab === 'ALL' || activeTab === 'TICKET') && (
            <div className="min-h-[460px]">
              <GrievanceDesk
                tickets={tickets}
                onAddTicket={handleAddTicket}
                onUpdateStatus={handleUpdateTicketStatus}
                onDeleteTicket={handleDeleteTicket}
              />
            </div>
          )}

          {(activeTab === 'ALL' || activeTab === 'EMAIL') && (
            <div className="min-h-[460px]">
              <EmailDispatcher
                emails={emails}
                onAddEmail={handleAddEmail}
                onSendEmail={() => {}}
                onDeleteEmail={handleDeleteEmail}
              />
            </div>
          )}

          {(activeTab === 'ALL' || activeTab === 'AUDIT') && (
            <div className="min-h-[460px] lg:col-span-2 xl:col-span-2">
              <ActivityAuditTrail logs={logs} onClearLogs={() => setLogs([])} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">VoxFlow AI</span>
            <span>•</span>
            <span>Vocal Labs Round 2 Individual Hackathon</span>
          </div>
          <div>
            Real-Time Voice Assistant • Speak. Understand. Act.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AiReasoningModal
        isOpen={isReasoningOpen}
        onClose={() => setIsReasoningOpen(false)}
        result={lastParsedResult}
      />

      <DemoPresetsModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onRunScenario={handleExecuteCommand}
      />

      <SystemArchitecture
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        geminiKey={geminiApiKey}
        onSaveGeminiKey={(key) => {
          setGeminiApiKey(key);
          StorageService.saveApiKey(key);
        }}
        monthlyBudget={monthlyBudget}
        onUpdateBudget={setMonthlyBudget}
      />
    </div>
  );
};
