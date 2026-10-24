import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, AlertTriangle, Sparkles, ChevronDown } from 'lucide-react';
import { SAMPLE_LOGS } from '../sampleLogs.js';

export default function InputPane({
  rawLog,
  setRawLog,
  status,
  warningMessage,
  onClear,
  onAnalyze
}) {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);

  const handleCycleSample = () => {
    const nextIndex = (selectedSampleIndex + 1) % SAMPLE_LOGS.length;
    setSelectedSampleIndex(nextIndex);
    setRawLog(SAMPLE_LOGS[nextIndex].log);
  };

  const handleKeyDown = (e) => {
    // Ctrl + Enter or Cmd + Enter shortcut to trigger analysis
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onAnalyze();
    }
  };

  const lineCount = rawLog ? rawLog.split('\n').length : 0;
  const charCount = rawLog.length;

  return (
    <section className="w-full md:w-[42%] flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-2xl">
      {/* Pane Header */}
      <div className="px-4 py-3 border-b border-[#30363d] bg-[#0d1117]/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={15} className="text-[#58a6ff]" />
          <span className="text-xs font-bold text-[#e6edf3] font-mono tracking-wide">
            RAW LOG INPUT
          </span>
        </div>

        <button
          type="button"
          onClick={handleCycleSample}
          className="text-xs text-[#58a6ff] hover:text-[#79c0ff] bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 border border-[#58a6ff]/30 px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors font-mono cursor-pointer"
          title="Click to cycle between Node.js, React, and Python sample errors"
        >
          <Sparkles size={12} className="text-[#58a6ff]" />
          <span>Load Sample: {SAMPLE_LOGS[selectedSampleIndex].label.split(' ')[0]}</span>
        </button>
      </div>

      {/* Textarea Surface */}
      <div className="flex-1 p-3.5 flex flex-col min-h-[380px]">
        <textarea
          value={rawLog}
          onChange={(e) => setRawLog(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="// Paste messy terminal stack trace, crash report, or server log here...&#10;// Tip: Press Ctrl + Enter to analyze"
          className="w-full flex-1 bg-[#0d1117] text-[#e6edf3] p-3.5 text-xs rounded-md border border-[#30363d] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/50 focus:outline-none resize-none font-mono placeholder:text-[#484f58] transition-colors leading-relaxed shadow-inner"
        />

        {/* Validation Warning Alert */}
        {status === 'warning' && (
          <div className="mt-3 px-3.5 py-2.5 rounded bg-[#d29922]/15 border border-[#d29922]/40 text-[#d29922] text-xs flex items-center gap-2 font-mono animate-fadeIn">
            <AlertTriangle size={15} className="shrink-0 text-[#d29922]" />
            <span>{warningMessage}</span>
          </div>
        )}
      </div>

      {/* Pane Footer Toolbar */}
      <div className="px-4 py-3 border-t border-[#30363d] bg-[#0d1117]/60 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] text-[#8b949e] font-mono">
          <span>{charCount} chars</span>
          <span>•</span>
          <span>{lineCount} lines</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClear}
            disabled={status === 'analyzing' || (!rawLog && status === 'empty')}
            className="px-3 py-1.5 text-xs text-[#8b949e] hover:text-white rounded border border-[#30363d] hover:bg-[#21262d] transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 font-mono cursor-pointer"
          >
            <RotateCcw size={12} />
            Clear
          </button>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={status === 'analyzing'}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#238636] hover:bg-[#2ea043] border border-[#2ea043] rounded shadow-md flex items-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 font-mono cursor-pointer"
          >
            {status === 'analyzing' ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Play size={12} fill="currentColor" />
                <span>Analyze</span>
                <span className="hidden lg:inline text-[10px] text-white/60 bg-black/20 px-1 rounded">⌘↵</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
