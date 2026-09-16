import React, { useState, useEffect } from 'react';
import { Database, Code, Server, Cpu, Check, Copy, Activity, RefreshCw, X, Shield, Terminal } from 'lucide-react';
import { VIRTUAL_FILES } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface GoMongoArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunTerminalCommand?: (cmd: string) => void;
}

export const GoMongoArchitectureModal: React.FC<GoMongoArchitectureModalProps> = ({
  isOpen,
  onClose,
  onRunTerminalCommand
}) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'golang' | 'mongodb' | 'health'>('golang');
  const [copied, setCopied] = useState<boolean>(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const fetchHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      console.error('Health check failed:', err);
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await fetch('/api/mongo/retry', { method: 'POST' });
      await fetchHealth();
    } catch (err) {
      console.error('Retry error:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
          isDark
            ? 'border-slate-700 bg-[#0c1017] text-slate-200'
            : 'border-slate-200 bg-white text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b transition-colors ${
            isDark ? 'border-slate-800 bg-[#111622]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Golang Microservice & MongoDB Architecture
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                    isDark
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                  }`}
                >
                  Production Ready
                </span>
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                High-concurrency Gin framework REST microservice with official Mongo Go Driver
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`flex items-center gap-2 px-5 py-2.5 border-b text-xs font-mono transition-colors ${
            isDark ? 'bg-[#0a0d13] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            onClick={() => setActiveTab('golang')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'golang'
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'bg-white text-cyan-800 border border-slate-200 shadow-xs font-bold'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>backend-go/main.go</span>
          </button>

          <button
            onClick={() => setActiveTab('mongodb')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'mongodb'
                ? isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'bg-white text-emerald-800 border border-slate-200 shadow-xs font-bold'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>mongo-schema.json</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'health'
                ? isDark
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold'
                  : 'bg-white text-purple-800 border border-slate-200 shadow-xs font-bold'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Health Check (/api/health)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs">
          {activeTab === 'golang' && (
            <div className="space-y-3">
              <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>Golang v1.22 + Gin Framework + MongoDB Official Driver</span>
                <button
                  onClick={() => copyCode(VIRTUAL_FILES['backend-go/main.go'])}
                  className={`px-2.5 py-1 rounded border flex items-center gap-1.5 transition-colors ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Go Code'}</span>
                </button>
              </div>

              <pre
                className={`p-4 rounded-xl border leading-relaxed max-h-[55vh] overflow-x-auto ${
                  isDark
                    ? 'bg-black/60 border-slate-800 text-slate-300'
                    : 'bg-slate-900 border-slate-800 text-slate-100'
                }`}
              >
                {VIRTUAL_FILES['backend-go/main.go']}
              </pre>
            </div>
          )}

          {activeTab === 'mongodb' && (
            <div className="space-y-3">
              <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>JSON-Schema Validation & BSON Indexes for MongoDB `messages`</span>
                <button
                  onClick={() => copyCode(VIRTUAL_FILES['mongo-schema.json'])}
                  className={`px-2.5 py-1 rounded border flex items-center gap-1.5 transition-colors ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Schema'}</span>
                </button>
              </div>

              <pre
                className={`p-4 rounded-xl border leading-relaxed max-h-[55vh] overflow-x-auto ${
                  isDark
                    ? 'bg-black/60 border-slate-800 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-emerald-400'
                }`}
              >
                {VIRTUAL_FILES['mongo-schema.json']}
              </pre>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Real-Time Server & Database Diagnostics</span>
                <button
                  onClick={fetchHealth}
                  disabled={isLoadingHealth}
                  className={`px-3 py-1 rounded border flex items-center gap-1 transition-colors ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHealth ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {healthData?.mongoConnectionNotice && (
                <div
                  className={`p-3.5 rounded-xl border space-y-2 ${
                    isDark
                      ? 'bg-cyan-950/30 border-cyan-500/30'
                      : 'bg-cyan-50 border-cyan-200 text-cyan-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-cyan-300' : 'text-cyan-800'}`}>
                      <Shield className="w-3.5 h-3.5 text-cyan-500" />
                      MongoDB Atlas Connection Status
                    </span>
                    <button
                      onClick={handleRetry}
                      disabled={isRetrying}
                      className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                      <span>{isRetrying ? 'Retrying...' : 'Retry Atlas Connection'}</span>
                    </button>
                  </div>
                  <p className={`text-[11px] leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {healthData.mongoConnectionNotice}
                  </p>
                </div>
              )}

              {healthData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className={`p-3.5 rounded-xl border space-y-1 ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className={`text-[10px] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Service Status</span>
                    <div className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {healthData.status?.toUpperCase() || 'ONLINE'}
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border space-y-1 ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className={`text-[10px] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Database Driver & Storage</span>
                    <div className={`text-sm font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                      {healthData.database === 'mongodb' ? 'MongoDB (Remote Cluster)' : 'MongoDB Document Store (Embedded)'}
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border space-y-1 ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className={`text-[10px] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Golang Architecture</span>
                    <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {healthData.golangMicroservice?.spec || 'Golang v1.22 + Gin'}
                    </div>
                    <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {healthData.golangMicroservice?.path}
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border space-y-1 ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className={`text-[10px] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Message Collection Volume</span>
                    <div className={`text-sm font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                      {healthData.messageCount} documents recorded
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-slate-500">Loading diagnostic telemetry...</div>
              )}

              <div
                className={`p-3 rounded-xl border ${
                  isDark ? 'bg-black/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`text-[10px] block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Raw API Telemetry Output:
                </span>
                <pre className={`text-xs whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {JSON.stringify(healthData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-between px-5 py-3 border-t text-xs font-mono transition-colors ${
            isDark ? 'border-slate-800 bg-[#0a0d13]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <span className={`hidden sm:inline ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            CLI Command: <code className="text-emerald-500 font-bold">go-arch</code>
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {onRunTerminalCommand && (
              <button
                onClick={() => {
                  onClose();
                  onRunTerminalCommand('go-arch');
                }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <Terminal className="w-3 h-3 text-emerald-500" />
                Inspect in CLI
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
