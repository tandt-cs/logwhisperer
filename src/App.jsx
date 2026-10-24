import React, { useState } from 'react';
import Header from './components/Header.jsx';
import InputPane from './components/InputPane.jsx';
import { Terminal, Check, Copy, AlertCircle, Sparkles } from 'lucide-react';
import { SAMPLE_LOGS } from './sampleLogs.js';

export default function App() {
  const [rawLog, setRawLog] = useState('');
  const [status, setStatus] = useState('empty'); // 'empty' | 'analyzing' | 'success' | 'warning' | 'error'
  const [warningMessage, setWarningMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

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
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col font-mono">
      {/* Top Header Navigation */}
      <Header />

      {/* Main Split-Pane Workspace */}
      <main className="flex-1 flex flex-col md:flex-row p-4 md:p-6 gap-6 max-w-7xl w-full mx-auto">
        {/* Left Pane: Input Surface (~42% width) */}
        <InputPane
          rawLog={rawLog}
          setRawLog={(val) => {
            setRawLog(val);
            if (status === 'warning') setStatus('empty');
          }}
          status={status}
          warningMessage={warningMessage}
          onClear={handleClear}
          onAnalyze={handleAnalyze}
        />

        {/* Right Pane: Diagnosis Terminal (~58% width) */}
        <section className="w-full md:w-[58%] flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-2xl">
          {/* Mock Window Title Bar */}
          <div className="px-4 py-3 border-b border-[#30363d] bg-[#0d1117]/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f85149] inline-block shadow-sm"></span>
              <span className="w-3 h-3 rounded-full bg-[#d29922] inline-block shadow-sm"></span>
              <span className="w-3 h-3 rounded-full bg-[#3fb950] inline-block shadow-sm"></span>
              <span className="ml-2.5 text-xs text-[#8b949e] font-mono tracking-wide">
                logwhisperer-diagnosis.sh
              </span>
            </div>
            {result && (
              <span className="text-[11px] text-[#3fb950] font-mono flex items-center gap-1.5 font-semibold bg-[#3fb950]/10 px-2 py-0.5 rounded border border-[#3fb950]/20">
                <Check size={12} /> Complete
              </span>
            )}
          </div>

          {/* Right Pane Content Canvas */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto min-h-[420px] flex flex-col">
            {/* Empty State */}
            {status === 'empty' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#8b949e]">
                <div className="w-14 h-14 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-[#3fb950] mb-4 shadow-inner">
                  <Terminal size={26} />
                </div>
                <div className="font-mono text-sm text-[#3fb950] flex items-center gap-1.5 font-medium">
                  <span>&gt; Waiting for raw log input...</span>
                  <span className="w-2.5 h-4 bg-[#3fb950] animate-pulse inline-block"></span>
                </div>
                <p className="text-xs text-[#8b949e] mt-2.5 max-w-sm leading-relaxed">
                  Paste a stack trace on the left or click <span className="text-[#58a6ff]">"Load Sample"</span> to trigger the 3-section AI analysis.
                </p>
              </div>
            )}

            {/* Analyzing State */}
            {status === 'analyzing' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-14 h-14 rounded-xl bg-[#58a6ff]/10 border border-[#58a6ff]/30 flex items-center justify-center text-[#58a6ff] mb-4 shadow-inner">
                  <span className="w-7 h-7 border-2 border-[#58a6ff]/30 border-t-[#58a6ff] rounded-full animate-spin"></span>
                </div>
                <div className="font-mono text-sm text-[#58a6ff] flex items-center gap-2 font-semibold">
                  <span>[ANALYZING] Decrypting stack trace...</span>
                  <span className="w-2.5 h-4 bg-[#58a6ff] animate-pulse inline-block"></span>
                </div>
                <p className="text-xs text-[#8b949e] mt-2 font-mono">
                  Synthesizing root cause & extracting actionable fix snippets
                </p>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="p-4 rounded-lg bg-[#f85149]/10 border border-[#f85149]/40 text-[#f85149]">
                <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                  <AlertCircle size={16} />
                  <span>[ERROR] Analysis Failed</span>
                </div>
                <p className="text-xs text-[#e6edf3] font-mono mt-1 mb-3 leading-relaxed">{errorMessage}</p>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="px-3.5 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#f85149]/40 text-xs text-white rounded transition-colors font-mono cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Success State: 3 Structured Cards */}
            {status === 'success' && result && (
              <div className="space-y-4">
                {/* 1. The Translation */}
                <div className="rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden shadow-sm">
                  <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#58a6ff] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#58a6ff]"></span>
                      1. THE TRANSLATION
                    </span>
                    <span className="text-[10px] text-[#8b949e] uppercase font-mono tracking-wider">Plain Language</span>
                  </div>
                  <div className="p-4 text-xs text-[#e6edf3] leading-relaxed">
                    {result.translation}
                  </div>
                </div>

                {/* 2. The Root Cause */}
                <div className="rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden shadow-sm">
                  <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#d29922] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#d29922]"></span>
                      2. THE ROOT CAUSE
                    </span>
                    <span className="text-[10px] text-[#8b949e] uppercase font-mono tracking-wider">Mechanism</span>
                  </div>
                  <div className="p-4 text-xs text-[#e6edf3] leading-relaxed">
                    {result.rootCause}
                  </div>
                </div>

                {/* 3. The Fix */}
                <div className="rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden shadow-sm">
                  <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3fb950] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3fb950]"></span>
                      3. THE FIX
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(result.fix.codeSnippet)}
                      className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[11px] text-[#e6edf3] border border-[#30363d] flex items-center gap-1.5 transition-colors cursor-pointer font-mono"
                    >
                      {copied ? (
                        <>
                          <Check size={12} className="text-[#3fb950]" />
                          <span className="text-[#3fb950] font-bold">✓ Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 text-xs space-y-3">
                    <p className="text-[#e6edf3] leading-relaxed">{result.fix.summary}</p>
                    {result.fix.codeSnippet && (
                      <div className="relative rounded-md bg-[#161b22] border border-[#30363d] p-3 text-[11px] font-mono text-[#79c0ff] overflow-x-auto shadow-inner">
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
      <footer className="border-t border-[#30363d] px-6 py-3 text-center text-[11px] text-[#8b949e] bg-[#161b22]/50">
        LogWhisperer • Built with AI: Basics Hackathon • React + Vite + Tailwind + Google Gemini API
      </footer>
    </div>
  );
}
