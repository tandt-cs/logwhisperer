import React, { useState } from 'react';
import Header from './components/Header.jsx';
import InputPane from './components/InputPane.jsx';
import OutputPane from './components/OutputPane.jsx';

export default function App() {
  const [rawLog, setRawLog] = useState('');
  const [status, setStatus] = useState('empty'); // 'empty' | 'analyzing' | 'success' | 'warning' | 'error'
  const [warningMessage, setWarningMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);

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

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col font-mono selection:bg-[#58a6ff]/30 selection:text-white">
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
        <OutputPane
          status={status}
          result={result}
          errorMessage={errorMessage}
          onRetry={handleAnalyze}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] px-6 py-3 text-center text-[11px] text-[#8b949e] bg-[#161b22]/50">
        LogWhisperer • Built with AI: Basics Hackathon • React + Vite + Tailwind + Google Gemini API
      </footer>
    </div>
  );
}
