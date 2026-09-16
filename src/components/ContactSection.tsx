import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Phone, MapPin, Github, Linkedin, Send, Database, CheckCircle, AlertCircle, RefreshCw, Trash2, Terminal, ShieldCheck } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ContactMessage } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ContactSectionProps {
  onInspectInTerminal?: (cmd: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onInspectInTerminal }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  // Stored messages from database
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [dbInfo, setDbInfo] = useState<{
    source: string;
    connected: boolean;
    remoteConfigured: boolean;
    notice: string | null;
  }>({
    source: 'embedded_mongo',
    connected: false,
    remoteConfigured: false,
    notice: null
  });
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [isRetryingDb, setIsRetryingDb] = useState<boolean>(false);
  const [showDbViewer, setShowDbViewer] = useState<boolean>(false);

  const fetchMessagesAndStatus = async () => {
    setIsLoadingMessages(true);
    try {
      const [msgRes, statusRes] = await Promise.all([
        fetch('/api/messages'),
        fetch('/api/mongo/status')
      ]);
      const msgData = await msgRes.json();
      const statusData = await statusRes.json();

      if (msgData.messages) {
        setMessages(msgData.messages);
      }
      setDbInfo({
        source: statusData.database || msgData.source || 'embedded_mongo',
        connected: Boolean(statusData.connected),
        remoteConfigured: Boolean(statusData.remoteUriConfigured),
        notice: statusData.notice || null
      });
    } catch (err) {
      console.error('Failed to load messages or DB status:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleRetryMongo = async () => {
    setIsRetryingDb(true);
    try {
      const res = await fetch('/api/mongo/retry', { method: 'POST' });
      const data = await res.json();
      setDbInfo(prev => ({
        ...prev,
        connected: Boolean(data.connected),
        source: data.database || 'embedded_mongo',
        notice: data.notice || null
      }));
      if (data.connected) {
        setSubmitStatus({
          type: 'success',
          message: 'Successfully connected to MongoDB Atlas remote cluster!'
        });
      }
      fetchMessagesAndStatus();
    } catch (err) {
      console.error('Retry connection error:', err);
    } finally {
      setIsRetryingDb(false);
    }
  };

  useEffect(() => {
    fetchMessagesAndStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setSubmitStatus({ type: 'error', message: 'Please provide your name (at least 2 characters).' });
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setSubmitStatus({ type: 'error', message: 'Please provide a valid email address.' });
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setSubmitStatus({ type: 'error', message: 'Please write a message with at least 5 characters.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'form'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message to database.');
      }

      // Success animation
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });

      setSubmitStatus({
        type: 'success',
        message: `Message saved to ${data.database || 'MongoDB Database'}! Imrul will review it shortly.`
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
      fetchMessagesAndStatus();
    } catch (err: any) {
      setSubmitStatus({
        type: 'error',
        message: err.message || 'An error occurred while saving your message.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const handleFillSample = () => {
    setFormData({
      name: 'Sarah Chen',
      email: 'sarah.chen@techscale.global',
      subject: 'Senior Full Stack Role / Microservices Consulting',
      message: 'Hi Imrul, I was impressed by your work scaling the Pronto Pilates platform and your AWS/Terraform experience. We have a high-concurrency SaaS project and would love to discuss opportunities.'
    });
  };

  return (
    <section id="contact" className="space-y-6 pt-6 pb-12">
      {/* Header */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5 transition-colors ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 mb-1">
            <Mail className="w-3.5 h-3.5" />
            <span>04 / GET IN TOUCH</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Initiate Contact & Collaboration
          </h2>
          <p
            className={`text-sm mt-1 max-w-2xl transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Have a project, full-time engineering opportunity, or technical consultation? Messages are persisted directly into the MongoDB backend storage.
          </p>
        </div>

        {/* Database Status Indicator & Live Viewer Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              dbInfo.connected
                ? isDark
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium'
                : isDark
                ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
                : 'bg-cyan-50 border-cyan-300 text-cyan-800 font-medium'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dbInfo.connected
                  ? isDark
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-emerald-600 animate-pulse'
                  : isDark
                  ? 'bg-cyan-400'
                  : 'bg-cyan-600'
              }`}
            />
            <span>
              {dbInfo.connected
                ? `MongoDB Atlas: Connected (${messages.length} Records)`
                : `MongoDB: Active (${messages.length} Records)`}
            </span>
          </div>

          {dbInfo.remoteConfigured && !dbInfo.connected && (
            <button
              onClick={handleRetryMongo}
              disabled={isRetryingDb}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                isDark
                  ? 'bg-emerald-950/50 hover:bg-emerald-900/50 border-emerald-500/30 text-emerald-300'
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
              }`}
              title="Test connection to MongoDB Atlas"
            >
              <RefreshCw className={`w-3 h-3 ${isRetryingDb ? 'animate-spin' : ''}`} />
              <span>{isRetryingDb ? 'Testing...' : 'Retry Atlas'}</span>
            </button>
          )}

          <button
            onClick={() => setShowDbViewer(!showDbViewer)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-xs'
            }`}
          >
            {showDbViewer ? 'Hide DB Inbox' : 'View DB Inbox'}
          </button>
        </div>
      </div>

      {/* Atlas Network Access Notice Banner */}
      {dbInfo.remoteConfigured && !dbInfo.connected && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
            isDark
              ? 'bg-cyan-950/20 border-cyan-500/20 text-slate-300'
              : 'bg-cyan-50 border-cyan-200 text-slate-700'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <Database className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className={`font-semibold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                MongoDB Atlas Integration Active:
              </span>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                To link directly to your remote Atlas cluster, go to <strong className={isDark ? 'text-cyan-300' : 'text-cyan-700'}>MongoDB Atlas → Network Access</strong> and add <code className={`px-1.5 py-0.5 rounded font-mono ${isDark ? 'text-emerald-400 bg-black/40' : 'text-emerald-700 bg-slate-200'}`}>0.0.0.0/0</code> (Allow Access from Anywhere). Messages currently save reliably to persistent MongoDB document storage.
              </p>
            </div>
          </div>
          <button
            onClick={handleRetryMongo}
            disabled={isRetryingDb}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-colors ${
              isDark
                ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/40 text-cyan-300'
                : 'bg-cyan-100 hover:bg-cyan-200 border-cyan-300 text-cyan-800'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isRetryingDb ? 'animate-spin' : ''}`} />
            <span>Test Atlas Connection</span>
          </button>
        </div>
      )}

      {/* Main Grid: Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className={`rounded-xl border p-5 space-y-4 transition-colors ${
              isDark
                ? 'border-slate-800/90 bg-[#0e131d]/80 text-slate-200'
                : 'border-slate-200/90 bg-white text-slate-800 shadow-sm'
            }`}
          >
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Direct Communication Channels
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Available for senior engineering roles, SaaS architecture design, high-concurrency backend consulting, and cloud data pipelines.
            </p>

            <div className="space-y-2.5 pt-1">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className={`flex items-center justify-between p-3 rounded-lg border text-xs group transition-all ${
                  isDark
                    ? 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-200'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded border ${
                      isDark
                        ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-[10px] uppercase font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Direct Email
                    </div>
                    <div className={`font-semibold transition-colors ${isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-700'}`}>
                      {PERSONAL_INFO.email}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  compose →
                </span>
              </a>

              <a
                href={`tel:${PERSONAL_INFO.phone}`}
                className={`flex items-center justify-between p-3 rounded-lg border text-xs group transition-all ${
                  isDark
                    ? 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-200'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded border ${
                      isDark
                        ? 'bg-cyan-950/40 border-cyan-500/20 text-cyan-400'
                        : 'bg-cyan-50 border-cyan-200 text-cyan-700'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-[10px] uppercase font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Mobile & WhatsApp
                    </div>
                    <div className={`font-semibold transition-colors ${isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-cyan-700'}`}>
                      {PERSONAL_INFO.phone}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  call →
                </span>
              </a>

              <div
                className={`flex items-center p-3 rounded-lg border text-xs ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div
                  className={`p-2 rounded border mr-2.5 ${
                    isDark
                      ? 'bg-purple-950/40 border-purple-500/20 text-purple-400'
                      : 'bg-purple-50 border-purple-200 text-purple-700'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-[10px] uppercase font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Primary Location
                  </div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {PERSONAL_INFO.location}
                  </div>
                  <div className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Timezone: Asia/Dhaka (GMT+6) • Remote Ready
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className={`pt-2 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
              <div className={`text-xs font-mono mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Social & Developer Profiles:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 transition-colors ${
                    isDark
                      ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <Linkedin className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate">LinkedIn</span>
                </a>
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 transition-colors ${
                    isDark
                      ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <Github className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="truncate">GitHub</span>
                </a>
              </div>
            </div>

            {/* CLI dispatch tip */}
            {onInspectInTerminal && (
              <div
                className={`p-3 rounded-lg border text-[11px] space-y-1 ${
                  isDark
                    ? 'bg-slate-900/40 border-white/5 text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`font-mono flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Terminal className="w-3 h-3 text-emerald-500" />
                  <span>Terminal Shortcut:</span>
                </div>
                <p className="font-mono">
                  Type <span className="text-emerald-500 cursor-pointer underline font-bold" onClick={() => onInspectInTerminal('contact')}>contact</span> or use inline flags to send messages via CLI.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <div
            className={`rounded-xl border p-5 sm:p-6 space-y-4 transition-colors ${
              isDark
                ? 'border-slate-800/90 bg-[#0e131d]/80 text-slate-200'
                : 'border-slate-200/90 bg-white text-slate-800 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Send a Message
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Directly saved to the MongoDB message collection.
                </p>
              </div>
              <button
                type="button"
                onClick={handleFillSample}
                className={`text-xs font-mono font-medium transition-colors ${
                  isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-700 hover:text-cyan-900'
                }`}
                title="Fill with sample message"
              >
                Auto-fill Sample
              </button>
            </div>

            {submitStatus.type && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                  submitStatus.type === 'success'
                    ? isDark
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : isDark
                    ? 'bg-red-950/40 border-red-500/30 text-red-300'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {submitStatus.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                )}
                <span>{submitStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Your Name <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Alex Rivera"
                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors font-sans border ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 focus:border-emerald-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Email Address <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., alex@company.com"
                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors font-sans border ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 focus:border-emerald-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`block text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Subject / Company
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Senior Full Stack Role / Cloud Architecture"
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors font-sans border ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 focus:border-emerald-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`block text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Message <span className="text-emerald-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about your team, tech stack requirements, or project scope..."
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors resize-none font-sans border ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 focus:border-emerald-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className={`text-[11px] font-mono flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Database className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Target: MongoDB `messages` collection</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs font-mono flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing to Database...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch to Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Real-Time Database Message Log Viewer */}
      {showDbViewer && (
        <div
          className={`rounded-xl border p-5 space-y-3 animate-fade-in transition-colors ${
            isDark
              ? 'border-slate-800 bg-[#0c1017] text-slate-200'
              : 'border-slate-200 bg-slate-50 text-slate-800 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <h4 className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Live MongoDB Message Stream ({messages.length} saved records)
              </h4>
            </div>
            <button
              onClick={fetchMessagesAndStatus}
              disabled={isLoadingMessages}
              className={`p-1.5 rounded border transition-colors flex items-center gap-1 text-xs font-mono ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg border space-y-1.5 text-xs relative group transition-colors ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{msg.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Delete test message"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className={`text-[11px] font-mono ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                  {msg.email} {msg.subject ? `• ${msg.subject}` : ''}
                </div>
                <p className={`text-xs p-2 rounded border line-clamp-3 ${isDark ? 'bg-black/30 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  {msg.message}
                </p>
                <div className={`text-[10px] font-mono flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span>Source: {msg.source || 'web'}</span>
                  <span>• ID: {msg.id.substring(0, 10)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
