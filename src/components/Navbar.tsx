import React, { useState, useEffect } from 'react';
import { Terminal, Database, Menu, X, Clock, Layers, Cpu, Briefcase, Mail } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitch } from './ThemeSwitch';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenGoModal: () => void;
  terminalOnlyMode: boolean;
  onToggleTerminalMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenGoModal,
  terminalOnlyMode,
  onToggleTerminalMode
}) => {
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [dhakaTime, setDhakaTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const time = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(new Date());
        setDhakaTime(time);
      } catch {
        setDhakaTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'skills', label: 'Tech Stack', icon: Cpu },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'contact', label: 'Contact & DB', icon: Mail },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-300 ${
        isDark
          ? 'border-slate-800/80 bg-[#0a0c10]/90 text-white'
          : 'border-slate-200/90 bg-white/90 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('terminal')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div
              className={`w-8 h-8 rounded-lg border flex items-center justify-center font-mono font-bold text-sm transition-all ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
              }`}
            >
              <span>&gt;_</span>
            </div>
            <div>
              <span
                className={`font-bold text-sm tracking-tight flex items-center gap-1.5 transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {PERSONAL_INFO.name}
              </span>
              <span
                className={`text-[10px] font-mono block transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Senior Full Stack Engineer
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation */}
        <nav
          className={`hidden md:flex items-center gap-1 p-1 rounded-xl border transition-colors ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100/90 border-slate-200'
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono flex items-center gap-1.5 transition-all ${
                  isActive
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                      : 'bg-white text-emerald-700 border border-slate-200 shadow-xs font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Dhaka Time, Go/Mongo Arch, Terminal Toggle & Theme Switch */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs font-mono">
          {/* Dhaka Time Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-900/70 border-slate-800 text-slate-400'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <Clock className="w-3 h-3 text-cyan-500" />
            <span>Dhaka {dhakaTime || '12:00:00'} (UTC+6)</span>
          </div>

          {/* Go + Mongo Architecture Trigger */}
          <button
            onClick={onOpenGoModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              isDark
                ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40'
                : 'bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100/70'
            }`}
            title="Inspect Golang Microservice & MongoDB Architecture"
          >
            <Database className="w-3.5 h-3.5 text-cyan-500" />
            <span>Go + Mongo Arch</span>
          </button>

          {/* Quick Terminal Focus Toggle */}
          <button
            onClick={onToggleTerminalMode}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
              terminalOnlyMode
                ? isDark
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                  : 'bg-emerald-600 text-white border-emerald-600 font-bold'
                : isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{terminalOnlyMode ? 'Split View' : 'Terminal View'}</span>
          </button>

          {/* White / Dark Theme Switch */}
          <ThemeSwitch />
        </div>

        {/* Mobile menu and mobile theme toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitch compact={true} />

          <button
            onClick={onToggleTerminalMode}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-800 text-emerald-400 border-slate-700'
                : 'bg-slate-100 text-emerald-700 border-slate-200'
            }`}
            title="Toggle Terminal Mode"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-100 text-slate-700 hover:text-slate-950'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 pt-3 pb-5 space-y-3 transition-colors ${
            isDark ? 'border-slate-800 bg-[#0c1017]' : 'border-slate-200 bg-white shadow-lg'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-2 border-b text-xs font-mono transition-colors ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
            }`}
          >
            <span>📍 Dhaka, Bangladesh</span>
            <span>🕒 {dhakaTime}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span
              className={`text-xs font-mono font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Appearance Theme:
            </span>
            <ThemeSwitch />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors ${
                    isActive
                      ? isDark
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : isDark
                      ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onOpenGoModal();
                setMobileMenuOpen(false);
              }}
              className={`w-full py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-2 transition-colors ${
                isDark
                  ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
                  : 'bg-cyan-50 border-cyan-200 text-cyan-800'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-cyan-500" />
              <span>Inspect Go + MongoDB Service</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
