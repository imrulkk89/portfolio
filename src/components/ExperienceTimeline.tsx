import React, { useState } from 'react';
import { EXPERIENCES } from '../data/portfolioData';
import { Briefcase, Calendar, MapPin, CheckCircle2, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ExperienceTimelineProps {
  onInspectInTerminal?: (cmd: string) => void;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ onInspectInTerminal }) => {
  const { isDark } = useTheme();
  const [expandedId, setExpandedId] = useState<string>(EXPERIENCES[0].id);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? '' : id));
  };

  return (
    <section id="experience" className="space-y-6 pt-6">
      {/* Header */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5 transition-colors ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>03 / CAREER TRAJECTORY</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Work Experience & Track Record
          </h2>
          <p
            className={`text-sm mt-1 max-w-2xl transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Over seven years scaling distributed backends, orchestrating cloud infrastructure across AU, US, and Canada, and mentoring software engineering teams.
          </p>
        </div>

        {onInspectInTerminal && (
          <button
            onClick={() => onInspectInTerminal('experience')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors self-start md:self-auto ${
              isDark
                ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300'
                : 'bg-slate-100 border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            CLI: `experience`
          </button>
        )}
      </div>

      {/* Timeline items */}
      <div
        className={`relative pl-6 sm:pl-8 border-l space-y-6 ml-2 sm:ml-4 transition-colors ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        {EXPERIENCES.map((exp, index) => {
          const isExpanded = expandedId === exp.id;
          return (
            <div key={exp.id} className="relative group">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                  index === 0
                    ? isDark
                      ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : 'bg-emerald-600 border-emerald-300 shadow-sm'
                    : isDark
                    ? 'bg-[#0a0c10] border-slate-700 group-hover:border-cyan-400'
                    : 'bg-white border-slate-300 group-hover:border-emerald-500'
                }`}
              />

              {/* Card */}
              <div
                className={`rounded-xl border p-5 transition-all space-y-3 ${
                  isDark
                    ? 'border-slate-800/90 bg-[#0e131d]/80 hover:border-slate-700 text-slate-200'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 text-slate-800 shadow-sm'
                }`}
              >
                {/* Header row */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
                  onClick={() => toggleExpand(exp.id)}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-base font-bold transition-colors ${
                          isDark
                            ? 'text-white group-hover:text-emerald-300'
                            : 'text-slate-900 group-hover:text-emerald-700'
                        }`}
                      >
                        {exp.role}
                      </h3>
                      <span className={`text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        @{exp.company}
                      </span>
                      {exp.badge && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            isDark
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                          }`}
                        >
                          {exp.badge}
                        </span>
                      )}
                    </div>

                    <div className={`flex flex-wrap items-center gap-3 text-xs mt-1 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {exp.period}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`p-1 rounded self-end sm:self-center transition-colors ${
                      isDark
                        ? 'bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                    }`}
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {exp.description}
                </p>

                {/* Highlights */}
                {isExpanded && (
                  <div
                    className={`space-y-2 pt-2 border-t animate-fade-in ${
                      isDark ? 'border-slate-800/80' : 'border-slate-100'
                    }`}
                  >
                    <div
                      className={`text-xs font-semibold font-mono uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      Key Contributions & Impact:
                    </div>
                    <ul className="space-y-2 text-xs">
                      {exp.highlights.map((item, i) => (
                        <li
                          key={i}
                          className={`flex items-start gap-2 p-2.5 rounded-lg border ${
                            isDark
                              ? 'bg-black/20 border-white/5 text-slate-300'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isDark ? 'text-emerald-400' : 'text-emerald-600'
                            }`}
                          />
                          <span className="leading-normal">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Pills */}
                <div
                  className={`flex flex-wrap gap-1 pt-2 border-t ${
                    isDark ? 'border-slate-800/50' : 'border-slate-100'
                  }`}
                >
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDark
                          ? 'bg-slate-900 text-slate-300 border-slate-800'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
