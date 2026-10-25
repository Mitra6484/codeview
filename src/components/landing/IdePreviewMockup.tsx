"use client";

import { Play, Sparkles, Video, Mic, CheckCircle2, Bot, Terminal, ShieldCheck, Zap } from "lucide-react";

export default function IdePreviewMockup() {
  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl p-2 sm:p-3 glass-card border border-white/15 shadow-[0_20px_70px_-15px_rgba(99,102,241,0.25)] overflow-hidden">
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

      {/* Main Workspace Body: Code Editor + Floating Video PIP + Nexus Co-Pilot Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] bg-slate-950/70 font-mono text-xs sm:text-sm">
        {/* Left: Monaco-style Code View (8 cols) */}
        <div className="lg:col-span-7 p-4 sm:p-6 overflow-x-auto border-b lg:border-b-0 lg:border-r border-white/10 relative">
          <div className="space-y-1 leading-relaxed text-slate-300">
            <p><span className="text-slate-600 select-none mr-4">01</span><span className="text-violet-400">class</span> <span className="text-indigo-300 font-semibold">LRUCache</span>:</p>
            <p><span className="text-slate-600 select-none mr-4">02</span>    <span className="text-violet-400">def</span> <span className="text-blue-400">__init__</span>(self, capacity: <span className="text-emerald-400">int</span>):</p>
            <p><span className="text-slate-600 select-none mr-4">03</span>        self.cap = capacity</p>
            <p><span className="text-slate-600 select-none mr-4">04</span>        self.cache = {} <span className="text-slate-500 italic"># key -&gt; Node</span></p>
            <p><span className="text-slate-600 select-none mr-4">05</span>        self.left, self.right = Node(<span className="text-amber-400">0</span>, <span className="text-amber-400">0</span>), Node(<span className="text-amber-400">0</span>, <span className="text-amber-400">0</span>)</p>
            <p><span className="text-slate-600 select-none mr-4">06</span>        self.left.next, self.right.prev = self.right, self.left</p>
            <p><span className="text-slate-600 select-none mr-4">07</span></p>
            <p><span className="text-slate-600 select-none mr-4">08</span>    <span className="text-violet-400">def</span> <span className="text-blue-400">get</span>(self, key: <span className="text-emerald-400">int</span>) -&gt; <span className="text-emerald-400">int</span>:</p>
            <p><span className="text-slate-600 select-none mr-4">09</span>        <span className="text-violet-400">if</span> key <span className="text-violet-400">in</span> self.cache:</p>
            <p><span className="text-slate-600 select-none mr-4">10</span>            self.<span className="text-indigo-300">_remove</span>(self.cache[key])</p>
            <p><span className="text-slate-600 select-none mr-4">11</span>            self.<span className="text-indigo-300">_insert</span>(self.cache[key])</p>
            <p><span className="text-slate-600 select-none mr-4">12</span>            <span className="text-violet-400">return</span> self.cache[key].val</p>
            <p><span className="text-slate-600 select-none mr-4">13</span>        <span className="text-violet-400">return</span> -<span className="text-amber-400">1</span></p>
            <p><span className="text-slate-600 select-none mr-4">14</span></p>
            <p><span className="text-slate-600 select-none mr-4">15</span>    <span className="text-violet-400">def</span> <span className="text-blue-400">put</span>(self, key: <span className="text-emerald-400">int</span>, value: <span className="text-emerald-400">int</span>) -&gt; <span className="text-violet-400">None</span>:</p>
            <p><span className="text-slate-600 select-none mr-4">16</span>        <span className="text-violet-400">if</span> key <span className="text-violet-400">in</span> self.cache: self.<span className="text-indigo-300">_remove</span>(self.cache[key])</p>
            <p><span className="text-slate-600 select-none mr-4">17</span>        node = Node(key, value)</p>
            <p><span className="text-slate-600 select-none mr-4">18</span>        self.cache[key] = node; self.<span className="text-indigo-300">_insert</span>(node)</p>
            <p><span className="text-slate-600 select-none mr-4">19</span>        <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-1 align-middle" /></p>
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
              <p className="text-slate-400 text-[11px]">Runtime: 41ms • Memory: 14.8MB</p>
            </div>
          </div>
        </div>

        {/* Right: Floating Glass Video PIP + Nexus Co-Pilot Intelligence Panel (5 cols) */}
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

          {/* Nexus AI Co-Pilot Intelligence Card */}
          <div className="flex-1 rounded-2xl glass-card border border-indigo-500/20 bg-gradient-to-b from-indigo-950/20 to-slate-950/60 p-4 flex flex-col justify-between shadow-[0_4px_24px_rgba(99,102,241,0.12)]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Nexus Co-Pilot Radar</h4>
                    <p className="text-[10px] text-slate-400">Real-time AST & Progressive Nudges</p>
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
                  <span className="font-mono font-semibold text-indigo-300">O(1) Avg</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Space Complexity</span>
                  <span className="font-mono font-semibold text-violet-300">O(Capacity)</span>
                </div>
              </div>

              <div className="mt-2.5 p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
                <span className="text-indigo-400 font-semibold block mb-0.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-indigo-400" /> AI Feedback Summary
                </span>
                Doubly-linked list with hash map provides optimal O(1) eviction. Clean implementation with robust edge case handling.
              </div>
            </div>

            {/* Interviewer Decision Status Bar */}
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
