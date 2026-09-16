import React, { useState } from 'react';
import { SKILL_CATEGORIES, PERSONAL_INFO } from '../data/portfolioData';
import { Code, Database, Layout, Cloud, TrendingUp, Award, Terminal, Cpu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TechStackShowcaseProps {
  onInspectInTerminal?: (cmd: string) => void;
}

export const TechStackShowcase: React.FC<TechStackShowcaseProps> = ({ onInspectInTerminal }) => {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'backend':
        return <Cpu className="w-4 h-4 text-emerald-500" />;
      case 'databases':
        return <Database className="w-4 h-4 text-cyan-500" />;
      case 'frontend':
        return <Layout className="w-4 h-4 text-purple-500" />;
      case 'cloud-devops':
        return <Cloud className="w-4 h-4 text-blue-500" />;
      case 'data-pipelines':
        return <TrendingUp className="w-4 h-4 text-amber-500" />;
      default:
        return <Code className="w-4 h-4 text-slate-500" />;
    }
  };

  const categoriesToShow = activeCategory === 'all'
    ? SKILL_CATEGORIES
    : SKILL_CATEGORIES.filter(c => c.id === activeCategory);

  return (
    <section id="skills" className="space-y-6 pt-6">
      {/* Header */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5 transition-colors ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>02 / TECHNICAL COMPETENCIES</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Tech Stack & Engineering Skills
          </h2>
          <p
            className={`text-sm mt-1 max-w-2xl transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            7+ years of building resilient production software across full-stack TypeScript, Golang microservices, scalable distributed datastores, and cloud automation.
          </p>
        </div>

        {/* Category Pills */}
        <div
          className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-lg border self-start md:self-auto transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'bg-white text-emerald-800 border border-slate-200 shadow-xs font-bold'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Disciplines
          </button>
          {SKILL_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === c.id
                  ? isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                    : 'bg-white text-emerald-800 border border-slate-200 shadow-xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.name.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoriesToShow.map((cat) => (
          <div
            key={cat.id}
            className={`rounded-xl border p-5 space-y-4 transition-colors ${
              isDark
                ? 'border-slate-800/90 bg-[#0e131d]/70 hover:border-slate-700 text-slate-200'
                : 'border-slate-200/90 bg-white hover:border-slate-300 text-slate-800 shadow-sm'
            }`}
          >
            <div
              className={`flex items-center justify-between border-b pb-3 transition-colors ${
                isDark ? 'border-slate-800/80' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg border transition-colors ${
                    isDark ? 'bg-slate-800/80 border-white/5' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {cat.name}
                  </h3>
                  <p className={`text-[11px] line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {cat.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {cat.skills.map((skill) => (
                <div
                  key={skill.name}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                    isDark
                      ? 'bg-slate-900/50 hover:bg-slate-800/40 border-white/5 text-slate-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200/70 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {skill.featured && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
                    )}
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {skill.years}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded border ${
                        skill.level === 'Expert'
                          ? isDark
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                          : skill.level === 'Advanced'
                          ? isDark
                            ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/20'
                            : 'bg-cyan-50 text-cyan-800 border-cyan-200 font-semibold'
                          : isDark
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Certifications and Credentials Card */}
        <div
          className={`rounded-xl border p-5 space-y-4 transition-colors ${
            isDark
              ? 'border-slate-800/90 bg-[#0e131d]/70 text-slate-200'
              : 'border-slate-200/90 bg-white text-slate-800 shadow-sm'
          }`}
        >
          <div
            className={`flex items-center gap-2.5 border-b pb-3 transition-colors ${
              isDark ? 'border-slate-800/80' : 'border-slate-100'
            }`}
          >
            <div
              className={`p-2 rounded-lg border transition-colors ${
                isDark ? 'bg-slate-800/80 border-white/5' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Verified Certifications
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Cloud & Kubernetes certifications
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {PERSONAL_INFO.certifications.map((cert) => (
              <div
                key={cert.title}
                className={`p-3 rounded-lg border space-y-1 transition-colors ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {cert.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isDark
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        : 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'
                    }`}
                  >
                    {cert.badge}
                  </span>
                </div>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {cert.issuer} • {cert.year}
                </p>
              </div>
            ))}

            <div
              className={`p-3 rounded-lg border space-y-1 transition-colors ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Education
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {PERSONAL_INFO.education.degree}
              </p>
              <p className={`text-[11px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {PERSONAL_INFO.education.institution}
              </p>
            </div>

            {onInspectInTerminal && (
              <button
                onClick={() => onInspectInTerminal('skills')}
                className={`w-full py-2 rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 transition-colors ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                Query Skills via CLI: `skills`
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
