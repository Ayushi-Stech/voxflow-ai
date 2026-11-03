import { ActionType, ParsedIntentResult, ExpenseItem, TaskItem, TicketItem } from '../types';

const WELL_KNOWN_DOMAINS: Record<string, { url: string; name: string }> = {
  google: { url: 'https://www.google.com', name: 'Google' },
  youtube: { url: 'https://www.youtube.com', name: 'YouTube' },
  github: { url: 'https://github.com', name: 'GitHub' },
  chatgpt: { url: 'https://chatgpt.com', name: 'ChatGPT' },
  openai: { url: 'https://openai.com', name: 'OpenAI' },
  gemini: { url: 'https://gemini.google.com', name: 'Google Gemini' },
  claude: { url: 'https://claude.ai', name: 'Claude AI' },
  perplexity: { url: 'https://www.perplexity.ai', name: 'Perplexity' },
  instagram: { url: 'https://www.instagram.com', name: 'Instagram' },
  insta: { url: 'https://www.instagram.com', name: 'Instagram' },
  twitter: { url: 'https://x.com', name: 'Twitter (X)' },
  x: { url: 'https://x.com', name: 'Twitter (X)' },
  facebook: { url: 'https://www.facebook.com', name: 'Facebook' },
  fb: { url: 'https://www.facebook.com', name: 'Facebook' },
  linkedin: { url: 'https://www.linkedin.com', name: 'LinkedIn' },
  whatsapp: { url: 'https://web.whatsapp.com', name: 'WhatsApp Web' },
  reddit: { url: 'https://www.reddit.com', name: 'Reddit' },
  amazon: { url: 'https://www.amazon.com', name: 'Amazon' },
  flipkart: { url: 'https://www.flipkart.com', name: 'Flipkart' },
  netflix: { url: 'https://www.netflix.com', name: 'Netflix' },
  spotify: { url: 'https://open.spotify.com', name: 'Spotify' },
  gmail: { url: 'https://mail.google.com', name: 'Gmail' },
  mail: { url: 'https://mail.google.com', name: 'Gmail' },
  maps: { url: 'https://maps.google.com', name: 'Google Maps' },
  'google maps': { url: 'https://maps.google.com', name: 'Google Maps' },
  wikipedia: { url: 'https://www.wikipedia.org', name: 'Wikipedia' },
  leetcode: { url: 'https://leetcode.com', name: 'LeetCode' },
  'stack overflow': { url: 'https://stackoverflow.com', name: 'Stack Overflow' },
  stackoverflow: { url: 'https://stackoverflow.com', name: 'Stack Overflow' },
  canva: { url: 'https://www.canva.com', name: 'Canva' },
  figma: { url: 'https://www.figma.com', name: 'Figma' },
  notion: { url: 'https://www.notion.so', name: 'Notion' },
  discord: { url: 'https://discord.com/app', name: 'Discord' },
  telegram: { url: 'https://web.telegram.org', name: 'Telegram' },
  drive: { url: 'https://drive.google.com', name: 'Google Drive' },
  'google drive': { url: 'https://drive.google.com', name: 'Google Drive' },
  docs: { url: 'https://docs.google.com', name: 'Google Docs' },
  'google docs': { url: 'https://docs.google.com', name: 'Google Docs' },
  sheets: { url: 'https://sheets.google.com', name: 'Google Sheets' },
};

export class NLUEngine {
  /**
   * Main entry point: analyzes speech transcript and extracts executable actions
   */
  public static async processTranscript(
    transcript: string,
    geminiApiKey?: string,
    context?: {
      expenses?: ExpenseItem[];
      tasks?: TaskItem[];
      tickets?: TicketItem[];
    }
  ): Promise<ParsedIntentResult> {
    const trimmed = transcript.trim();
    if (!trimmed) {
      return {
        rawTranscript: '',
        intents: [],
        voiceResponse: 'I did not catch any command. Please speak again.',
        reasoning: ['Empty voice transcript received.'],
        source: 'offline-nlu',
      };
    }

    // 1. Check for fast real-world commands (Web Navigation, Timer, Math, Queries, System Controls)
    const fastAction = this.checkFastRealCommands(trimmed, context);
    if (fastAction) {
      return fastAction;
    }

    // 2. If Gemini API key is configured, attempt LLM call
    if (geminiApiKey && geminiApiKey.trim().length > 10) {
      try {
        const geminiResult = await this.callGeminiAPI(trimmed, geminiApiKey);
        if (geminiResult && geminiResult.intents.length > 0) {
          return geminiResult;
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to built-in autonomous NLU engine:', err);
      }
    }

    // 3. High-precision Built-in Autonomous Semantic NLU Engine
    return this.parseLocally(trimmed, context);
  }

  /**
   * Instant Real-World Fast Commands (Universal Web Launcher, Timer, Math, Live Clock, Voice Queries)
   */
  private static checkFastRealCommands(
    raw: string,
    context?: { expenses?: ExpenseItem[]; tasks?: TaskItem[]; tickets?: TicketItem[] }
  ): ParsedIntentResult | null {
    const lower = raw.toLowerCase().trim().replace(/[.,!?]+$/, '');

    // 1. UNIVERSAL WEBSITE & APPLICATION LAUNCHER
    // Patterns: "open youtube", "open google", "open instagram", "go to github.com", "launch chatgpt", "search google for..."
    const webNavResult = this.resolveWebNavigation(lower, raw);
    if (webNavResult) {
      return webNavResult;
    }

    // 2. LIVE TIME & DATE
    if (/what(?:'s| is) the time|current time|tell me the time|time now/i.test(lower)) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        rawTranscript: raw,
        intents: [{
          type: 'QUERY',
          confidence: 1.0,
          entities: { query: 'time', answer: timeStr },
          summary: `Current time: ${timeStr}`
        }],
        voiceResponse: `The current time is ${timeStr}.`,
        reasoning: ['Executed real-time clock query'],
        source: 'offline-nlu'
      };
    }

    if (/what(?:'s| is) (?:today's|the) date|what day is it|tell me the date/i.test(lower)) {
      const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      return {
        rawTranscript: raw,
        intents: [{
          type: 'QUERY',
          confidence: 1.0,
          entities: { query: 'date', answer: dateStr },
          summary: `Current date: ${dateStr}`
        }],
        voiceResponse: `Today is ${dateStr}.`,
        reasoning: ['Executed real-time calendar date query'],
        source: 'offline-nlu'
      };
    }

    // 3. REAL TIMER / ALARM COMMAND
    const timerMatch = lower.match(/(?:set (?:a )?timer(?: for)?|timer for|start timer|countdown(?: for)?)\s*(\d+)\s*(seconds?|sec|minutes?|min|hours?|hr)?/i);
    if (timerMatch) {
      const count = parseInt(timerMatch[1], 10);
      const unit = (timerMatch[2] || 'seconds').toLowerCase();
      let totalSeconds = count;

      if (unit.startsWith('min')) {
        totalSeconds = count * 60;
      } else if (unit.startsWith('hour') || unit.startsWith('hr')) {
        totalSeconds = count * 3600;
      }

      return {
        rawTranscript: raw,
        intents: [{
          type: 'TIMER',
          confidence: 0.99,
          entities: {
            totalSeconds,
            label: `${count} ${unit} Timer`,
          },
          summary: `Started countdown timer for ${count} ${unit}`
        }],
        voiceResponse: `Timer set for ${count} ${unit}. Starting now.`,
        reasoning: [`Parsed timer parameters: ${count} ${unit} (${totalSeconds}s total)`],
        source: 'offline-nlu'
      };
    }

    // 4. REAL MATH & CALCULATION COMMANDS
    const mathMatch = lower.match(/(?:what is|calculate|solve)\s*(\d+(?:\.\d+)?)\s*(divided by|\/|multiplied by|\*|times|plus|\+|minus|\-)\s*(\d+(?:\.\d+)?)/i);
    if (mathMatch) {
      const num1 = parseFloat(mathMatch[1]);
      const op = mathMatch[2].toLowerCase();
      const num2 = parseFloat(mathMatch[3]);
      let ans = 0;

      if (op === 'divided by' || op === '/') ans = num2 !== 0 ? Math.round((num1 / num2) * 100) / 100 : 0;
      else if (op === 'multiplied by' || op === '*' || op === 'times') ans = num1 * num2;
      else if (op === 'plus' || op === '+') ans = num1 + num2;
      else if (op === 'minus' || op === '-') ans = num1 - num2;

      return {
        rawTranscript: raw,
        intents: [{
          type: 'CALCULATE',
          confidence: 0.99,
          entities: { expression: `${num1} ${op} ${num2}`, answer: ans },
          summary: `Calculated ${num1} ${op} ${num2} = ${ans}`
        }],
        voiceResponse: `${num1} ${op} ${num2} is ${ans}.`,
        reasoning: [`Evaluated arithmetic expression: ${num1} ${op} ${num2} = ${ans}`],
        source: 'offline-nlu'
      };
    }

    const percentMatch = lower.match(/(?:what is|calculate)\s*(\d+(?:\.\d+)?)\s*(?:percent|%)\s*(?:of)\s*(\d+(?:\.\d+)?)/i);
    if (percentMatch) {
      const pct = parseFloat(percentMatch[1]);
      const base = parseFloat(percentMatch[2]);
      const ans = Math.round(((pct / 100) * base) * 100) / 100;
      return {
        rawTranscript: raw,
        intents: [{
          type: 'CALCULATE',
          confidence: 0.99,
          entities: { expression: `${pct}% of ${base}`, answer: ans },
          summary: `Calculated ${pct}% of ${base} = ${ans}`
        }],
        voiceResponse: `${pct} percent of ${base} is ${ans}.`,
        reasoning: [`Evaluated percentage calculation: (${pct} / 100) * ${base} = ${ans}`],
        source: 'offline-nlu'
      };
    }

    // 5. READ DATA ALOUD (VOICE QUERIES)
    if (/(?:what are my (?:pending )?tasks|read my tasks|show my tasks|list tasks|my tasks)/i.test(lower)) {
      const pending = context?.tasks?.filter(t => !t.completed) || [];
      const reply = pending.length > 0
        ? `You have ${pending.length} pending task${pending.length > 1 ? 's' : ''}: ${pending.slice(0, 3).map((t, i) => `${i + 1}, ${t.title}`).join('. ')}.`
        : 'You have no pending tasks. All clear!';

      return {
        rawTranscript: raw,
        intents: [{
          type: 'QUERY',
          confidence: 0.98,
          entities: { query: 'tasks', count: pending.length },
          summary: `Read out ${pending.length} pending tasks`
        }],
        voiceResponse: reply,
        reasoning: ['Queried pending task items and generated vocal summary'],
        source: 'offline-nlu'
      };
    }

    if (/(?:how much (?:did|have) i spent|what is my (?:total )?expense|total spend|my expenses)/i.test(lower)) {
      const total = context?.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
      const count = context?.expenses?.length || 0;
      return {
        rawTranscript: raw,
        intents: [{
          type: 'QUERY',
          confidence: 0.98,
          entities: { query: 'expense_total', total, count },
          summary: `Total spend query: ₹${total}`
        }],
        voiceResponse: `Your total logged spend is ₹${total.toLocaleString('en-IN')} across ${count} expenses.`,
        reasoning: ['Calculated aggregate expenses and generated vocal reply'],
        source: 'offline-nlu'
      };
    }

    if (/(?:remaining budget|budget left|how much budget|my balance)/i.test(lower)) {
      const total = context?.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
      const budget = 25000;
      const left = budget - total;
      return {
        rawTranscript: raw,
        intents: [{
          type: 'QUERY',
          confidence: 0.98,
          entities: { query: 'budget_balance', remaining: left },
          summary: `Remaining budget query: ₹${left}`
        }],
        voiceResponse: `You have ₹${left.toLocaleString('en-IN')} remaining out of your ₹${budget.toLocaleString('en-IN')} monthly budget.`,
        reasoning: ['Calculated budget balance'],
        source: 'offline-nlu'
      };
    }

    if (/(?:how many tickets|show tickets|open tickets|my tickets)/i.test(lower)) {
      const openTicks = context?.tickets?.filter(t => t.status !== 'Resolved') || [];
      return {
        rawTranscript: raw,
        intents: [{
          type: 'QUERY',
          confidence: 0.98,
          entities: { query: 'tickets', count: openTicks.length },
          summary: `Open tickets query: ${openTicks.length}`
        }],
        voiceResponse: `There are ${openTicks.length} unresolved grievance tickets on your desk.`,
        reasoning: ['Queried open grievance tickets'],
        source: 'offline-nlu'
      };
    }

    // 6. REAL SYSTEM CONTROLS
    if (lower.includes('export my data') || lower.includes('download csv') || lower.includes('export csv') || lower.includes('export ledger')) {
      return {
        rawTranscript: raw,
        intents: [{
          type: 'SYSTEM_CONTROL',
          confidence: 0.99,
          entities: { action: 'EXPORT_CSV' },
          summary: 'Triggered CSV report download'
        }],
        voiceResponse: 'Exporting your complete audit ledger to CSV now.',
        reasoning: ['Executed CSV export system control'],
        source: 'offline-nlu'
      };
    }

    // 7. CONVERSATIONAL JOKES & IDENTITY
    if (/who (?:are you|made you|created you)|what are you/i.test(lower)) {
      return {
        rawTranscript: raw,
        intents: [{
          type: 'CONVERSATION',
          confidence: 1.0,
          entities: { topic: 'identity' },
          summary: 'Answered identity query'
        }],
        voiceResponse: 'I am VoxFlow AI, your autonomous voice operations assistant built for the Vocal Labs Round 2 Hackathon.',
        reasoning: ['Assistant identity query response'],
        source: 'offline-nlu'
      };
    }

    if (/what can you do|help|list commands|show commands/i.test(lower)) {
      return {
        rawTranscript: raw,
        intents: [{
          type: 'CONVERSATION',
          confidence: 1.0,
          entities: { topic: 'capabilities' },
          summary: 'Showed voice capabilities'
        }],
        voiceResponse: 'I can log expenses, schedule tasks, raise grievance tickets with SLAs, set timers, calculate math, and open any website.',
        reasoning: ['Delivered capabilities summary'],
        source: 'offline-nlu'
      };
    }

    if (/tell me a (?:tech )?joke/i.test(lower)) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "There are 10 types of people in the world: those who understand binary, and those who don't.",
        "Why did the JavaScript developer wear glasses? Because they didn't C sharp!"
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      return {
        rawTranscript: raw,
        intents: [{
          type: 'CONVERSATION',
          confidence: 1.0,
          entities: { topic: 'joke' },
          summary: 'Told a programmer joke'
        }],
        voiceResponse: joke,
        reasoning: ['Delivered conversational humor response'],
        source: 'offline-nlu'
      };
    }

    return null;
  }

  /**
   * Universal Web Navigation & Search Resolver
   */
  private static resolveWebNavigation(lower: string, raw: string): ParsedIntentResult | null {
    // A. Explicit search commands: "search google for react", "google react", "search for tesla"
    const searchMatch = lower.match(/(?:search google for|search on google for|google|search for|look up)\s+(.+)/i);
    if (searchMatch && searchMatch[1]?.trim()) {
      const query = searchMatch[1].trim();
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      return {
        rawTranscript: raw,
        intents: [{
          type: 'WEB_NAV',
          confidence: 0.99,
          entities: { url: searchUrl, target: 'Google Search', query },
          summary: `Search Google for "${query}"`
        }],
        voiceResponse: `Searching Google for ${query}.`,
        reasoning: [`Generated Google search query URL: ${searchUrl}`],
        source: 'offline-nlu'
      };
    }

    // B. YouTube specific search: "play lo-fi on youtube", "search youtube for tutorials", "open youtube"
    const youtubeMatch = lower.match(/(?:play\s+(.+)\s+on youtube|search youtube for\s+(.+)|youtube\s+(.+))/i);
    if (youtubeMatch) {
      const topic = (youtubeMatch[1] || youtubeMatch[2] || youtubeMatch[3] || '').trim();
      const ytUrl = topic ? `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}` : 'https://www.youtube.com';
      return {
        rawTranscript: raw,
        intents: [{
          type: 'WEB_NAV',
          confidence: 0.99,
          entities: { url: ytUrl, target: 'YouTube', query: topic },
          summary: topic ? `Open YouTube search for "${topic}"` : 'Open YouTube'
        }],
        voiceResponse: topic ? `Opening YouTube for ${topic}.` : 'Opening YouTube.',
        reasoning: ['Executed YouTube navigation intent'],
        source: 'offline-nlu'
      };
    }

    // C. "open [website / app]" / "launch [website]" / "go to [website]" / "visit [website]"
    const openMatch = lower.match(/^(?:please\s+)?(?:open|launch|go to|visit|navigate to|bring up)\s+(.+)$/i);
    if (openMatch && openMatch[1]?.trim()) {
      let target = openMatch[1].trim();
      // Remove trailing words like "website", "app", "site", "dot com"
      target = target.replace(/\s+(?:website|site|app|page|com)$/i, '').trim();

      // 1. Check known domain dictionary
      const lowerTarget = target.toLowerCase();
      if (WELL_KNOWN_DOMAINS[lowerTarget]) {
        const item = WELL_KNOWN_DOMAINS[lowerTarget];
        return {
          rawTranscript: raw,
          intents: [{
            type: 'WEB_NAV',
            confidence: 1.0,
            entities: { url: item.url, target: item.name },
            summary: `Open ${item.name}`
          }],
          voiceResponse: `Opening ${item.name} now.`,
          reasoning: [`Matched well-known web application: ${item.name} (${item.url})`],
          source: 'offline-nlu'
        };
      }

      // 2. Check if target is a full URL or domain (e.g. "myportfolio.io", "wikipedia.org", "cricbuzz.com")
      const domainMatch = target.match(/([a-z0-9\-]+(?:\.[a-z]{2,}))/i);
      if (domainMatch) {
        const domain = domainMatch[1];
        const fullUrl = domain.startsWith('http') ? domain : `https://${domain}`;
        return {
          rawTranscript: raw,
          intents: [{
            type: 'WEB_NAV',
            confidence: 0.98,
            entities: { url: fullUrl, target: domain },
            summary: `Open ${domain}`
          }],
          voiceResponse: `Opening ${domain} now.`,
          reasoning: [`Extracted web domain: ${domain}`],
          source: 'offline-nlu'
        };
      }

      // 3. For any single-word site name (e.g. "flipkart", "cricbuzz", "medium", "udemy"), open direct dot com or search
      const cleanWord = target.replace(/[^a-zA-Z0-9]/g, '');
      if (cleanWord.length > 2 && !target.includes(' ')) {
        const fullUrl = `https://www.${cleanWord.toLowerCase()}.com`;
        const capName = capitalize(cleanWord);
        return {
          rawTranscript: raw,
          intents: [{
            type: 'WEB_NAV',
            confidence: 0.95,
            entities: { url: fullUrl, target: capName },
            summary: `Open ${capName}`
          }],
          voiceResponse: `Opening ${capName} now.`,
          reasoning: [`Constructed web URL: ${fullUrl}`],
          source: 'offline-nlu'
        };
      }

      // 4. Fallback search query for multi-word targets: "open web design trends"
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
      return {
        rawTranscript: raw,
        intents: [{
          type: 'WEB_NAV',
          confidence: 0.92,
          entities: { url: searchUrl, target: target },
          summary: `Search web for "${target}"`
        }],
        voiceResponse: `Searching Google for ${target}.`,
        reasoning: [`Navigated to Google search for "${target}"`],
        source: 'offline-nlu'
      };
    }

    return null;
  }

  /**
   * Gemini 1.5 / 2.0 Flash API Integration with JSON Schema extraction
   */
  private static async callGeminiAPI(
    transcript: string,
    apiKey: string
  ): Promise<ParsedIntentResult | null> {
    const systemPrompt = `You are VoxFlow Voice AI Engine.
Analyze the user's voice transcript and extract one or more actionable intents.
Today's date is: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

The user command might have MULTIPLE actions combined with 'and', for example:
"Spent 250 rupees on lunch and remind me to submit the form on Friday."

You must respond ONLY with a raw valid JSON object matching this schema:
{
  "intents": [
    {
      "type": "EXPENSE" | "TASK" | "TICKET" | "EMAIL" | "QUERY" | "TIMER" | "WEB_NAV" | "CALCULATE",
      "confidence": number between 0.8 and 1.0,
      "entities": {
        // For EXPENSE: "amount": number, "currency": "INR"|"USD", "category": "Food"|"Travel"|"Tech"|"Bills"|"Health"|"Office"|"Shopping"|"General", "description": string
        // For TASK: "title": string, "dueDate": string, "dueTime": string, "priority": "low"|"medium"|"high"|"urgent"
        // For TICKET: "title": string, "description": string, "department": "IT Support"|"Facilities"|"Campus Admin"|"Billing"|"Emergency", "severity": "low"|"medium"|"high"|"critical", "slaHours": number
        // For EMAIL: "recipient": string, "subject": string, "body": string
        // For TIMER: "totalSeconds": number, "label": string
        // For WEB_NAV: "url": string, "target": string
      },
      "summary": string
    }
  ],
  "voiceResponse": "A crisp, natural 1-2 sentence spoken reply confirming all executed actions.",
  "reasoning": [
    "Step 1 reasoning...",
    "Step 2 reasoning..."
  ]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            { text: `Voice Input Transcript: "${transcript}"` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Gemini HTTP error ${res.status}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) throw new Error('No candidate returned from Gemini');

    const parsed = JSON.parse(candidate);
    return {
      rawTranscript: transcript,
      intents: parsed.intents || [],
      voiceResponse: parsed.voiceResponse || 'Actions processed successfully.',
      reasoning: [
        'Processed using Google Gemini 1.5 Flash LLM',
        ...(parsed.reasoning || [])
      ],
      source: 'gemini',
    };
  }

  /**
   * High-Precision Built-in Autonomous Semantic NLU Engine
   * Zero external API key required. Handles complex multi-clause compound sentences.
   */
  public static parseLocally(
    transcript: string,
    context?: { expenses?: ExpenseItem[]; tasks?: TaskItem[]; tickets?: TicketItem[] }
  ): ParsedIntentResult {
    const raw = transcript.trim();
    const reasoning: string[] = [];
    const intents: ParsedIntentResult['intents'] = [];
    const voiceParts: string[] = [];

    reasoning.push(`Ingested acoustic transcript: "${raw}"`);

    // Split compound sentences by conjunctions (and, also, then, plus, as well as)
    const clauses = raw
      .split(/\s+(?:and then|and also|and|also|plus|then)\s+/i)
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    reasoning.push(`Identified ${clauses.length} distinct sentence clause(s) for multi-action pipeline`);

    for (const clause of clauses) {
      const cl = clause.toLowerCase();
      let matched = false;

      // 1. EXPENSE INTENT MATCHING
      // Patterns: "i spent 250 on lunch", "spent 250 rupees on lunch", "paid 800 for uber", "bought coffee for 150", "expense 500"
      const expenseMatch = cl.match(/(?:i\s+)?(?:spent|spend|paid|pay|bought|buy|cost|expense of|logged|add expense)\s*(?:(?:rs\.?|inr|rupees|\$)\s*)?(\d+(?:\.\d{1,2})?)\s*(?:(?:rs\.?|inr|rupees|dollars|bucks)\s*)?(?:on|for|at)?\s*(.*)/i) ||
                           cl.match(/(\d+(?:\.\d{1,2})?)\s*(?:rs\.?|inr|rupees|dollars|bucks)\s*(?:on|for|at)\s*(.*)/i) ||
                           cl.match(/(?:food|lunch|dinner|breakfast|uber|cab|flight|coffee|grocery|server|bill)\s*(?:expense|cost)?\s*(?:of|for|is|was)?\s*(?:(?:rs\.?|inr|rupees|\$)\s*)?(\d+(?:\.\d{1,2})?)/i);

      if (expenseMatch) {
        matched = true;
        const amount = parseFloat(expenseMatch[1]);
        let description = (expenseMatch[2] || 'Expense item').replace(/^(rupees|dollars|inr|bucks)\s*/i, '').trim();
        if (!description) description = 'General expense';

        let category: ExpenseItem['category'] = 'General';
        const descLower = description.toLowerCase() + ' ' + cl;

        if (/lunch|dinner|breakfast|food|coffee|snack|burger|pizza|tea|canteen|swiggy|zomato|grocer/i.test(descLower)) {
          category = 'Food';
        } else if (/uber|ola|cab|auto|flight|train|metro|bus|petrol|fuel|ticket|travel/i.test(descLower)) {
          category = 'Travel';
        } else if (/server|cloud|aws|github|domain|laptop|keyboard|mouse|software|api|tech|subscription/i.test(descLower)) {
          category = 'Tech';
        } else if (/electricity|water|wifi|broadband|recharge|rent|bill|maintenance/i.test(descLower)) {
          category = 'Bills';
        } else if (/medicine|doctor|clinic|pharmacy|hospital|health/i.test(descLower)) {
          category = 'Health';
        } else if (/pen|paper|notebook|desk|chair|stationery|office/i.test(descLower)) {
          category = 'Office';
        } else if (/shirt|clothes|amazon|flipkart|shopping|bag/i.test(descLower)) {
          category = 'Shopping';
        }

        intents.push({
          type: 'EXPENSE',
          confidence: 0.98,
          entities: {
            amount,
            currency: cl.includes('$') || cl.includes('dollar') ? 'USD' : 'INR',
            category,
            description: capitalize(description),
          },
          summary: `Log expense of ₹${amount} for ${capitalize(description)} (${category})`,
        });

        reasoning.push(`[EXPENSE DETECTED] Amount: ${amount}, Category: ${category}, Item: "${description}"`);
        voiceParts.push(`Saved ₹${amount} for ${description}`);
      }

      // 2. TASK / REMINDER INTENT MATCHING
      // Patterns: "remind me to submit the form on Friday", "set reminder to call Rahul at 5pm", "task to finish slides", "add task submit assignment"
      const taskMatch = cl.match(/(?:remind me to|reminder to|remember to|schedule a?|set (?:a )?reminder (?:to|for)|create (?:a )?task (?:to|for)?|add task|todo|don't forget to|need to|have to)\s*(.*)/i);

      if (taskMatch && !matched) {
        matched = true;
        const taskRaw = taskMatch[1].trim();

        let dueDate = 'Today';
        let dueTime = '17:00';
        let title = taskRaw;

        const dateRegex = /\b(on friday|on monday|on tuesday|on wednesday|on thursday|on saturday|on sunday|tomorrow|today|tonight|next week|at \d{1,2}(?::\d{2})?\s*(?:am|pm)?|by \d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/gi;
        const dateMatches = taskRaw.match(dateRegex);

        if (dateMatches) {
          dueDate = capitalize(dateMatches.join(' '));
          title = taskRaw.replace(dateRegex, '').replace(/\s+(on|at|by)$/i, '').trim();
        }

        let priority: TaskItem['priority'] = 'medium';
        if (/urgent|asap|critical|emergency|immediately/i.test(taskRaw)) {
          priority = 'urgent';
        } else if (/important|high priority|must/i.test(taskRaw)) {
          priority = 'high';
        }

        intents.push({
          type: 'TASK',
          confidence: 0.96,
          entities: {
            title: capitalize(title || taskRaw),
            dueDate,
            dueTime,
            priority,
          },
          summary: `Schedule task "${capitalize(title)}" due ${dueDate}`,
        });

        reasoning.push(`[TASK SCHEDULED] Title: "${title}", Due: "${dueDate}", Priority: ${priority}`);
        voiceParts.push(`set reminder to ${title} for ${dueDate}`);
      }

      // 3. GRIEVANCE / TICKET INTENT MATCHING (Real World Track)
      // Patterns: "create a ticket for water leakage in lab", "raise ticket for wifi down", "hostel ac broken"
      const ticketMatch = cl.match(/(?:create (?:a )?ticket|raise (?:a )?ticket|file (?:a )?complaint|report (?:an )?issue|grievance|support ticket)\s*(?:for|about|regarding)?\s*(.*)/i) ||
                          (/(broken|burst|leak|leaking|outage|down|failed|not working|urgent need|damaged)/i.test(cl) && /(ticket|fix|plumber|wifi|server|support|complaint|ac|pipe|water)/i.test(cl) ? [cl, cl] : null);

      if (ticketMatch && !matched) {
        matched = true;
        const issueText = ticketMatch[1].trim();
        let department: TicketItem['department'] = 'IT Support';
        let severity: TicketItem['severity'] = 'medium';
        let slaHours = 4;

        if (/pipe|water|leak|ac|cooling|door|light|fan|power|electricity|desk|hostel|plumber/i.test(issueText)) {
          department = 'Facilities';
          slaHours = 6;
        } else if (/server|database|network|wifi|portal|login|bug|code|system|api/i.test(issueText)) {
          department = 'IT Support';
          slaHours = 4;
        } else if (/exam|fee|scholarship|admission|library|id card|campus/i.test(issueText)) {
          department = 'Campus Admin';
          slaHours = 24;
        } else if (/fire|burst|electric shock|hazard|medical|danger|emergency/i.test(issueText)) {
          department = 'Emergency';
          severity = 'critical';
          slaHours = 1;
        }

        if (/urgent|critical|immediately|asap|burst|emergency/i.test(issueText)) {
          severity = 'critical';
          slaHours = Math.min(slaHours, 2);
        }

        intents.push({
          type: 'TICKET',
          confidence: 0.95,
          entities: {
            title: capitalize(issueText),
            description: `Voice grievance reported: "${raw}". Routed automatically by AI.`,
            department,
            severity,
            slaHours,
          },
          summary: `Generate #${department} ticket for "${issueText}" (SLA: ${slaHours}h)`,
        });

        reasoning.push(`[TICKET TRIAGED] Department: ${department}, Severity: ${severity}, SLA: ${slaHours}h`);
        voiceParts.push(`created ${department} ticket for ${issueText}`);
      }

      // 4. EMAIL DISPATCH INTENT MATCHING
      const emailMatch = cl.match(/(?:send (?:an )?email|mail|write an email)\s*(?:to)?\s*([^\s]+@[^\s]+|[a-zA-Z0-9_\s]+)?\s*(?:with subject|about|saying)?\s*(.*)/i);

      if (emailMatch && !matched) {
        matched = true;
        let recipient = emailMatch[1]?.trim() || 'team@vocallabs.io';
        if (!recipient.includes('@')) {
          recipient = `${recipient.replace(/\s+/g, '.').toLowerCase()}@company.com`;
        }
        const messageBody = emailMatch[2]?.trim() || 'Follow up regarding voice request';
        const subject = capitalize(messageBody.split('. ')[0].slice(0, 40));

        intents.push({
          type: 'EMAIL',
          confidence: 0.94,
          entities: {
            recipient,
            subject: `Update: ${subject}`,
            body: `Hi,\n\n${capitalize(messageBody)}.\n\nDispatched automatically via VoxFlow Voice AI Hub.\nTimestamp: ${new Date().toLocaleTimeString()}`,
          },
          summary: `Prepare email to ${recipient}`,
        });

        reasoning.push(`[EMAIL DISPATCH] Recipient: ${recipient}, Subject: "${subject}"`);
        voiceParts.push(`prepared email to ${recipient}`);
      }
    }

    // CRITICAL FIX: If no specific intent was recognized, DO NOT blindly save it as a task!
    // Instead, give helpful conversational feedback guiding the user on valid commands.
    if (intents.length === 0) {
      return {
        rawTranscript: raw,
        intents: [],
        voiceResponse: "I didn't quite catch that. You can tell me to log an expense, schedule a task, raise a ticket, set a timer, or open any website.",
        reasoning: [
          `No definitive action intent matched for: "${raw}"`,
          'Safely aborted execution without mutating database state.'
        ],
        source: 'offline-nlu',
      };
    }

    const voiceResponse = voiceParts.length > 0
      ? `Done. ${capitalize(voiceParts.join(' and '))}.`
      : 'Done. Action processed successfully.';

    return {
      rawTranscript: raw,
      intents,
      voiceResponse,
      reasoning,
      source: 'offline-nlu',
    };
  }
}

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
