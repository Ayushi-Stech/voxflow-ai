export type ActionType =
  | 'EXPENSE'
  | 'TASK'
  | 'TICKET'
  | 'EMAIL'
  | 'QUERY'
  | 'TIMER'
  | 'WEB_NAV'
  | 'CALCULATE'
  | 'SYSTEM_CONTROL'
  | 'CONVERSATION';

export interface ExpenseItem {
  id: string;
  amount: number;
  currency: string;
  category: 'Food' | 'Travel' | 'Tech' | 'Bills' | 'Health' | 'Office' | 'Shopping' | 'General';
  description: string;
  date: string;
  timestamp: number;
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  dueTime?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  timestamp: number;
}

export interface TicketItem {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  department: 'IT Support' | 'Facilities' | 'Campus Admin' | 'Billing' | 'Emergency' | 'General';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  slaHours: number;
  createdAt: string;
  timestamp: number;
}

export interface EmailItem {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  status: 'Draft' | 'Sent';
  sentAt?: string;
  timestamp: number;
}

export interface ActiveTimer {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  createdAt: number;
}

export interface ActionLog {
  id: string;
  actionType: ActionType;
  title: string;
  summary: string;
  details: Record<string, any>;
  timestamp: number;
  timeString: string;
}

export interface ParsedIntentResult {
  rawTranscript: string;
  intents: {
    type: ActionType;
    confidence: number;
    entities: Record<string, any>;
    summary: string;
  }[];
  voiceResponse: string;
  reasoning: string[];
  tokensUsed?: number;
  source: 'gemini' | 'offline-nlu';
}

export interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  selectedVoiceURI: string;
  autoSpeak: boolean;
  soundEffects: boolean;
  continuousMode: boolean; // Hands-free always listening
}

export interface AppConfig {
  geminiApiKey: string;
  monthlyBudget: number;
}
