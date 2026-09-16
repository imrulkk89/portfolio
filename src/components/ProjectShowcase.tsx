import React, { useState } from 'react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types';
import { ExternalLink, Terminal, Layers, Activity, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ProjectShowcaseProps {
  onInspectInTerminal?: (cmd: string) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onInspectInTerminal }) => {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', 'Full Stack', 'Cloud & Data', 'Microservices', 'Systems & IoT'];

  const filteredProjects = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="space-y-6 pt-6">
      {/* Section Header */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5 transition-colors ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>01 / FEATURED ARCHITECTURES</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Engineered Projects & Systems
          </h2>
          <p
            className={`text-sm mt-1 max-w-2xl transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Real-world enterprise systems scaling to tens of thousands of users, high-concurrency event brokers, and automated cloud pipelines.
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-lg border self-start md:self-auto transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                    : 'bg-white text-emerald-800 border border-slate-200 shadow-xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`group relative rounded-xl border p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 ${
              isDark
                ? 'border-slate-800/90 bg-[#0e131d]/80 hover:bg-[#121824] hover:border-emerald-500/40 text-slate-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                : 'border-slate-200/90 bg-white hover:border-emerald-500/50 text-slate-800 hover:shadow-xl hover:shadow-slate-200/60'
            }`}
          >
            {/* Top Bar with Category and Company */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full border transition-colors ${
                    isDark
                      ? 'bg-slate-800/90 text-cyan-300 border-white/5'
                      : 'bg-cyan-50 text-cyan-700 border-cyan-200 font-medium'
                  }`}
                >
                  {project.category}
                </span>
                <span
                  className={`text-xs font-mono truncate max-w-[160px] transition-colors ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {project.clientOrCompany}
                </span>
              </div>

              {/* Title and Subtitle */}
              <h3
                className={`text-lg font-bold transition-colors ${
                  isDark
                    ? 'text-white group-hover:text-emerald-400'
                    : 'text-slate-900 group-hover:text-emerald-600'
                }`}
              >
                {project.title}
              </h3>
              <p
                className={`text-xs font-medium mt-0.5 mb-3 line-clamp-1 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {project.subtitle}
              </p>

              {/* Description */}
              <p
                className={`text-xs leading-relaxed line-clamp-3 mb-4 transition-colors ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {project.description}
              </p>

              {/* Key Metrics / Badges */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.metrics.map((metric) => (
                    <span
                      key={metric}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 transition-colors ${
                        isDark
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium'
                      }`}
                    >
                      <Activity className="w-2.5 h-2.5" />
                      {metric}
                    </span>
                  ))}
                </div>
              )}

              {/* Highlights List */}
              <div
                className={`space-y-1.5 mb-4 border-t pt-3 transition-colors ${
                  isDark ? 'border-slate-800/80' : 'border-slate-100'
                }`}
              >
                {project.highlights.slice(0, 2).map((h, i) => (
                  <div
                    key={i}
                    className={`text-[11px] flex items-start gap-1.5 leading-snug transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3 h-3 shrink-0 mt-0.5 ${
                        isDark ? 'text-emerald-400' : 'text-emerald-600'
                      }`}
                    />
                    <span className="line-clamp-2">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: Tech Stack & Actions */}
            <div
              className={`border-t pt-4 mt-auto transition-colors ${
                isDark ? 'border-slate-800/80' : 'border-slate-100'
              }`}
            >
              <div className="flex flex-wrap gap-1 mb-3">
                {project.techStack.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                      isDark
                        ? 'bg-slate-900 text-slate-300 border-slate-800'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 5 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isDark ? 'bg-slate-900 text-slate-500' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    +{project.techStack.length - 5}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                {onInspectInTerminal ? (
                  <button
                    onClick={() => onInspectInTerminal(`projects ${project.id}`)}
                    className={`text-xs flex items-center gap-1.5 font-mono transition-colors ${
                      isDark
                        ? 'text-slate-400 hover:text-emerald-400'
                        : 'text-slate-600 hover:text-emerald-600 font-medium'
                    }`}
                    title="Inspect details in interactive terminal"
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                    <span>inspect</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className={`text-xs font-medium flex items-center gap-1 transition-colors ${
                      isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-700 hover:text-cyan-800'
                    }`}
                  >
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-1.5 rounded transition-colors ${
                        isDark
                          ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950'
                      }`}
                      title="Visit Live Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 shadow-2xl space-y-5 transition-colors ${
              isDark
                ? 'border-slate-700 bg-[#0e131e] text-slate-200'
                : 'border-slate-200 bg-white text-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded border ${
                    isDark
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium'
                  }`}
                >
                  {selectedProject.category}
                </span>
                <h3
                  className={`text-xl font-bold mt-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {selectedProject.title}
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedProject.subtitle}
                </p>
                <div
                  className={`text-xs mt-1 font-mono ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {selectedProject.clientOrCompany} • {selectedProject.role}
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className={`p-3 rounded-lg border text-sm leading-relaxed ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {selectedProject.description}
            </div>

            {selectedProject.metrics && (
              <div>
                <h4
                  className={`text-xs font-semibold uppercase tracking-wider mb-2 font-mono ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Performance & Scale Metrics:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.metrics.map((m) => (
                    <span
                      key={m}
                      className={`px-3 py-1 rounded border text-xs font-mono font-bold ${
                        isDark
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      ⚡ {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4
                className={`text-xs font-semibold uppercase tracking-wider mb-2 font-mono ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Technical Highlights:
              </h4>
              <ul className="space-y-2 text-xs">
                {selectedProject.highlights.map((h, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 p-2 rounded border ${
                      isDark
                        ? 'bg-black/20 border-white/5 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isDark ? 'text-emerald-400' : 'text-emerald-600'
                      }`}
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4
                className={`text-xs font-semibold uppercase tracking-wider mb-2 font-mono ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Full Tech Stack:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className={`px-2 py-1 rounded text-xs font-mono border ${
                      isDark
                        ? 'bg-slate-800 text-slate-200 border-slate-700'
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={`flex items-center justify-end gap-3 pt-3 border-t ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              {onInspectInTerminal && (
                <button
                  onClick={() => {
                    const cmd = `projects ${selectedProject.id}`;
                    setSelectedProject(null);
                    onInspectInTerminal(cmd);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  View in Terminal
                </button>
              )}
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  Visit Live <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
