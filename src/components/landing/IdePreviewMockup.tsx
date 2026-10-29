"use client";

import { useState } from "react";
import {
  Play,
  Sparkles,
  Video,
  Mic,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Zap,
  Workflow,
  Award,
  Activity,
  Flame,
  Cpu,
  Database,
  Layers,
  Globe,
  Server,
  HeartHandshake,
  Volume2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PreviewMode = "coding" | "aura" | "architecture" | "scorecard";

export default function IdePreviewMockup() {
  const [activeMode, setActiveMode] = useState<PreviewMode>("coding");
  const [selectedLang, setSelectedLang] = useState<"python" | "javascript" | "java">("python");
  const [simQps, setSimQps] = useState<number>(250000);
  const [redisFault, setRedisFault] = useState<boolean>(false);
  const [selectedPersona, setSelectedPersona] = useState<"aura" | "alex" | "elena" | "kai">("aura");

  const codeSamples = {
    python: [
      { ln: "01", code: 'from collections import OrderedDict' },
      { ln: "02", code: "" },
      { ln: "03", code: "class LRUCache:" },
      { ln: "04", code: "    def __init__(self, capacity: int):" },
      { ln: "05", code: "        self.capacity = capacity" },
      { ln: "06", code: "        self.cache: OrderedDict[int, int] = OrderedDict()" },
      { ln: "07", code: "" },
      { ln: "08", code: "    def get(self, key: int) -> int:" },
      { ln: "09", code: "        if key not in self.cache:" },
      { ln: "10", code: "            return -1" },
      { ln: "11", code: "        self.cache.move_to_end(key)" },
      { ln: "12", code: "        return self.cache[key]" },
      { ln: "13", code: "" },
      { ln: "14", code: "    def put(self, key: int, value: int) -> None:" },
      { ln: "15", code: "        if key in self.cache:" },
      { ln: "16", code: "            self.cache.move_to_end(key)" },
      { ln: "17", code: "        self.cache[key] = value" },
      { ln: "18", code: "        if len(self.cache) > self.capacity:" },
      { ln: "19", code: "            self.cache.popitem(last=False)" },
    ],
    javascript: [
      { ln: "01", code: "class LRUCache {" },
      { ln: "02", code: "  constructor(capacity) {" },
      { ln: "03", code: "    this.capacity = capacity;" },
      { ln: "04", code: "    this.cache = new Map();" },
      { ln: "05", code: "  }" },
      { ln: "06", code: "" },
      { ln: "07", code: "  get(key) {" },
      { ln: "08", code: "    if (!this.cache.has(key)) return -1;" },
      { ln: "09", code: "    const val = this.cache.get(key);" },
      { ln: "10", code: "    this.cache.delete(key);" },
      { ln: "11", code: "    this.cache.set(key, val);" },
      { ln: "12", code: "    return val;" },
      { ln: "13", code: "  }" },
      { ln: "14", code: "" },
      { ln: "15", code: "  put(key, value) {" },
      { ln: "16", code: "    if (this.cache.has(key)) this.cache.delete(key);" },
      { ln: "17", code: "    this.cache.set(key, value);" },
      { ln: "18", code: "    if (this.cache.size > this.capacity) {" },
      { ln: "19", code: "      this.cache.delete(this.cache.keys().next().value);" },
      { ln: "20", code: "    }" },
      { ln: "21", code: "  }" },
      { ln: "22", code: "}" },
    ],
    java: [
      { ln: "01", code: "import java.util.LinkedHashMap;" },
      { ln: "02", code: "import java.util.Map;" },
      { ln: "03", code: "" },
      { ln: "04", code: "class LRUCache extends LinkedHashMap<Integer, Integer> {" },
      { ln: "05", code: "    private final int capacity;" },
      { ln: "06", code: "" },
      { ln: "07", code: "    public LRUCache(int capacity) {" },
      { ln: "08", code: "        super(capacity, 0.75f, true);" },
      { ln: "09", code: "        this.capacity = capacity;" },
      { ln: "10", code: "    }" },
      { ln: "11", code: "" },
      { ln: "12", code: "    public int get(int key) {" },
      { ln: "13", code: "        return super.getOrDefault(key, -1);" },
      { ln: "14", code: "    }" },
      { ln: "15", code: "" },
      { ln: "16", code: "    @Override" },
      { ln: "17", code: "    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {" },
      { ln: "18", code: "        return size() > capacity;" },
      { ln: "19", code: "    }" },
      { ln: "20", code: "}" },
    ],
  };

  const auraPersonas = {
    aura: {
      name: "Aura",
      role: "Principal FAANG Bar Raiser",
      badge: "L7 Bar Raiser",
      emotion: "✨ Encouraging",
      color: "indigo",
      quote:
        '"Great intuition on using an OrderedDict for O of 1 access! Now, if 16 concurrent worker threads call put() simultaneously, where would lock contention emerge and how would you shard the cache?"',
      time: "O(1) Amortized",
      space: "O(Capacity)",
    },
    alex: {
      name: "Alex",
      role: "Empathetic Staff Mentor",
      badge: "Socratic Coach",
      emotion: "🤝 Empathetic",
      color: "emerald",
      quote:
        '"You\'re doing awesome! Notice how move_to_end keeps the most recently used key fresh. Take a breath—what happens on line 19 when we exceed capacity?"',
      time: "O(1) Optimal",
      space: "O(N)",
    },
    elena: {
      name: "Elena",
      role: "Distributed Systems Architect",
      badge: "Production Scale",
      emotion: "🧠 Analytical",
      color: "cyan",
      quote:
        '"Clean in-memory structure. In a multi-region deployment with 250k QPS, how would you prevent a thundering herd stampede when hot keys expire simultaneously?"',
      time: "O(1) Lookup",
      space: "Bounded Memory",
    },
    kai: {
      name: "Kai",
      role: "Competitive Speed Specialist",
      badge: "Execution Speed",
      emotion: "🎉 Celebratory",
      color: "amber",
      quote:
        '"Boom—12 of 12 test assertions passed in 34ms! Zero allocations wasted. Ready to tackle a follow-up with TTL expiration timestamps?"',
      time: "O(1) Ultra-Fast",
      space: "O(K)",
    },
  };

  const currentPersona = auraPersonas[selectedPersona];

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-3xl p-2 sm:p-3.5 glass-card border border-white/15 shadow-[0_25px_90px_-15px_rgba(99,102,241,0.3)] overflow-hidden text-left">
      {/* Ambient top glow */}
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[520px] h-[320px] bg-gradient-to-b from-indigo-500/25 via-violet-500/15 to-transparent blur-3xl pointer-events-none" />

      {/* Top Interactive Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-slate-950/60 rounded-t-2xl relative z-10">
        {/* Window Traffic Lights + Interactive Mode Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* 4 Interactive Workspace Modes */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
            {[
              { id: "coding", label: "Live Coding & Copilot", icon: Terminal, color: "text-indigo-400" },
              { id: "aura", label: "Aura Voice AI", icon: Mic, color: "text-violet-400" },
              { id: "architecture", label: "System Design Sim", icon: Workflow, color: "text-cyan-400" },
              { id: "scorecard", label: "Executive Scorecard", icon: Award, color: "text-emerald-400" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMode(tab.id as PreviewMode)}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : tab.color}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Live Telemetry Pill */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>WebRTC Mesh • 18ms</span>
          </div>
        </div>
      </div>

      {/* Interactive Body Content */}
      <div className="min-h-[480px] bg-slate-950/75 relative z-10">
        <AnimatePresence mode="wait">
          {/* MODE 1: LIVE COLLABORATIVE CODING + COPILOT */}
          {activeMode === "coding" && (
            <motion.div
              key="coding"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] font-mono text-xs"
            >
              {/* Left 7 Cols: Multi-Language Monaco View */}
              <div className="lg:col-span-7 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
                <div>
                  {/* Language Switcher Bar */}
                  <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/10 font-sans">
                    <div className="flex items-center gap-1.5">
                      {(["python", "javascript", "java"] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setSelectedLang(lang)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                            selectedLang === lang
                              ? "bg-white/15 text-white border border-white/20 font-semibold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {lang === "python" ? "solution.py" : lang === "javascript" ? "solution.js" : "Solution.java"}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-indigo-300 font-mono bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                      Problem: LRU Cache (Medium)
                    </span>
                  </div>

                  {/* Code Lines */}
                  <div className="space-y-0.5 leading-6 text-slate-200 font-mono text-xs overflow-x-auto">
                    {codeSamples[selectedLang].map((line) => (
                      <div key={line.ln} className="flex items-center hover:bg-white/[0.03] rounded px-1 -mx-1">
                        <span className="w-7 shrink-0 text-right pr-3 text-slate-600 select-none text-[11px] border-r border-white/10 mr-3">
                          {line.ln}
                        </span>
                        <span className="whitespace-pre text-slate-200">{line.code}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Piston Sandbox Output */}
                <div className="mt-5 rounded-xl bg-slate-900/90 border border-emerald-500/25 p-3 shadow-inner font-sans">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold">
                      <Terminal className="w-3.5 h-3.5" /> Piston Sandbox Runner ({selectedLang})
                    </span>
                    <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Exit Code: 0
                    </span>
                  </div>
                  <div className="text-emerald-400/90 text-xs font-mono flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      All 12 / 12 test cases passed
                    </span>
                    <span className="text-slate-400 text-[11px]">34ms • 14.1 MB</span>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: WebRTC Video PIP + Nexus Copilot */}
              <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col gap-4 font-sans bg-slate-950/40">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden glass-card border border-white/15 bg-gradient-to-tr from-slate-900 to-indigo-950/60 p-2.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="glass-pill px-2 py-0.5 rounded-md text-[10px] text-white/90 font-medium">
                        Candidate
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div className="flex items-center justify-center my-auto">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold text-sm">
                        JS
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="truncate">Jordan S.</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Syncing</span>
                    </div>
                  </div>

                  <div className="relative aspect-video rounded-xl overflow-hidden glass-card border border-white/15 bg-gradient-to-tr from-slate-900 to-slate-950 p-2.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="glass-pill px-2 py-0.5 rounded-md text-[10px] text-white/90 font-medium">
                        Interviewer
                      </span>
                      <Mic className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-center my-auto">
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-violet-300 font-bold text-sm">
                        AM
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="truncate">Anik M. (Host)</span>
                      <span className="text-[10px] text-slate-400 font-mono">HD</span>
                    </div>
                  </div>
                </div>

                {/* Nexus Copilot Card */}
                <div className="flex-1 rounded-2xl glass-card border border-indigo-500/25 bg-gradient-to-b from-indigo-950/25 to-slate-950/70 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Nexus Interviewer Copilot</h4>
                          <p className="text-[10px] text-slate-400">Private AST & Big-O Telemetry</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-semibold">
                        Optimal O(1)
                      </span>
                    </div>

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
                      <span className="text-indigo-300 font-semibold block mb-0.5 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-indigo-400" /> Suggested Follow-Up Probe
                      </span>
                      Ask how the candidate would add thread-safe read-write locks or shard the hash table across multiple cores.
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authenticity: 99.4% Genuine
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30">
                      3-Tier Hints Ready
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MODE 2: AURA AI VOICE INTERVIEWER */}
          {activeMode === "aura" && (
            <motion.div
              key="aura"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] p-5 sm:p-7 gap-6 items-center"
            >
              {/* Left 5 Cols: Interactive Persona Switcher & 3D Sound Orb */}
              <div className="lg:col-span-5 flex flex-col items-center text-center p-6 rounded-2xl glass-card border border-white/15 relative overflow-hidden">
                <div className="w-full mb-5 grid grid-cols-4 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-[11px]">
                  {(
                    [
                      { id: "aura", label: "Aura" },
                      { id: "alex", label: "Alex" },
                      { id: "elena", label: "Elena" },
                      { id: "kai", label: "Kai" },
                    ] as const
                  ).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPersona(p.id)}
                      className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        selectedPersona === p.id
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Animated Audio Orb */}
                <div className="relative my-3">
                  <div className="w-24 h-24 rounded-full bg-indigo-500/25 border-2 border-indigo-400 shadow-[0_0_50px_rgba(99,102,241,0.55)] flex items-center justify-center relative">
                    <div
                      className="absolute inset-[-8px] rounded-full border border-dashed border-indigo-400/60 animate-spin"
                      style={{ animationDuration: "10s" }}
                    />
                    <Sparkles className="w-10 h-10 text-indigo-300" />
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-1">
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1 h-6 bg-indigo-400 rounded-full animate-bounce delay-75" />
                    <span className="w-1 h-4 bg-violet-400 rounded-full animate-bounce delay-150" />
                    <span className="w-1 h-7 bg-cyan-400 rounded-full animate-bounce delay-100" />
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mt-2">{currentPersona.name}</h3>
                <p className="text-xs text-indigo-300 font-medium">{currentPersona.role}</p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {currentPersona.emotion}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/5 text-slate-300 border border-white/10">
                    0.85x Natural Cadence
                  </span>
                </div>
              </div>

              {/* Right 7 Cols: Live Spoken Dialogue & Socratic Feedback */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl glass-surface border border-indigo-500/30 bg-indigo-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-semibold flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />
                      <span>{currentPersona.name} Speaking Live</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {currentPersona.badge}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-100 leading-relaxed italic">
                    {currentPersona.quote}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-slate-400 block">Detected Time Bound</span>
                    <span className="font-mono font-bold text-sm text-indigo-300 mt-0.5 block">
                      {currentPersona.time}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-slate-400 block">Detected Space Bound</span>
                    <span className="font-mono font-bold text-sm text-violet-300 mt-0.5 block">
                      {currentPersona.space}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-slate-400 block">Echo Suppression</span>
                    <span className="font-mono font-bold text-sm text-emerald-400 mt-0.5 block">
                      Active • Full Duplex
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MODE 3: SYSTEM DESIGN LIVE SIMULATION */}
          {activeMode === "architecture" && (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-5 sm:p-7 space-y-6 min-h-[480px] flex flex-col justify-between"
            >
              {/* Interactive Sim Controls Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl glass-surface border border-white/10">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300">Traffic Load:</span>
                    <input
                      type="range"
                      min={25000}
                      max={500000}
                      step={25000}
                      value={simQps}
                      onChange={(e) => setSimQps(Number(e.target.value))}
                      className="w-32 accent-indigo-500 cursor-pointer"
                    />
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                      {(simQps / 1000).toFixed(0)}k QPS
                    </span>
                  </div>

                  <button
                    onClick={() => setRedisFault(!redisFault)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-all ${
                      redisFault
                        ? "bg-rose-500/25 border-rose-400 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.35)]"
                        : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${redisFault ? "text-rose-400" : "text-amber-400"}`} />
                    <span>{redisFault ? "Fault Active: Redis Offline" : "Inject Chaos: Kill Redis Cache"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                    p99 Latency:{" "}
                    <strong className={redisFault ? "text-rose-400" : "text-emerald-400"}>
                      {redisFault ? "2,140ms" : `${Math.round(42 * Math.sqrt(simQps / 100000))}ms`}
                    </strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                    SLA:{" "}
                    <strong className={redisFault ? "text-rose-400" : "text-emerald-400"}>
                      {redisFault ? "58.4% (Degraded)" : "99.98%"}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Interactive Topology Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center my-auto py-4">
                {[
                  {
                    title: "Cloudflare Edge CDN",
                    tech: "HTTPS / Anycast",
                    icon: Globe,
                    qps: `${(simQps / 1000).toFixed(0)}k QPS`,
                    cpu: "22% CPU",
                    status: "Healthy",
                  },
                  {
                    title: "Envoy API Gateway",
                    tech: "gRPC / HTTP2",
                    icon: Layers,
                    qps: `${((simQps * 0.65) / 1000).toFixed(0)}k QPS`,
                    cpu: "41% CPU",
                    status: "Healthy",
                  },
                  {
                    title: "Redis Read Cluster",
                    tech: "In-Memory LRU",
                    icon: Server,
                    qps: redisFault ? "0 QPS (DOWN)" : `${((simQps * 0.58) / 1000).toFixed(0)}k QPS`,
                    cpu: redisFault ? "OFFLINE" : "34% CPU",
                    status: redisFault ? "Critical" : "Healthy",
                  },
                  {
                    title: "PostgreSQL Primary",
                    tech: "ACID Relational",
                    icon: Database,
                    qps: redisFault
                      ? `${((simQps * 0.65) / 1000).toFixed(0)}k QPS`
                      : `${((simQps * 0.08) / 1000).toFixed(0)}k QPS`,
                    cpu: redisFault ? "100% CPU (LOCKUP)" : "38% CPU",
                    status: redisFault ? "Critical" : "Healthy",
                  },
                ].map((node, i) => {
                  const Icon = node.icon;
                  const isCrit = node.status === "Critical";
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl glass-card border transition-all ${
                        isCrit
                          ? "border-rose-500/60 bg-rose-950/25 shadow-[0_0_25px_rgba(244,63,94,0.25)]"
                          : "border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            isCrit
                              ? "bg-rose-500/30 text-rose-200 border border-rose-400"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {node.qps}
                        </span>
                        <Activity className={`w-3.5 h-3.5 ${isCrit ? "text-rose-400 animate-bounce" : "text-cyan-400"}`} />
                      </div>
                      <div className="flex items-center gap-2.5 my-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{node.title}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">{node.tech}</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Telemetry</span>
                        <span className={isCrit ? "text-rose-400 font-bold" : "text-emerald-400"}>{node.cpu}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Atlas Critic Banner */}
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-slate-200">
                    {redisFault
                      ? "Atlas Critic Alert: Cache outage triggered 100% database connection pool saturation. Deploy Redis Sentinel with read replicas."
                      : "Atlas Critic: Topology sustains target QPS with 89% cache hit ratio and sub-50ms p95 latency."}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-indigo-300 shrink-0 ml-2">Live Telemetry</span>
              </div>
            </motion.div>
          )}

          {/* MODE 4: EXECUTIVE SCORECARD */}
          {activeMode === "scorecard" && (
            <motion.div
              key="scorecard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[480px]"
            >
              <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-emerald-500/30 bg-emerald-950/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                    Verdict: Strong Hire
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-white">94 / 100</span>
                </div>
                <h3 className="text-lg font-bold text-white">Veritas Calibrated Hiring Memo</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Candidate delivered an optimal O(1) LRU Cache implementation, proactively identified thread-safety invariants, and designed a resilient multi-tier architecture.
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Zero False-Positive Rubric</span>
                  <span className="text-emerald-400">Panel Consensus: 3 / 3 Pass</span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                {[
                  { label: "Algorithmic Rigor & Big-O Optimality", score: 96, color: "bg-indigo-500" },
                  { label: "System Design & Fault Tolerance", score: 92, color: "bg-cyan-500" },
                  { label: "Code Hygiene & Defensive Boundaries", score: 95, color: "bg-emerald-500" },
                  { label: "Technical Communication & Trade-offs", score: 91, color: "bg-violet-500" },
                ].map((dim, i) => (
                  <div key={i} className="p-3.5 rounded-xl glass-surface border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{dim.label}</span>
                      <span className="font-mono font-bold text-indigo-300">{dim.score} / 100</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full ${dim.color}`} style={{ width: `${dim.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
