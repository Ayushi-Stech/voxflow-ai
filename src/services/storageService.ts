import { ExpenseItem, TaskItem, TicketItem, EmailItem, ActionLog } from '../types';

const STORAGE_KEYS = {
  EXPENSES: 'voxflow_expenses',
  TASKS: 'voxflow_tasks',
  TICKETS: 'voxflow_tickets',
  EMAILS: 'voxflow_emails',
  LOGS: 'voxflow_logs',
  CONFIG: 'voxflow_config',
  SETTINGS: 'voxflow_settings',
};

// Realistic initial seed data for an immediately compelling demo
const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    amount: 250,
    currency: 'INR',
    category: 'Food',
    description: 'Lunch with engineering team',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now() - 3600000 * 2,
  },
  {
    id: 'exp-2',
    amount: 850,
    currency: 'INR',
    category: 'Travel',
    description: 'Uber cab ride to tech campus',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now() - 3600000 * 8,
  },
  {
    id: 'exp-3',
    amount: 1499,
    currency: 'INR',
    category: 'Tech',
    description: 'GitHub Copilot Team subscription',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now() - 3600000 * 24,
  },
];

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Submit Hackathon project repository and live URL',
    dueDate: 'Today, 5:30 PM',
    dueTime: '17:30',
    priority: 'urgent',
    completed: false,
    timestamp: Date.now() - 1800000,
  },
  {
    id: 'task-2',
    title: 'Finalize Voice AI presentation slides and 3-min demo pitch',
    dueDate: 'Today, 6:00 PM',
    dueTime: '18:00',
    priority: 'high',
    completed: false,
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'task-3',
    title: 'Review system action logs and budget balance',
    dueDate: 'Tomorrow',
    dueTime: '10:00',
    priority: 'medium',
    completed: true,
    timestamp: Date.now() - 3600000 * 4,
  },
];

const INITIAL_TICKETS: TicketItem[] = [
  {
    id: 'tick-1',
    ticketNumber: 'VOX-1042',
    title: 'High latency in Voice AI WebSocket synthesis endpoint',
    description: 'User reported 800ms lag during speech-to-text response callback on mobile browsers.',
    department: 'IT Support',
    severity: 'high',
    status: 'In Progress',
    slaHours: 4,
    createdAt: 'Today, 11:20 AM',
    timestamp: Date.now() - 7200000,
  },
  {
    id: 'tick-2',
    ticketNumber: 'VOX-1039',
    title: 'AC unit leakage in Lab 304 Server Rack',
    description: 'Facilities maintenance required before cooling failure triggers thermal cutoff.',
    department: 'Facilities',
    severity: 'critical',
    status: 'Open',
    slaHours: 2,
    createdAt: 'Today, 09:45 AM',
    timestamp: Date.now() - 14400000,
  },
];

const INITIAL_EMAILS: EmailItem[] = [
  {
    id: 'mail-1',
    recipient: 'judges@vocallabs.io',
    subject: 'Voice AI Hackathon Project Ready: VoxFlow Autonomous Operations Hub',
    body: 'Dear Evaluation Panel, VoxFlow AI has successfully executed voice-to-action intents including expense ledger logging, calendar reminder dispatch, and IT ticket triage.',
    status: 'Sent',
    sentAt: 'Today, 12:45 PM',
    timestamp: Date.now() - 900000,
  },
];

const INITIAL_LOGS: ActionLog[] = [
  {
    id: 'log-1',
    actionType: 'EXPENSE',
    title: 'Expense Logged: ₹250',
    summary: 'Voice command parsed: "Spent 250 on lunch with team"',
    details: { amount: 250, category: 'Food' },
    timestamp: Date.now() - 3600000 * 2,
    timeString: '2 hours ago',
  },
  {
    id: 'log-2',
    actionType: 'TICKET',
    title: 'Ticket Created: #VOX-1042',
    summary: 'Voice grievance auto-triaged to IT Support with 4h SLA',
    details: { department: 'IT Support', severity: 'high' },
    timestamp: Date.now() - 7200000,
    timeString: '4 hours ago',
  },
];

export class StorageService {
  public static loadExpenses(): ExpenseItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  }

  public static saveExpenses(items: ExpenseItem[]) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(items));
  }

  public static loadTasks(): TaskItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  }

  public static saveTasks(items: TaskItem[]) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(items));
  }

  public static loadTickets(): TicketItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
      return data ? JSON.parse(data) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  }

  public static saveTickets(items: TicketItem[]) {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(items));
  }

  public static loadEmails(): EmailItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMAILS);
      return data ? JSON.parse(data) : INITIAL_EMAILS;
    } catch {
      return INITIAL_EMAILS;
    }
  }

  public static saveEmails(items: EmailItem[]) {
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(items));
  }

  public static loadLogs(): ActionLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      return data ? JSON.parse(data) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  }

  public static saveLogs(items: ActionLog[]) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(items));
  }

  public static loadApiKey(): string {
    return localStorage.getItem('voxflow_gemini_key') || '';
  }

  public static saveApiKey(key: string) {
    localStorage.setItem('voxflow_gemini_key', key);
  }

  public static exportCSV(expenses: ExpenseItem[], tickets: TicketItem[]) {
    const expenseRows = [
      ['TYPE', 'ID', 'AMOUNT', 'CURRENCY', 'CATEGORY', 'DESCRIPTION', 'DATE'],
      ...expenses.map((e) => ['EXPENSE', e.id, e.amount, e.currency, e.category, `"${e.description}"`, e.date]),
    ];

    const ticketRows = [
      ['TYPE', 'TICKET_NO', 'TITLE', 'DEPARTMENT', 'SEVERITY', 'STATUS', 'CREATED_AT'],
      ...tickets.map((t) => ['TICKET', t.ticketNumber, `"${t.title}"`, t.department, t.severity, t.status, t.createdAt]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [...expenseRows.map((r) => r.join(',')), '', ...ticketRows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VoxFlow_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public static exportJSON(data: any) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VoxFlow_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public static clearAll() {
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.TICKETS);
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    window.location.reload();
  }
}

