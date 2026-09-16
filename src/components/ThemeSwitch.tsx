import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeSwitchProps {
  compact?: boolean;
  className?: string;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ compact = false, className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={!isDark}
      aria-label={`Switch to ${isDark ? 'White' : 'Dark'} theme`}
      className={`relative inline-flex items-center rounded-full p-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        isDark
          ? 'bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-300'
          : 'bg-slate-100 border border-slate-300 hover:border-slate-400 text-slate-700 shadow-inner'
      } ${compact ? 'h-8 px-1' : 'h-9 px-1.5'} ${className}`}
      title={isDark ? 'Switch to White Theme' : 'Switch to Dark Theme'}
    >
      {/* Visual track with Sun and Moon icons */}
      <div className="flex items-center justify-between w-full gap-2 px-1 text-xs font-mono select-none">
        <span
          className={`flex items-center justify-center transition-colors duration-200 ${
            !isDark ? 'text-amber-500 font-bold' : 'text-slate-500 opacity-60'
          }`}
        >
          <Sun className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </span>

        {!compact && (
          <span className="text-[11px] font-mono tracking-tight font-medium px-1 hidden sm:inline">
            {isDark ? 'Dark' : 'White'}
          </span>
        )}

        <span
          className={`flex items-center justify-center transition-colors duration-200 ${
            isDark ? 'text-cyan-400 font-bold' : 'text-slate-400 opacity-60'
          }`}
        >
          <Moon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </span>
      </div>

      {/* Sliding knob indicator */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className={`absolute top-1 bottom-1 rounded-full shadow-md pointer-events-none flex items-center justify-center ${
          isDark
            ? 'right-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950'
            : 'left-1 bg-white text-amber-500 border border-amber-200 shadow-amber-500/10'
        } ${compact ? 'w-6' : 'w-7'}`}
      >
        {isDark ? (
          <Moon className={compact ? 'w-3 h-3 text-slate-950' : 'w-3.5 h-3.5 text-slate-950'} />
        ) : (
          <Sun className={compact ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
        )}
      </motion.div>
    </button>
  );
};
