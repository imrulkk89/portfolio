import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalComponent } from './components/Terminal';
import { ProjectShowcase } from './components/ProjectShowcase';
import { TechStackShowcase } from './components/TechStackShowcase';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ContactSection } from './components/ContactSection';
import { InteractiveBackground } from './components/InteractiveBackground';
import { GoMongoArchitectureModal } from './components/GoMongoArchitectureModal';
import { Navbar } from './components/Navbar';
import { PERSONAL_INFO } from './data/portfolioData';
import { useTheme } from './context/ThemeContext';
import {
  Terminal as TerminalIcon,
  Layers,
  Globe,
  Github,
  Linkedin,
  Mail,
  Cpu,
  Database
} from 'lucide-react';

export default function App() {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('terminal');
  const [isGoModalOpen, setIsGoModalOpen] = useState<boolean>(false);
  const [terminalOnlyMode, setTerminalOnlyMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'terminal' | 'projects' | 'skills' | 'experience' | 'contact'>('all');

  // Listen to navigation requests from terminal or navbar
  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'terminal') {
      const el = document.getElementById('terminal-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInspectInTerminal = (cmd: string) => {
    const el = document.getElementById('terminal-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden font-sans transition-colors duration-300 ${
        isDark
          ? 'bg-[#0a0c10] text-[#e6edf3] selection:bg-emerald-500/30 selection:text-emerald-300'
          : 'bg-[#f8fafc] text-slate-800 selection:bg-emerald-200 selection:text-emerald-900'
      }`}
    >
      {/* Interactive CSS & JS Canvas Background Animation */}
      <InteractiveBackground interactive={true} />

      {/* Navigation Header with Theme Switcher */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigateSection}
        onOpenGoModal={() => setIsGoModalOpen(true)}
        terminalOnlyMode={terminalOnlyMode}
        onToggleTerminalMode={() => setTerminalOnlyMode(!terminalOnlyMode)}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Landing Hero Section */}
        <section className="relative pt-4 sm:pt-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
          >
            <div className="space-y-4 max-w-2xl">
              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
                    isDark
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold shadow-2xs'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available for Senior Software Roles
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono border ${
                    isDark
                      ? 'bg-slate-900/90 text-slate-400 border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 shadow-2xs'
                  }`}
                >
                  <Globe className="w-3 h-3 text-cyan-500" />
                  Dhaka, Bangladesh • Remote Ready
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1
                  className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500">{PERSONAL_INFO.name}</span>
                </h1>
                <p
                  className={`text-lg sm:text-xl font-medium mt-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  {PERSONAL_INFO.title} • {PERSONAL_INFO.yearsOfExperience} Years SaaS & Cloud Experience
                </p>
              </div>

              <p
                className={`text-sm sm:text-base leading-relaxed max-w-xl ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Specializing in scalable distributed architectures, NestJS, Golang microservices, MongoDB & PostgreSQL datastores, and cloud automation on AWS and GCP.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleNavigateSection('terminal')}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm font-mono flex items-center gap-2 transition-all ${
                    isDark
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  <TerminalIcon className="w-4 h-4" />
                  <span>Launch CLI Terminal</span>
                </button>

                <button
                  onClick={() => handleNavigateSection('projects')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors border ${
                    isDark
                      ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-2xs'
                  }`}
                >
                  <Layers className="w-4 h-4 text-cyan-500" />
                  <span>View Projects</span>
                </button>

                <button
                  onClick={() => setIsGoModalOpen(true)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono flex items-center gap-2 transition-colors border ${
                    isDark
                      ? 'bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border-cyan-500/30'
                      : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-300 shadow-2xs'
                  }`}
                >
                  <Database className="w-4 h-4 text-cyan-500" />
                  <span>Go + Mongo Arch</span>
                </button>

                <button
                  onClick={() => handleNavigateSection('contact')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors border ${
                    isDark
                      ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-2xs'
                  }`}
                >
                  <Mail className="w-4 h-4 text-purple-500" />
                  <span>Contact Form</span>
                </button>
              </div>

              {/* Social links */}
              <div
                className={`flex items-center gap-4 pt-2 text-xs font-mono ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 transition-colors ${
                    isDark ? 'hover:text-white' : 'hover:text-slate-900'
                  }`}
                >
                  <Github className="w-4 h-4" />
                  <span>github.com/{PERSONAL_INFO.githubUsername}</span>
                </a>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-500 flex items-center gap-1.5 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-500" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>

            {/* Right: Interactive System Telemetry Card */}
            <div
              className={`w-full lg:w-96 rounded-2xl border p-5 space-y-4 backdrop-blur-md shadow-xl transition-colors ${
                isDark
                  ? 'border-slate-800 bg-[#0e131e]/90 text-slate-300'
                  : 'border-slate-200 bg-white/95 text-slate-700 shadow-slate-200/60'
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <span
                  className={`text-xs font-mono flex items-center gap-1.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                  ENGINEERING_TELEMETRY.sys
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Total Experience:</span>
                  <span className="text-emerald-500 font-bold">{PERSONAL_INFO.yearsOfExperience} Years</span>
                </div>
                <div
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Backend Core:</span>
                  <span className="text-cyan-500 font-bold">Node.js / NestJS / Go</span>
                </div>
                <div
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Databases:</span>
                  <span className="text-purple-500 font-bold">MongoDB / PostgreSQL / Redis</span>
                </div>
                <div
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Cloud Infrastructure:</span>
                  <span className="text-blue-500 font-bold">AWS & GCP / Terraform</span>
                </div>
                <div
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Top Scaled Platform:</span>
                  <span className="text-amber-500 font-bold">37K+ Users • Pronto Pilates</span>
                </div>
              </div>

              <div
                className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                  isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                <span>Database: MongoDB 6.0+</span>
                <span className="text-emerald-500 font-bold">Port 3000 Active</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section View Mode Switcher (Smooth Animated Switch) */}
        <div
          className={`sticky top-16 z-30 py-2 backdrop-blur-md flex items-center justify-between border-y transition-colors ${
            isDark ? 'bg-[#0a0c10]/80 border-slate-800/80' : 'bg-[#f8fafc]/90 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Complete Overview' },
              { id: 'terminal', label: 'Interactive Terminal' },
              { id: 'projects', label: 'Projects Gallery' },
              { id: 'skills', label: 'Tech Stack' },
              { id: 'experience', label: 'Work Experience' },
              { id: 'contact', label: 'Contact & DB' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id !== 'all') {
                    handleNavigateSection(tab.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap border ${
                  activeTab === tab.id
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-white text-emerald-800 border-slate-300 shadow-2xs font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className={`hidden sm:flex items-center gap-2 text-xs font-mono ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            <span>Terminal + Next.js + Tailwind</span>
          </div>
        </div>

        {/* Section Switcher Container with Smooth Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-16"
          >
            {/* Terminal Section */}
            {(activeTab === 'all' || activeTab === 'terminal') && (
              <div id="terminal-section" className="scroll-mt-24 space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex items-center gap-2 text-xs font-mono ${
                      isDark ? 'text-emerald-400' : 'text-emerald-700 font-bold'
                    }`}
                  >
                    <TerminalIcon className="w-3.5 h-3.5" />
                    <span>INTERACTIVE COMMAND LINE INTERFACE</span>
                  </div>
                  <span
                    className={`text-xs font-mono hidden sm:inline ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    Tab to autocomplete • Up/Down for history • Try 'white' or 'theme toggle'
                  </span>
                </div>
                <TerminalComponent
                  onNavigateSection={handleNavigateSection}
                  onOpenGoModal={() => setIsGoModalOpen(true)}
                />
              </div>
            )}

            {/* Projects Showcase */}
            {(activeTab === 'all' || activeTab === 'projects') && (
              <div id="projects" className="scroll-mt-24">
                <ProjectShowcase onInspectInTerminal={handleInspectInTerminal} />
              </div>
            )}

            {/* Tech Stack & Skills */}
            {(activeTab === 'all' || activeTab === 'skills') && (
              <div id="skills" className="scroll-mt-24">
                <TechStackShowcase onInspectInTerminal={handleInspectInTerminal} />
              </div>
            )}

            {/* Experience Timeline */}
            {(activeTab === 'all' || activeTab === 'experience') && (
              <div id="experience" className="scroll-mt-24">
                <ExperienceTimeline onInspectInTerminal={handleInspectInTerminal} />
              </div>
            )}

            {/* Contact & Database Message Storage */}
            {(activeTab === 'all' || activeTab === 'contact') && (
              <div id="contact" className="scroll-mt-24">
                <ContactSection onInspectInTerminal={handleInspectInTerminal} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer
        className={`relative z-10 border-t py-8 text-xs font-mono transition-colors ${
          isDark
            ? 'border-slate-800/80 bg-[#07090d] text-slate-500'
            : 'border-slate-200 bg-white text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              {PERSONAL_INFO.name}
            </span>
            <span>• Senior Full Stack Engineer</span>
            <span>• Dhaka, Bangladesh</span>
          </div>
          <div className={`flex items-center gap-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500">
              GitHub
            </a>
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500">
              LinkedIn
            </a>
            <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:text-purple-500">
              Email
            </a>
            <button onClick={() => setIsGoModalOpen(true)} className="hover:text-emerald-500">
              Golang Backend
            </button>
          </div>
        </div>
      </footer>

      {/* Golang Microservice & MongoDB Architecture Modal */}
      <GoMongoArchitectureModal
        isOpen={isGoModalOpen}
        onClose={() => setIsGoModalOpen(false)}
        onRunTerminalCommand={handleInspectInTerminal}
      />
    </div>
  );
}
