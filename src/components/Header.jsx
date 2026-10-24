import React from 'react';
import { Terminal, ShieldCheck, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-[#30363d] px-6 py-3.5 flex items-center justify-between bg-[#161b22]/80 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#58a6ff]/10 border border-[#58a6ff]/30 flex items-center justify-center text-[#58a6ff] shadow-sm">
          <Terminal size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-white text-base tracking-wide font-mono">LogWhisperer</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#3fb950]/15 text-[#3fb950] border border-[#3fb950]/30 font-mono">
              v1.0 POC
            </span>
          </div>
          <p className="text-xs text-[#8b949e] font-mono">Zero-fluff terminal log decryptor & actionable fix generator</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-[#8b949e]">
        <div className="hidden sm:flex items-center gap-2 text-[#7d8590]">
          <Zap size={13} className="text-[#d29922]" />
          <span>gemini-4-argon</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d1117] border border-[#30363d]">
          <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></span>
          <span className="text-[#3fb950] font-semibold text-[11px]">SYSTEM ONLINE</span>
        </div>
      </div>
    </header>
  );
}
