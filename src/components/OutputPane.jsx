import React, { useState } from 'react';
import { Terminal, Check, Copy, AlertCircle, RefreshCw } from 'lucide-react';

export default function OutputPane({
  status,
  result,
  errorMessage,
  onRetry
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full md:w-[58%] flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-2xl">
      {/* Mock Window Title Bar */}
      <div className="px-4 py-3 border-b border-[#30363d] bg-[#0d1117]/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#f85149] inline-block shadow-sm"></span>
          <span className="w-3 h-3 rounded-full bg-[#d29922] inline-block shadow-sm"></span>
          <span className="w-3 h-3 rounded-full bg-[#3fb950] inline-block shadow-sm"></span>
          <span className="ml-2.5 text-xs text-[#8b949e] font-mono tracking-wide font-medium">
            logwhisperer-diagnosis.sh
          </span>
        </div>

        {status === 'success' && result && (
          <span className="text-[11px] text-[#3fb950] font-mono flex items-center gap-1.5 font-semibold bg-[#3fb950]/10 px-2 py-0.5 rounded border border-[#3fb950]/20">
            <Check size={12} /> Diagnosis Complete
          </span>
        )}
      </div>

      {/* Pane Content Canvas */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto min-h-[420px] flex flex-col">
        {/* State 1: Empty / Waiting */}
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

        {/* State 2: Analyzing / Decrypting */}
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
              Prompting gemini-4-argon with structured schema to extract root cause & actionable fixes
            </p>
          </div>
        )}

        {/* State 3: API / Network Error */}
        {status === 'error' && (
          <div className="p-4 rounded-lg bg-[#f85149]/10 border border-[#f85149]/40 text-[#f85149] animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
              <AlertCircle size={16} />
              <span>[ERROR] Analysis Failed</span>
            </div>
            <p className="text-xs text-[#e6edf3] font-mono mt-1 mb-3 leading-relaxed">
              {errorMessage || "An unexpected error occurred while communicating with the AI service."}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="px-3.5 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#f85149]/40 text-xs text-white rounded transition-colors font-mono cursor-pointer flex items-center gap-1.5 w-fit"
            >
              <RefreshCw size={12} />
              Try Again
            </button>
          </div>
        )}

        {/* State 4: Three-Tier Structured Diagnosis */}
        {status === 'success' && result && (
          <div className="space-y-4 animate-fadeIn">
            {/* Card 1: The Translation */}
            <div className="rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden shadow-sm hover:border-[#58a6ff]/50 transition-colors">
              <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                <span className="text-xs font-bold text-[#58a6ff] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#58a6ff]"></span>
                  1. THE TRANSLATION
                </span>
                <span className="text-[10px] text-[#8b949e] uppercase font-mono tracking-wider bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
                  Plain Language
                </span>
              </div>
              <div className="p-4 text-xs text-[#e6edf3] leading-relaxed">
                {result.translation}
              </div>
            </div>

            {/* Card 2: The Root Cause */}
            <div className="rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden shadow-sm hover:border-[#d29922]/50 transition-colors">
              <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                <span className="text-xs font-bold text-[#d29922] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d29922]"></span>
                  2. THE ROOT CAUSE
                </span>
                <span className="text-[10px] text-[#8b949e] uppercase font-mono tracking-wider bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
                  Technical Mechanism
                </span>
              </div>
              <div className="p-4 text-xs text-[#e6edf3] leading-relaxed">
                {result.rootCause}
              </div>
            </div>

            {/* Card 3: The Fix */}
            <div className="rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden shadow-sm hover:border-[#3fb950]/50 transition-colors">
              <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                <span className="text-xs font-bold text-[#3fb950] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3fb950]"></span>
                  3. THE FIX
                </span>
                {result.fix?.codeSnippet && (
                  <button
                    type="button"
                    onClick={() => handleCopy(result.fix.codeSnippet)}
                    className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[11px] text-[#e6edf3] border border-[#30363d] flex items-center gap-1.5 transition-colors cursor-pointer font-mono shadow-sm"
                    title="Copy code snippet to clipboard"
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
                )}
              </div>
              <div className="p-4 text-xs space-y-3">
                <p className="text-[#e6edf3] leading-relaxed">{result.fix?.summary}</p>
                {result.fix?.codeSnippet && (
                  <div className="relative rounded-md bg-[#161b22] border border-[#30363d] p-3 text-[11px] font-mono text-[#79c0ff] overflow-x-auto shadow-inner leading-relaxed">
                    <pre className="selection:bg-[#58a6ff]/30">{result.fix.codeSnippet}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
