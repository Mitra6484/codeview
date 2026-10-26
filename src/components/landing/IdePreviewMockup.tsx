"use client";

import { Play, Sparkles, Video, Mic, CheckCircle2, Bot, Terminal, ShieldCheck, Zap } from "lucide-react";

export default function IdePreviewMockup() {
  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl p-2 sm:p-3 glass-card border border-white/15 shadow-[0_20px_70px_-15px_rgba(99,102,241,0.25)] overflow-hidden text-left">
      {/* Decorative ambient top glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-indigo-500/20 via-violet-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Mockup macOS Window Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950/40 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            <span className="text-indigo-400">solution.py</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/80 ml-1" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors">
            <span>interview-prompt.md</span>
          </div>
        </div>

        {/* Live Session Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Session • 00:34:12</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all">
            <Play className="w-3 h-3 fill-emerald-300" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body: Code Editor + Floating Video PIP + Copilot Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] bg-slate-950/70 font-mono text-xs sm:text-sm text-left">
        {/* Left: Monaco-style Code View (8 cols) */}
        <div className="lg:col-span-7 p-4 sm:p-6 overflow-x-auto border-b lg:border-b-0 lg:border-r border-white/10 relative text-left">
          <div className="space-y-0.5 leading-6 text-slate-300 font-mono text-xs sm:text-[13px] text-left">
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">01</span>
              <span className="whitespace-pre flex-1 text-slate-200"><span className="text-violet-400">from</span> collections <span className="text-violet-400">import</span> <span className="text-indigo-300 font-semibold">OrderedDict</span></span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">02</span>
              <span className="whitespace-pre flex-1 text-slate-200"></span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">03</span>
              <span className="whitespace-pre flex-1 text-slate-200"><span className="text-violet-400">class</span> <span className="text-indigo-300 font-semibold">LRUCache</span>:</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">04</span>
              <span className="whitespace-pre flex-1 text-slate-200">    <span className="text-violet-400">def</span> <span className="text-blue-400">__init__</span>(self, capacity: <span className="text-emerald-400">int</span>):</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">05</span>
              <span className="whitespace-pre flex-1 text-slate-200">        self.capacity = capacity</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">06</span>
              <span className="whitespace-pre flex-1 text-slate-200">        self.cache: <span className="text-indigo-300">OrderedDict</span>[<span className="text-emerald-400">int</span>, <span className="text-emerald-400">int</span>] = OrderedDict()</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">07</span>
              <span className="whitespace-pre flex-1 text-slate-200"></span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">08</span>
              <span className="whitespace-pre flex-1 text-slate-200">    <span className="text-violet-400">def</span> <span className="text-blue-400">get</span>(self, key: <span className="text-emerald-400">int</span>) -&gt; <span className="text-emerald-400">int</span>:</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">09</span>
              <span className="whitespace-pre flex-1 text-slate-200">        <span className="text-violet-400">if</span> key <span className="text-violet-400">not in</span> self.cache:</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">10</span>
              <span className="whitespace-pre flex-1 text-slate-200">            <span className="text-violet-400">return</span> -<span className="text-amber-400">1</span></span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">11</span>
              <span className="whitespace-pre flex-1 text-slate-200">        self.cache.<span className="text-indigo-300">move_to_end</span>(key)</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">12</span>
              <span className="whitespace-pre flex-1 text-slate-200">        <span className="text-violet-400">return</span> self.cache[key]</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">13</span>
              <span className="whitespace-pre flex-1 text-slate-200"></span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">14</span>
              <span className="whitespace-pre flex-1 text-slate-200">    <span className="text-violet-400">def</span> <span className="text-blue-400">put</span>(self, key: <span className="text-emerald-400">int</span>, value: <span className="text-emerald-400">int</span>) -&gt; <span className="text-violet-400">None</span>:</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">15</span>
              <span className="whitespace-pre flex-1 text-slate-200">        <span className="text-violet-400">if</span> key <span className="text-violet-400">in</span> self.cache:</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">16</span>
              <span className="whitespace-pre flex-1 text-slate-200">            self.cache.<span className="text-indigo-300">move_to_end</span>(key)</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">17</span>
              <span className="whitespace-pre flex-1 text-slate-200">        self.cache[key] = value</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">18</span>
              <span className="whitespace-pre flex-1 text-slate-200">        <span className="text-violet-400">if</span> len(self.cache) &gt; self.capacity:</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">19</span>
              <span className="whitespace-pre flex-1 text-slate-200">            self.cache.<span className="text-indigo-300">popitem</span>(last=<span className="text-violet-400">False</span>)</span>
            </div>
            <div className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1 group">
              <span className="w-8 shrink-0 text-right pr-3 text-slate-600 select-none font-mono text-xs border-r border-white/10 mr-3 group-hover:text-slate-400">20</span>
              <span className="whitespace-pre flex-1 text-slate-200">        <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-0.5 align-middle" /></span>
            </div>
          </div>

          {/* Embedded Terminal Output Drawer */}
          <div className="mt-6 rounded-xl bg-slate-900/90 border border-emerald-500/20 p-3 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-sans">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <Terminal className="w-3.5 h-3.5" /> Terminal Output
              </span>
              <span className="text-[11px] text-slate-500">Exit code: 0</span>
            </div>
            <div className="text-emerald-400/90 text-xs font-mono space-y-0.5">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test Suite passed (12 / 12 test assertions)</span>
              </p>
              <p className="text-slate-400 text-[11px]">Runtime: 38ms • Memory: 14.2MB</p>
            </div>
          </div>
        </div>

        {/* Right: Floating Glass Video PIP + Copilot Panel (5 cols) */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col gap-4 font-sans bg-slate-950/40">
          {/* Glass Video Feeds */}
          <div className="grid grid-cols-2 gap-3">
            {/* Candidate Stream Tile */}
            <div className="relative aspect-video rounded-xl overflow-hidden glass-card border border-white/15 bg-gradient-to-tr from-slate-900 to-indigo-950/60 p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="glass-pill px-2 py-0.5 rounded-md text-[10px] text-white/90 font-medium">Candidate</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="flex items-center justify-center my-auto">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold text-sm shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  JS
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="truncate">Jordan S.</span>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce delay-75" />
                  <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            </div>

            {/* Interviewer Stream Tile */}
            <div className="relative aspect-video rounded-xl overflow-hidden glass-card border border-white/15 bg-gradient-to-tr from-slate-900 to-slate-950 p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="glass-pill px-2 py-0.5 rounded-md text-[10px] text-white/90 font-medium">Interviewer</span>
                <Mic className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="flex items-center justify-center my-auto">
                <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-violet-300 font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  AM
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="truncate">Anik M. (Host)</span>
                <span className="text-[10px] text-slate-500">1080p</span>
              </div>
            </div>
          </div>

          {/* Interviewer Copilot Intelligence Card */}
          <div className="flex-1 rounded-2xl glass-card border border-indigo-500/20 bg-gradient-to-b from-indigo-950/20 to-slate-950/60 p-4 flex flex-col justify-between shadow-[0_4px_24px_rgba(99,102,241,0.12)]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Interviewer Copilot</h4>
                    <p className="text-[10px] text-slate-400">Live Complexity & AST Analysis</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                  Score: 94 / 100
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 my-2 text-xs">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Time Complexity</span>
                  <span className="font-mono font-semibold text-indigo-300">O(1) Get / Put</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Space Complexity</span>
                  <span className="font-mono font-semibold text-violet-300">O(Capacity)</span>
                </div>
              </div>

              <div className="mt-2.5 p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
                <span className="text-indigo-400 font-semibold block mb-0.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-indigo-400" /> Algorithmic Analysis
                </span>
                Canonical OrderedDict implementation maintains key access order with O(1) lookup and eviction. Fully satisfies capacity constraints.
              </div>
            </div>

            {/* Decision Status Bar */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Plagiarism Check: Clean
              </span>
              <div className="flex gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-medium border border-emerald-500/30">
                  Recommended: Pass
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
