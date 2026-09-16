import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Maximize2, Minimize2, Copy, Check, Sparkles, Send, ArrowRight, CornerDownLeft, Database, Code, Briefcase, User, Mail, FolderGit2, Sun, Moon } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES, EXPERIENCES, VIRTUAL_FILES } from '../data/portfolioData';
import { ContactMessage } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TerminalProps {
  onNavigateSection?: (sectionId: string) => void;
  onOpenGoModal?: () => void;
}

interface CommandHistoryEntry {
  id: string;
  command: string;
  timestamp: string;
  type: 'help' | 'whoami' | 'projects' | 'skills' | 'experience' | 'contact' | 'cat' | 'ls' | 'messages' | 'go-arch' | 'matrix' | 'system' | 'error' | 'success';
  payload?: any;
}

export const Terminal: React.FC<TerminalProps> = ({ onNavigateSection, onOpenGoModal }) => {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  const [inputVal, setInputVal] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [terminalTheme, setTerminalTheme] = useState<'emerald' | 'cyan' | 'amber' | 'violet'>('emerald');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initial welcome message
  const [entries, setEntries] = useState<CommandHistoryEntry[]>([
    {
      id: 'init-1',
      command: 'sys.init',
      timestamp: new Date().toLocaleTimeString(),
      type: 'system',
      payload: {
        banner: true,
      }
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll when new entry is added
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  // Keep input focused when clicking terminal container
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const themeClasses = {
    emerald: {
      text: isDark ? 'text-emerald-400' : 'text-emerald-600',
      border: isDark ? 'border-emerald-500/30' : 'border-emerald-500/40',
      bg: isDark ? 'bg-emerald-950/20' : 'bg-emerald-50/50',
      glow: isDark ? 'shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'shadow-[0_4px_20px_rgba(16,185,129,0.1)]',
      badge: isDark ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border-emerald-300',
      accent: 'emerald',
      cursor: isDark ? 'bg-emerald-400' : 'bg-emerald-600'
    },
    cyan: {
      text: isDark ? 'text-cyan-400' : 'text-cyan-600',
      border: isDark ? 'border-cyan-500/30' : 'border-cyan-500/40',
      bg: isDark ? 'bg-cyan-950/20' : 'bg-cyan-50/50',
      glow: isDark ? 'shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'shadow-[0_4px_20px_rgba(6,182,212,0.1)]',
      badge: isDark ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' : 'bg-cyan-50 text-cyan-800 border-cyan-300',
      accent: 'cyan',
      cursor: isDark ? 'bg-cyan-400' : 'bg-cyan-600'
    },
    amber: {
      text: isDark ? 'text-amber-400' : 'text-amber-600',
      border: isDark ? 'border-amber-500/30' : 'border-amber-500/40',
      bg: isDark ? 'bg-amber-950/20' : 'bg-amber-50/50',
      glow: isDark ? 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'shadow-[0_4px_20px_rgba(245,158,11,0.1)]',
      badge: isDark ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-800 border-amber-300',
      accent: 'amber',
      cursor: isDark ? 'bg-amber-400' : 'bg-amber-600'
    },
    violet: {
      text: isDark ? 'text-violet-400' : 'text-violet-600',
      border: isDark ? 'border-violet-500/30' : 'border-violet-500/40',
      bg: isDark ? 'bg-violet-950/20' : 'bg-violet-50/50',
      glow: isDark ? 'shadow-[0_0_20px_rgba(139,92,246,0.15)]' : 'shadow-[0_4px_20px_rgba(139,92,246,0.1)]',
      badge: isDark ? 'bg-violet-500/10 text-violet-300 border-violet-500/30' : 'bg-violet-50 text-violet-800 border-violet-300',
      accent: 'violet',
      cursor: isDark ? 'bg-violet-400' : 'bg-violet-600'
    }
  }[terminalTheme];

  const executeCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Add to input history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const time = new Date().toLocaleTimeString();

    if (cmd === 'clear' || cmd === 'cls') {
      setEntries([]);
      setInputVal('');
      return;
    }

    if (cmd === 'help') {
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'help'
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'whoami' || cmd === 'about' || cmd === 'bio') {
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'whoami'
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'projects' || cmd === 'proj') {
      const filter = args[0]?.toLowerCase();
      let matchedProjects = PROJECTS;
      if (filter) {
        matchedProjects = PROJECTS.filter(
          p =>
            p.category.toLowerCase().includes(filter) ||
            p.techStack.some(t => t.toLowerCase().includes(filter)) ||
            p.id.toLowerCase().includes(filter)
        );
      }
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'projects',
          payload: matchedProjects
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'skills' || cmd === 'tech' || cmd === 'stack') {
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'skills',
          payload: SKILL_CATEGORIES
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'experience' || cmd === 'exp' || cmd === 'history' || cmd === 'work') {
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'experience',
          payload: EXPERIENCES
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'contact') {
      // Check if user is passing inline flags like `contact --name "John" --email "j@test.com" --msg "Hi"`
      if (trimmed.includes('--name') || trimmed.includes('--msg')) {
        handleInlineContact(trimmed);
        setInputVal('');
        return;
      }

      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'contact'
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'ls') {
      const files = Object.keys(VIRTUAL_FILES);
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'ls',
          payload: files
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'cat') {
      const target = args[0];
      if (!target) {
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'error',
            payload: 'Usage: cat [filename]. Available: ' + Object.keys(VIRTUAL_FILES).join(', ')
          }
        ]);
        setInputVal('');
        return;
      }

      const content = VIRTUAL_FILES[target];
      if (content) {
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'cat',
            payload: { filename: target, content }
          }
        ]);
      } else {
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'error',
            payload: `File not found: ${target}. Try 'ls' to see available files.`
          }
        ]);
      }
      setInputVal('');
      return;
    }

    if (cmd === 'go-arch' || cmd === 'golang' || cmd === 'mongo') {
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'go-arch'
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'messages' || cmd === 'inbox' || cmd === 'db') {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/messages');
        const data = await res.json();
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'messages',
            payload: {
              messages: data.messages || [],
              source: data.source || 'MongoDB Collection: messages'
            }
          }
        ]);
      } catch (err) {
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'error',
            payload: 'Could not connect to database endpoint /api/messages.'
          }
        ]);
      } finally {
        setIsSubmitting(false);
        setInputVal('');
      }
      return;
    }

    if (cmd === 'health' || cmd === 'status') {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'text',
            payload: `[SYSTEM TELEMETRY & HEALTH]
• Overall Status: ${data.status?.toUpperCase() || 'ONLINE'}
• Database Engine: ${data.database === 'mongodb' ? 'MongoDB Atlas (Remote Cluster Connected)' : 'Persistent Embedded MongoDB Document Store'}
• Stored Messages: ${data.messageCount} documents
• Backend Service: ${data.golangMicroservice?.spec || 'Golang v1.22 + Gin'}
• Uptime: ${data.uptimeSeconds} seconds
${data.mongoConnectionNotice ? `\n[DATABASE NOTICE]\n${data.mongoConnectionNotice}` : ''}`
          }
        ]);
      } catch (err) {
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'error',
            payload: 'Failed to fetch /api/health endpoint.'
          }
        ]);
      } finally {
        setIsSubmitting(false);
        setInputVal('');
      }
      return;
    }

    if (cmd === 'retry-db' || cmd === 'db-retry') {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/mongo/retry', { method: 'POST' });
        const data = await res.json();
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: data.connected ? 'success' : 'text',
            payload: `[MONGODB RECONNECT ATTEMPT]
• Connected to Atlas: ${data.connected ? 'YES (Active Remote Cluster)' : 'NO (Using Embedded Document Store)'}
• Storage Mode: ${data.database}
${data.notice ? `• Notice: ${data.notice}` : ''}`
          }
        ]);
      } catch (err) {
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'error',
            payload: 'Error connecting to /api/mongo/retry endpoint.'
          }
        ]);
      } finally {
        setIsSubmitting(false);
        setInputVal('');
      }
      return;
    }

    if (cmd === 'light' || cmd === 'white') {
      setTheme('light');
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'success',
          payload: '✓ Portfolio theme switched to [LIGHT / WHITE] mode.'
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'dark') {
      setTheme('dark');
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'success',
          payload: '✓ Portfolio theme switched to [DARK] mode.'
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'theme') {
      const sub = (args[0] || '').toLowerCase();
      if (sub === 'light' || sub === 'white') {
        setTheme('light');
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'success',
            payload: '✓ Portfolio theme switched to [LIGHT / WHITE] mode.'
          }
        ]);
      } else if (sub === 'dark') {
        setTheme('dark');
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'success',
            payload: '✓ Portfolio theme switched to [DARK] mode.'
          }
        ]);
      } else if (sub === 'toggle') {
        toggleTheme();
        const next = theme === 'dark' ? 'LIGHT / WHITE' : 'DARK';
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'success',
            payload: `✓ Toggled portfolio theme to [${next}].`
          }
        ]);
      } else if (['emerald', 'cyan', 'amber', 'violet'].includes(sub)) {
        setTerminalTheme(sub as any);
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'success',
            payload: `Terminal accent switched to [${sub.toUpperCase()}].`
          }
        ]);
      } else {
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: trimmed,
            timestamp: time,
            type: 'system',
            payload: {
              text: `Theme Controls:
• Site Theme: Current = [${theme.toUpperCase()}]
  - 'theme light' or 'theme white': Switch to clean white theme
  - 'theme dark': Switch to high-contrast dark theme
  - 'theme toggle': Toggle between dark and white
• Terminal Accent: Current = [${terminalTheme.toUpperCase()}]
  - 'theme emerald' | 'theme cyan' | 'theme amber' | 'theme violet'`
            }
          }
        ]);
      }
      setInputVal('');
      return;
    }

    if (cmd === 'gui') {
      const section = args[0] || 'projects';
      onNavigateSection?.(section);
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'success',
          payload: `Navigating GUI viewport to #${section}...`
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'curl') {
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'system',
          payload: {
            text: `HTTP/2 200 OK\nserver: nginx/1.24 (Cloud Run)\ndate: ${new Date().toUTCString()}\ncontent-type: application/json; charset=utf-8\nx-powered-by: Golang-Microservice & Next.js\nx-author: Imrul Kais Khan <imrulkaiskhan@gmail.com>\ncache-control: public, max-age=3600\nlocation: Dhaka, Bangladesh (UTC+6)`
          }
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'date') {
      const dhakaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        dateStyle: 'full',
        timeStyle: 'long'
      }).format(new Date());

      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'system',
          payload: { text: `Dhaka, Bangladesh Standard Time: ${dhakaTime}` }
        }
      ]);
      setInputVal('');
      return;
    }

    if (cmd === 'sudo') {
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: trimmed,
          timestamp: time,
          type: 'error',
          payload: `Permission denied: User 'guest' is not in the sudoers file. This incident will be reported to Imrul Kais Khan.`
        }
      ]);
      setInputVal('');
      return;
    }

    // Default unrecognized command
    setEntries(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        command: trimmed,
        timestamp: time,
        type: 'error',
        payload: `command not found: "${cmd}". Type "help" to see available commands.`
      }
    ]);
    setInputVal('');
  };

  const handleInlineContact = async (fullCmd: string) => {
    // Parse regex or simple extraction
    const nameMatch = fullCmd.match(/--name\s+["']?([^"'-]+)["']?/i);
    const emailMatch = fullCmd.match(/--email\s+["']?([^"'\s]+)["']?/i);
    const msgMatch = fullCmd.match(/--msg\s+["']?([^"']+)["']?/i);

    const name = nameMatch ? nameMatch[1].trim() : 'Terminal Visitor';
    const email = emailMatch ? emailMatch[1].trim() : 'visitor@terminal.sh';
    const message = msgMatch ? msgMatch[1].trim() : fullCmd.replace(/^contact\s*/i, '');

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: 'CLI Terminal Dispatch',
          message,
          source: 'terminal'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setEntries(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            command: fullCmd,
            timestamp: new Date().toLocaleTimeString(),
            type: 'success',
            payload: `✓ Message dispatched and saved into MongoDB database!\nRecord ID: ${data.data?.id || 'doc-ok'}\nTimestamp: ${data.data?.createdAt}`
          }
        ]);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      setEntries(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          command: fullCmd,
          timestamp: new Date().toLocaleTimeString(),
          type: 'error',
          payload: `Failed to save message: ${err.message}. Or use the visual contact form below.`
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputVal('');
        } else {
          setHistoryIndex(nextIndex);
          setInputVal(commandHistory[nextIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const available = ['help', 'whoami', 'projects', 'skills', 'experience', 'contact', 'ls', 'cat', 'messages', 'go-arch', 'health', 'status', 'retry-db', 'clear', 'theme', 'gui', 'light', 'white', 'dark'];
      const match = available.find(c => c.startsWith(inputVal.toLowerCase().trim()));
      if (match) {
        setInputVal(match);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick action commands for mobile & quick taps
  const quickActions = [
    { label: 'help', cmd: 'help' },
    { label: 'whoami', cmd: 'whoami' },
    { label: 'projects', cmd: 'projects' },
    { label: 'skills', cmd: 'skills' },
    { label: 'experience', cmd: 'experience' },
    { label: 'contact', cmd: 'contact' },
    { label: 'messages (DB)', cmd: 'messages' },
    { label: 'go-arch', cmd: 'go-arch' },
    { label: 'theme toggle', cmd: 'theme toggle' },
    { label: 'clear', cmd: 'clear' },
  ];

  return (
    <div
      id="terminal-section"
      className={`relative w-full rounded-xl border ${themeClasses.border} ${
        isDark ? 'bg-[#0c1017]/95 text-slate-200' : 'bg-white/95 text-slate-800 shadow-xl shadow-slate-200/70 border-slate-300'
      } backdrop-blur-md overflow-hidden transition-all duration-300 ${themeClasses.glow} ${
        isMaximized ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[620px] max-h-[85vh]'
      }`}
      onClick={handleContainerClick}
    >
      {/* Terminal Title Bar */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b select-none transition-colors ${
          isDark ? 'bg-[#111620] border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" onClick={() => setEntries([])} title="Clear Screen" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" onClick={() => setIsMaximized(false)} title="Restore Window" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" onClick={() => setIsMaximized(!isMaximized)} title="Maximize Window" />
          <span className={`ml-2 text-xs font-mono hidden sm:inline flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <TerminalIcon className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            imrul@portfolio: ~/code (main) — zsh
          </span>
        </div>

        {/* Action Controls & Theme Selector */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <div
            className={`hidden md:flex items-center gap-1 px-2 py-1 rounded border ${
              isDark
                ? 'bg-black/40 border-white/5 text-slate-400'
                : 'bg-white border-slate-200 text-slate-600 shadow-2xs'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'} animate-pulse`}></span>
            <span>Golang + Mongo: ACTIVE</span>
          </div>

          {/* Theme Toggle Button (Light/Dark switch right in terminal title bar) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
            className={`px-2 py-1 rounded border transition-colors flex items-center gap-1 text-[11px] ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-white hover:bg-slate-200 text-slate-700 border-slate-300 shadow-2xs'
            }`}
            title={isDark ? 'Switch to White Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-indigo-600" />}
            <span className="capitalize">{isDark ? 'Dark' : 'White'}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const themes: ('emerald' | 'cyan' | 'amber' | 'violet')[] = ['emerald', 'cyan', 'amber', 'violet'];
              const next = themes[(themes.indexOf(terminalTheme) + 1) % themes.length];
              setTerminalTheme(next);
            }}
            className={`px-2 py-1 rounded border transition-colors flex items-center gap-1 text-[11px] ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-white hover:bg-slate-200 text-slate-700 border-slate-300 shadow-2xs'
            }`}
            title="Cycle terminal accent color"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="capitalize">{terminalTheme}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
            className={`p-1.5 rounded border transition-colors ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-white hover:bg-slate-200 text-slate-700 border-slate-300 shadow-2xs'
            }`}
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="p-4 sm:p-5 font-mono text-sm overflow-y-auto h-[calc(100%-7.5rem)] space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-2 leading-relaxed">
            {/* Command prompt line */}
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>imrul@devbox</span>
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>:</span>
              <span className={isDark ? 'text-cyan-400' : 'text-cyan-700 font-semibold'}>~/portfolio</span>
              <span className={isDark ? 'text-purple-400 font-semibold' : 'text-purple-700 font-semibold'}>(main)</span>
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>$</span>
              <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{entry.command}</span>
              <span className={`text-[10px] ml-auto hidden sm:inline ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{entry.timestamp}</span>
            </div>

            {/* Rendered Command Output */}
            <div className={`pl-2 sm:pl-4 border-l-2 ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-300 text-slate-700'}`}>
              {entry.type === 'system' && entry.payload?.banner && (
                <div className="space-y-3 py-1">
                  <div className={`font-mono text-xs sm:text-sm ${themeClasses.text} whitespace-pre font-bold leading-tight select-none overflow-x-auto`}>
{`  ___                      _   _  __      _         _  ___                   
 |_ _| _ __ ___   _ _  _  | | | |/ /__ _ (_) ___   | |/ / |_   __ _ _ _   
  | | | '  \\| '_| | | || | | | | ' </ _\` || |(_-<   | ' <| ' \\ / _\` | ' \\  
 |___||_|_|_|_|    \\_,_/  |_| |_|\\_\\__,_||_|/__/   |_|\\_\\_||_\\__,_|_||_| `}
                  </div>
                  <div
                    className={`p-3 rounded border text-xs sm:text-sm space-y-1 ${
                      isDark
                        ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Senior Full Stack Engineer — 7+ Years Scalable SaaS & Microservices
                    </p>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      Welcome to my interactive terminal portfolio. Engineered with <span className={`font-mono ${isDark ? 'text-cyan-300' : 'text-cyan-700 font-semibold'}`}>React/Next</span>, <span className={`font-mono ${isDark ? 'text-emerald-300' : 'text-emerald-700 font-semibold'}`}>Golang</span>, and <span className={`font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-700 font-semibold'}`}>MongoDB</span>.
                    </p>
                    <p className={`pt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Type <span className={`font-bold underline cursor-pointer ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} onClick={() => executeCommand('help')}>help</span> to view commands, or use the interactive quick pills below.
                    </p>
                  </div>
                </div>
              )}

              {entry.type === 'system' && entry.payload?.text && (
                <pre className="whitespace-pre-wrap text-xs text-slate-300 font-mono bg-black/40 p-3 rounded border border-slate-800">
                  {entry.payload.text}
                </pre>
              )}

              {entry.type === 'help' && (
                <div className="space-y-3 py-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Interactive Commands:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {[
                      { cmd: 'whoami', desc: 'Display engineering credentials, profile, and metrics.' },
                      { cmd: 'projects', desc: 'Showcase enterprise SaaS, data pipelines, & IoT projects.' },
                      { cmd: 'skills', desc: 'Explore categorized backend, frontend, cloud, & DB skills.' },
                      { cmd: 'experience', desc: 'Chronological work history (Pronto, MeldCx, Bitstrapped...)' },
                      { cmd: 'contact', desc: 'Contact info & instant message dispatch to MongoDB.' },
                      { cmd: 'messages', desc: 'Query database messages saved from visitors & recruiters.' },
                      { cmd: 'go-arch', desc: 'Examine Golang microservice & MongoDB schema architecture.' },
                      { cmd: 'ls', desc: 'List virtual project files (resume.md, backend-go/main.go...)' },
                      { cmd: 'cat [file]', desc: 'Read file contents (e.g., cat resume.md)' },
                      { cmd: 'gui [section]', desc: 'Scroll directly to GUI section (e.g., gui projects)' },
                      { cmd: 'theme [color]', desc: 'Switch terminal palette (emerald, cyan, amber, violet)' },
                      { cmd: 'clear', desc: 'Wipe all terminal output history.' },
                    ].map((item) => (
                      <div
                        key={item.cmd}
                        onClick={() => executeCommand(item.cmd)}
                        className="p-2 rounded bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 cursor-pointer transition-colors flex items-baseline justify-between gap-2"
                      >
                        <span className="text-emerald-400 font-semibold">{item.cmd}</span>
                        <span className="text-slate-400 text-right text-[11px]">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {entry.type === 'whoami' && (
                <div className="space-y-3 py-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base font-bold text-white">{PERSONAL_INFO.name}</h3>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {PERSONAL_INFO.title}
                    </span>
                    <span className="text-xs text-slate-400">📍 {PERSONAL_INFO.location}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                    {PERSONAL_INFO.summary}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Experience</div>
                      <div className="text-sm font-bold text-emerald-400">{PERSONAL_INFO.yearsOfExperience} Years</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Daily Bookings Scaled</div>
                      <div className="text-sm font-bold text-cyan-400">5,000+ Bookings</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Active SaaS Members</div>
                      <div className="text-sm font-bold text-purple-400">37,000+ Users</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Daily API Volume</div>
                      <div className="text-sm font-bold text-amber-400">100K+ Req/Day</div>
                    </div>
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="text-slate-400">Certifications:</span>
                    {PERSONAL_INFO.certifications.map((c) => (
                      <span key={c.title} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {c.title} ({c.year})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {entry.type === 'projects' && (
                <div className="space-y-4 py-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Displaying {entry.payload?.length || 0} production projects (type <span className="text-emerald-400 font-mono">gui projects</span> to view in graphical mode):
                    </p>
                    <button
                      onClick={() => onNavigateSection?.('projects')}
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Open in Gallery <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {entry.payload?.map((p: any) => (
                      <div key={p.id} className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{p.title}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-white/5">
                              {p.category}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">{p.clientOrCompany}</span>
                        </div>
                        <p className="text-xs text-slate-300">{p.description}</p>
                        {p.metrics && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {p.metrics.map((m: string) => (
                              <span key={m} className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                                ⚡ {m}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.techStack.map((tech: string) => (
                            <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 font-mono">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {entry.type === 'skills' && (
                <div className="space-y-4 py-1">
                  <p className="text-xs text-slate-400">Core Engineering Proficiencies across 7+ Years:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {entry.payload?.map((cat: any) => (
                      <div key={cat.id} className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                          <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5 text-cyan-400" />
                            {cat.name}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          {cat.skills.map((s: any) => (
                            <div key={s.name} className="flex items-center justify-between text-xs p-1 rounded bg-black/30 px-2">
                              <span className="text-slate-200">{s.name}</span>
                              <span className={`text-[10px] font-mono ${s.level === 'Expert' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                                {s.years || s.level}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {entry.type === 'experience' && (
                <div className="space-y-3 py-1">
                  <p className="text-xs text-slate-400">Chronological Career Experience:</p>
                  {entry.payload?.map((exp: any) => (
                    <div key={exp.id} className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <div>
                          <span className="font-bold text-white text-sm">{exp.role}</span>
                          <span className="text-emerald-400 font-mono text-xs ml-2">@{exp.company}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{exp.period}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">📍 {exp.location}</div>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {exp.highlights.slice(0, 3).map((h: string, idx: number) => (
                          <li key={idx} className="line-clamp-2">{h}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {exp.technologies.slice(0, 6).map((t: string) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {entry.type === 'contact' && (
                <div className="space-y-3 py-1">
                  <p className="text-xs text-slate-300">
                    Get in touch with Imrul Kais Khan directly:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <a
                      href={`mailto:${PERSONAL_INFO.email}`}
                      className="p-2.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between group text-slate-200"
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-emerald-400" />
                        {PERSONAL_INFO.email}
                      </span>
                      <span className="text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">email</span>
                    </a>
                    <a
                      href={PERSONAL_INFO.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between group text-slate-200"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        linkedin.com/in/{PERSONAL_INFO.linkedinUsername}
                      </span>
                      <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">open</span>
                    </a>
                    <a
                      href={PERSONAL_INFO.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between group text-slate-200"
                    >
                      <span className="flex items-center gap-2">
                        <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
                        github.com/{PERSONAL_INFO.githubUsername}
                      </span>
                      <span className="text-[10px] text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">open</span>
                    </a>
                    <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-200">
                      <span className="flex items-center gap-2">
                        <span className="text-amber-400 font-mono">📱</span>
                        {PERSONAL_INFO.phone}
                      </span>
                      <span className="text-[10px] text-slate-500">Dhaka (GMT+6)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/50 rounded border border-emerald-500/20 text-xs space-y-2">
                    <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5" />
                      Dispatch Message Directly to MongoDB from CLI:
                    </p>
                    <p className="text-slate-400">
                      Syntax: <code className="text-slate-200 font-mono bg-black/40 px-1.5 py-0.5 rounded">contact --name "Your Name" --email "you@company.com" --msg "Hello"</code>
                    </p>
                    <button
                      onClick={() => onNavigateSection?.('contact')}
                      className="mt-1 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                    >
                      Or open graphical contact form <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {entry.type === 'ls' && (
                <div className="flex flex-wrap gap-3 py-1 text-xs">
                  {entry.payload?.map((file: string) => (
                    <span
                      key={file}
                      onClick={() => executeCommand(`cat ${file}`)}
                      className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono border border-slate-800 cursor-pointer flex items-center gap-1.5"
                    >
                      📄 {file}
                    </span>
                  ))}
                </div>
              )}

              {entry.type === 'cat' && (
                <div className="space-y-2 py-1">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-1">
                    <span>File: {entry.payload?.filename}</span>
                    <button
                      onClick={() => copyToClipboard(entry.payload?.content)}
                      className="hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-xs text-slate-300 font-mono bg-black/60 p-3 rounded border border-slate-800 max-h-80 overflow-y-auto">
                    {entry.payload?.content}
                  </pre>
                </div>
              )}

              {entry.type === 'go-arch' && (
                <div className="space-y-3 py-1 text-xs">
                  <div className="p-3 bg-slate-900/90 rounded border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5 text-sm">
                        <Database className="w-4 h-4 text-emerald-400" />
                        Golang Microservice & MongoDB Database Engine
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        Go v1.22 + Gin
                      </span>
                    </div>
                    <p className="text-slate-300">
                      The backend uses a Golang microservice architecture with the official MongoDB Go driver (<code className="text-cyan-300">go.mongodb.org/mongo-driver/mongo</code>) and Gin web framework for high concurrency message persistence.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                      <div className="p-2 rounded bg-black/40 border border-slate-800">
                        <span className="text-slate-500">Target Database:</span>
                        <div className="text-emerald-400 font-bold">MongoDB 6.0+ (portfolio_db)</div>
                        <span className="text-slate-500 text-[10px]">Collection: messages</span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-slate-800">
                        <span className="text-slate-500">Go Microservice Path:</span>
                        <div className="text-cyan-400 font-bold">/backend-go/main.go</div>
                        <span className="text-slate-500 text-[10px]">Gin Router + BSON Serializers</span>
                      </div>
                    </div>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => executeCommand('cat backend-go/main.go')}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5"
                      >
                        <Code className="w-3 h-3 text-cyan-400" />
                        Inspect main.go source
                      </button>
                      <button
                        onClick={() => executeCommand('cat mongo-schema.json')}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5"
                      >
                        <Database className="w-3 h-3 text-emerald-400" />
                        Inspect Mongo BSON Schema
                      </button>
                      {onOpenGoModal && (
                        <button
                          onClick={onOpenGoModal}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 ml-auto"
                        >
                          View Interactive Go & Mongo Studio
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {entry.type === 'messages' && (
                <div className="space-y-3 py-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Database className="w-3.5 h-3.5" />
                      MongoDB Database Query: {entry.payload?.messages?.length || 0} Records
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {entry.payload?.source}
                    </span>
                  </div>
                  {entry.payload?.messages?.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No messages stored in database yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {entry.payload?.messages?.map((msg: ContactMessage) => (
                        <div key={msg.id} className="p-2.5 rounded bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{msg.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-cyan-400 text-[11px]">{msg.email} {msg.subject && `• ${msg.subject}`}</div>
                          <p className="text-slate-300 text-xs bg-black/30 p-1.5 rounded">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {entry.type === 'error' && (
                <div className="text-red-400 text-xs font-mono py-1">
                  {entry.payload}
                </div>
              )}

              {entry.type === 'success' && (
                <div className="text-emerald-400 text-xs font-mono py-1 whitespace-pre-wrap">
                  {entry.payload}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Action Pills for Mobile & Easy Click Navigation */}
      <div
        className={`absolute bottom-12 left-0 right-0 px-4 py-1.5 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none transition-colors ${
          isDark ? 'bg-[#0b0e14]/90 border-white/5' : 'bg-slate-100/90 border-slate-200'
        }`}
      >
        <span className={`text-[10px] font-mono shrink-0 uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Quick:</span>
        {quickActions.map((qa) => (
          <button
            key={qa.label}
            onClick={(e) => {
              e.stopPropagation();
              executeCommand(qa.cmd);
            }}
            className={`shrink-0 px-2 py-0.5 rounded font-mono text-xs border transition-colors ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border-white/5'
                : 'bg-white hover:bg-slate-200 text-slate-700 hover:text-emerald-700 border-slate-200 shadow-2xs'
            }`}
          >
            {qa.label}
          </button>
        ))}
      </div>

      {/* Terminal Input Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-4 py-2.5 border-t flex items-center space-x-2 transition-colors ${
          isDark ? 'bg-[#090c12] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <span className={`font-bold font-mono text-xs sm:text-sm shrink-0 select-none ${
          isDark ? 'text-emerald-400' : 'text-emerald-700'
        }`}>
          imrul@dev:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command (try 'projects', 'skills', 'contact', 'theme white', 'help')..."
          autoFocus
          className={`flex-1 bg-transparent border-none outline-none font-mono text-xs sm:text-sm focus:ring-0 ${
            isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'
          }`}
        />
        <button
          onClick={() => executeCommand(inputVal)}
          disabled={!inputVal.trim() || isSubmitting}
          className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors shrink-0"
          title="Execute Command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
