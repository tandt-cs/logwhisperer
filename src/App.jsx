import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, AlertTriangle, AlertCircle, Copy, Check, Sparkles } from 'lucide-react';
import { SAMPLE_LOGS } from './sampleLogs.js';

export default function App() {
  const [rawLog, setRawLog] = useState('');
  const [status, setStatus] = useState('empty'); // 'empty' | 'analyzing' | 'success' | 'warning' | 'error'
  const [warningMessage, setWarningMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleLoadSample = () => {
    const sample = SAMPLE_LOGS[0].log;
    setRawLog(sample);
    setWarningMessage('');
    if (status === 'warning') setStatus('empty');
  };

  const handleClear = () => {
    setRawLog('');
    setStatus('empty');
    setWarningMessage('');
    setErrorMessage('');
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!rawLog || rawLog.trim().length < 10) {
      setWarningMessage('[WARN] Please provide a valid error log or stack trace (at least 10 characters).');
      setStatus('warning');
      return;
    }

    setWarningMessage('');
    setErrorMessage('');
    setStatus('analyzing');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log: rawLog }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error occurred during analysis.');
      }

      setResult(data.data);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#30363d] px-6 py-3 flex items-center justify-between bg-[#161b22]/70 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#58a6ff]/10 border border-[#58a6ff]/30 flex items-center justify-center text-[#58a6ff]">
            <Terminal size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-wide">LogWhisperer</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#3fb950]/15 text-[#3fb950] border border-[#3fb950]/30">v1.0 POC</span>
            </div>
            <p className="text-xs text-[#8b949e]">Terminal Log Decryptor & Actionable Fix Generator</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#8b949e]">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161b22] border border-[#30363d]">
            <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></span>
            SYSTEM ONLINE
          </span>
        </div>
      </header>

      {/* Main Split-Pane Workspace */}
      <main className="flex-1 flex flex-col md:flex-row p-4 md:p-6 gap-6 max-w-7xl w-full mx-auto">
        {/* Left Pane: Input Surface (~40% width) */}
        <section className="w-full md:w-[42%] flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 border-b border-[#30363d] bg-[#0d1117]/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8b949e] flex items-center gap-1.5">
              <Terminal size={14} className="text-[#58a6ff]" />
              RAW LOG INPUT
            </span>
            <button
              onClick={handleLoadSample}
              className="text-xs text-[#58a6ff] hover:text-[#79c0ff] flex items-center gap-1 hover:underline transition-colors"
            >
              <Sparkles size={12} />
              Load Sample Error
            </button>
          </div>

          <div className="flex-1 p-3 flex flex-col min-h-[340px]">
            <textarea
              value={rawLog}
              onChange={(e) => {
                setRawLog(e.target.value);
                if (status === 'warning') setStatus('empty');
              }}
              placeholder="// Paste messy terminal stack trace, crash report, or server log here..."
              className="w-full flex-1 bg-[#0d1117] text-[#e6edf3] p-3 text-xs rounded border border-[#30363d] focus:border-[#58a6ff] focus:outline-none resize-none font-mono placeholder:text-[#484f58] transition-colors leading-relaxed"
            />

            {status === 'warning' && (
              <div className="mt-2.5 px-3 py-2 rounded bg-[#d29922]/15 border border-[#d29922]/40 text-[#d29922] text-xs flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{warningMessage}</span>
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-[#30363d] bg-[#0d1117]/40 flex items-center justify-between">
            <span className="text-[11px] text-[#8b949e]">
              {rawLog.length} chars | {rawLog.split('\n').filter(Boolean).length} lines
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                disabled={status === 'analyzing' || (!rawLog && status === 'empty')}
                className="px-3 py-1.5 text-xs text-[#8b949e] hover:text-white rounded border border-[#30363d] hover:bg-[#21262d] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
              >
                <RotateCcw size={12} />
                Clear
              </button>

              <button
                onClick={handleAnalyze}
                disabled={status === 'analyzing'}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#238636] hover:bg-[#2ea043] border border-[#2ea043]/80 rounded shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95"
              >
                {status === 'analyzing' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play size={12} fill="currentColor" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Right Pane: Diagnosis Terminal (~58% width) */}
        <section className="w-full md:w-[58%] flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-2xl">
          {/* Mock Window Title Bar */}
          <div className="px-4 py-2.5 border-b border-[#30363d] bg-[#0d1117]/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f85149]/80 border border-[#f85149]"></span>
              <span className="w-3 h-3 rounded-full bg-[#d29922]/80 border border-[#d29922]"></span>
              <span className="w-3 h-3 rounded-full bg-[#3fb950]/80 border border-[#3fb950]"></span>
              <span className="ml-2 text-xs text-[#8b949e] font-mono">logwhisperer-diagnosis.sh</span>
            </div>
            {result && (
              <span className="text-[11px] text-[#3fb950] font-mono flex items-center gap-1">
                <Check size={12} /> Complete
              </span>
            )}
          </div>

          {/* Right Pane Content Canvas */}
          <div className="flex-1 p-4 md:p-5 overflow-y-auto min-h-[380px] flex flex-col">
            {/* Empty State */}
            {status === 'empty' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#8b949e]">
                <div className="w-12 h-12 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#3fb950] mb-3">
                  <Terminal size={22} />
                </div>
                <div className="font-mono text-sm text-[#3fb950] flex items-center gap-1">
                  <span>&gt; Waiting for raw log input...</span>
                  <span className="w-2 h-4 bg-[#3fb950] animate-pulse inline-block"></span>
                </div>
                <p className="text-xs text-[#8b949e] mt-2 max-w-sm">
                  Paste an error log on the left or click "Load Sample Error" to generate a 3-part structured diagnosis.
                </p>
              </div>
            )}

            {/* Analyzing State */}
            {status === 'analyzing' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-[#58a6ff]/10 border border-[#58a6ff]/30 flex items-center justify-center text-[#58a6ff] mb-4">
                  <span className="w-6 h-6 border-2 border-[#58a6ff]/30 border-t-[#58a6ff] rounded-full animate-spin"></span>
                </div>
                <div className="font-mono text-sm text-[#58a6ff] flex items-center gap-1.5">
                  <span>[ANALYZING] Decrypting stack trace...</span>
                  <span className="w-2 h-4 bg-[#58a6ff] animate-pulse inline-block"></span>
                </div>
                <p className="text-xs text-[#8b949e] mt-2 font-mono">
                  Synthesizing root cause & extracting actionable fix snippets
                </p>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="p-4 rounded-lg bg-[#f85149]/10 border border-[#f85149]/40 text-[#f85149]">
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  <AlertCircle size={16} />
                  <span>[ERROR] Analysis Failed</span>
                </div>
                <p className="text-xs text-[#e6edf3] font-mono mt-1 mb-3">{errorMessage}</p>
                <button
                  onClick={handleAnalyze}
                  className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#f85149]/40 text-xs text-white rounded transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Success State: 3 Structured Cards */}
            {status === 'success' && result && (
              <div className="space-y-4">
                {/* 1. The Translation */}
                <div className="rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden">
                  <div className="px-3.5 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#58a6ff] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#58a6ff]"></span>
                      1. THE TRANSLATION
                    </span>
                    <span className="text-[10px] text-[#8b949e] uppercase font-mono">Plain Language</span>
                  </div>
                  <div className="p-3.5 text-xs text-[#e6edf3] leading-relaxed">
                    {result.translation}
                  </div>
                </div>

                {/* 2. The Root Cause */}
                <div className="rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden">
                  <div className="px-3.5 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#d29922] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#d29922]"></span>
                      2. THE ROOT CAUSE
                    </span>
                    <span className="text-[10px] text-[#8b949e] uppercase font-mono">Mechanism</span>
                  </div>
                  <div className="p-3.5 text-xs text-[#e6edf3] leading-relaxed">
                    {result.rootCause}
                  </div>
                </div>

                {/* 3. The Fix */}
                <div className="rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden">
                  <div className="px-3.5 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3fb950] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#3fb950]"></span>
                      3. THE FIX
                    </span>
                    <button
                      onClick={() => handleCopy(result.fix.codeSnippet)}
                      className="px-2 py-0.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[11px] text-[#e6edf3] border border-[#30363d] flex items-center gap-1 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={11} className="text-[#3fb950]" />
                          <span className="text-[#3fb950] font-bold">✓ Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-3.5 text-xs space-y-2.5">
                    <p className="text-[#e6edf3] leading-relaxed">{result.fix.summary}</p>
                    {result.fix.codeSnippet && (
                      <div className="relative rounded bg-[#161b22] border border-[#30363d] p-3 text-[11px] font-mono text-[#79c0ff] overflow-x-auto">
                        <pre>{result.fix.codeSnippet}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] px-6 py-2.5 text-center text-[11px] text-[#8b949e]">
        LogWhisperer • Built with AI: Basics Hackathon • React + Vite + Tailwind + Google Gemini API
      </footer>
    </div>
  );
}
