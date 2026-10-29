"use client";

import { useState } from "react";
import {
  Mic,
  Bot,
  Network,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Zap,
  HeartHandshake,
  Layers,
  Volume2,
  ShieldCheck,
  Code2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Feature {
  id: string;
  name: string;
  role: string;
  badge: string;
  accent: string;
  glow: string;
  borderGlow: string;
  icon: any;
  headline: string;
  description: string;
  skills: string[];
  sampleOutput: {
    label: string;
    text: string;
    badge?: string;
  };
  link: string;
  ctaText: string;
}

export default function AgentsShowcase() {
  const auraPersonas = [
    {
      id: "aura",
      name: "Aura",
      title: "Principal FAANG Bar Raiser",
      badge: "L7 Rigor",
      icon: Sparkles,
      accent: "from-indigo-500 to-violet-600",
      textColor: "text-indigo-400",
      borderColor: "border-indigo-500/30",
      style: "Probes asymptotic Big-O optimality, tricky invariants, and boundary conditions.",
      sample: '"Your two-pointer traversal is O of N, which is optimal. How does your loop invariant hold if all array values are negative?"',
    },
    {
      id: "alex",
      name: "Alex",
      title: "Empathetic Staff Mentor",
      badge: "Socratic Coach",
      icon: HeartHandshake,
      accent: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      style: "Builds psychological safety with calm, incremental Socratic nudges when you feel stuck.",
      sample: '"Take a deep breath—no rush at all! Let\'s start by tracing what happens to the window sum on the very first 3 elements."',
    },
    {
      id: "elena",
      name: "Elena",
      title: "Staff Systems Architect",
      badge: "Production Scale",
      icon: Layers,
      accent: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      style: "Evaluates modular abstraction, memory footprint, and concurrency under production load.",
      sample: '"Clean separation of concerns. If this service processes 100k requests per second, where would memory allocations bottleneck?"',
    },
    {
      id: "kai",
      name: "Kai",
      title: "Speed-Run Coding Coach",
      badge: "Rapid Execution",
      icon: Zap,
      accent: "from-amber-500 to-orange-600",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/30",
      style: "High-energy pattern recognition focused on rapid test-driven debugging and speed.",
      sample: '"Classic sliding window pattern! Let\'s get a baseline passing the test suite in 3 minutes and then optimize space."',
    },
  ];

  const features: Feature[] = [
    {
      id: "voice-mock",
      name: "Aura — AI Voice Interviewer",
      role: "Autonomous Technical Bar Raiser & Voice Coach",
      badge: "4 Selectable Personas • Voice AI",
      accent: "from-indigo-500 to-indigo-600",
      glow: "text-indigo-400",
      borderGlow: "hover:border-indigo-400/50 hover:shadow-[0_0_35px_rgba(99,102,241,0.25)]",
      icon: Sparkles,
      headline: "Conversational mock interviews with FAANG-calibrated voice personas and Socratic hints",
      description:
        "Select your interviewer: from Aura (Principal Bar Raiser) and Alex (Empathetic Mentor) to Elena (Systems Architect) and Kai (Speed Coach). Practice out loud with real-time speech dialogue, customize neural voice cadence, and receive targeted feedback on Big-O trade-offs.",
      skills: [
        "4 Calibrated Personas: Principal Bar Raiser, Empathetic Mentor, Systems Architect, Speed Coach",
        "Custom neural voice selector & adjustable speech cadence (0.85x–1.2x)",
        "Real-time echo suppression, silence detection, and emotional prosody",
        "Calibrated post-session scorecard that never inflates unimplemented code",
      ],
      sampleOutput: {
        label: "Aura • Principal Bar Raiser",
        text: '"Great intuition on using a two-pointer approach! Before coding, how might duplicate elements affect your inner while-loop boundary condition?"',
        badge: "Aura Active • L7 Standard",
      },
      link: "/mock-interview",
      ctaText: "Practice with Aura",
    },
    {
      id: "copilot",
      name: "Nexus — Live Interview Copilot",
      role: "In-Meeting Interviewer Intelligence",
      badge: "Private Interviewer Drawer",
      accent: "from-violet-500 to-purple-600",
      glow: "text-violet-400",
      borderGlow: "hover:border-violet-400/50 hover:shadow-[0_0_35px_rgba(139,92,246,0.25)]",
      icon: Bot,
      headline: "Non-intrusive interviewer intelligence delivering progressive hints and Big-O radar",
      description:
        "Operates quietly in the interviewer's private drawer during live WebRTC calls, streaming real-time AST syntax analysis, detecting algorithmic pitfalls, and dispatching 3-tier progressive hints directly to the candidate's screen.",
      skills: [
        "Real-time Big-O time and space complexity detection",
        "1-Click dispatch of Tier-1 Nudge, Tier-2 Structural, or Tier-3 Vector hints",
        "Contextual follow-up questions tailored to the candidate's exact code",
        "Live code authenticity & plagiarism pattern verification",
      ],
      sampleOutput: {
        label: "Nexus Copilot Signal",
        text: "Candidate current loop is O(N²). Recommend dispatching Tier-1 Nudge: Ask how an auxiliary hash map could reduce lookup time to O(1).",
        badge: "Private to Interviewer",
      },
      link: "/schedule",
      ctaText: "Launch Interview Room",
    },
    {
      id: "system-design",
      name: "Atlas — System Design Simulator",
      role: "Continuous Traffic & Chaos Engineering Studio",
      badge: "1k–500k QPS Live Engine",
      accent: "from-cyan-500 to-blue-600",
      glow: "text-cyan-400",
      borderGlow: "hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(6,182,212,0.25)]",
      icon: Network,
      headline: "Interactive cloud topology canvas with continuous packet flow and chaos fault injection",
      description:
        "Design distributed architectures with 10+ cloud primitives or load production presets. Slide traffic from 1k to 500k QPS, inject chaos faults (kill Redis, saturate DB pools, induce cross-zone lag), and run Atlas AI audits.",
      skills: [
        "Continuous live packet animation & per-node CPU/RAM/QPS HUD",
        "Interactive QPS load slider (1,000 to 500,000 QPS)",
        "Chaos Engineering: Inject Redis crashes, DB pool exhaustion, or CDN bypass",
        "1-Click Presets: 3-Tier Web, E-Commerce Microservices, Video Streaming, Chat Mesh",
      ],
      sampleOutput: {
        label: "Atlas Chaos Telemetry",
        text: "FAULT INJECTED: Redis Cluster offline at 250,000 QPS. Cache hit ratio dropped to 0%, spiking PostgreSQL Primary to 100% CPU lockup.",
        badge: "Chaos Test Active",
      },
      link: "/system-design",
      ctaText: "Open System Canvas",
    },
    {
      id: "scorecard",
      name: "Veritas — Executive Scorecards",
      role: "Calibrated 5-Dimension Rubric Engine",
      badge: "Unbiased Hiring Memo",
      accent: "from-emerald-500 to-teal-600",
      glow: "text-emerald-400",
      borderGlow: "hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]",
      icon: Award,
      headline: "Multi-dimensional candidate evaluation synthesizing calibrated hiring verdicts",
      description:
        "Synthesizes candidate code submissions, sandbox execution results, interviewer rubric scores, and session notes into a comprehensive executive hiring memo with 5-dimension scoring and panel pass/fail voting.",
      skills: [
        "5-Dimension scoring: Algorithmic Rigor, Communication, Code Hygiene, Agility, Edge Cases",
        "Calibrated verdicts from Strong Hire to No Hire with executive rationale",
        "Automated candidate feedback letter for constructive post-interview growth",
        "Multi-interviewer consensus voting and comment synchronization",
      ],
      sampleOutput: {
        label: "Veritas Executive Evaluation",
        text: "Verdict: Strong Hire (92/100). Optimal O(N) time complexity, clean modular decomposition, and proactive boundary validation.",
        badge: "Calibrated Decision",
      },
      link: "/dashboard",
      ctaText: "View Scorecards",
    },
    {
      id: "questions",
      name: "Genesis — AI Question Studio",
      role: "Algorithmic Challenge Synthesizer",
      badge: "Multi-Language Scaffolding",
      accent: "from-amber-500 to-rose-600",
      glow: "text-amber-400",
      borderGlow: "hover:border-amber-400/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)]",
      icon: Code2,
      headline: "On-demand algorithmic challenge generation with starter code and grading keys",
      description:
        "Generate bespoke, leak-proof coding problems tailored to any engineering role, topic, and difficulty tier—complete with verified input/output examples, constraints, and starter templates for Python, JavaScript, and Java.",
      skills: [
        "Synthesize custom Easy, Medium, or Hard challenges in seconds",
        "Auto-generated starter code templates for Python, JavaScript, and Java",
        "Verified example test cases with step-by-step explanations",
        "Private interviewer grading guidance and expected Big-O complexity",
      ],
      sampleOutput: {
        label: "Genesis Challenge Synthesizer",
        text: 'Generated: "Distributed Rate Limiter with Sliding Window Counter" — 3 verified test cases, Python/JS/Java starter code, O(1) amortized rubric.',
        badge: "Ready in 1.2s",
      },
      link: "/dashboard/questions",
      ctaText: "Browse Question Studio",
    },
  ];

  const [activeFeatureId, setActiveFeatureId] = useState(features[0].id);
  const activeFeature = features.find((f) => f.id === activeFeatureId) || features[0];
  const ActiveIcon = activeFeature.icon;

  return (
    <div className="space-y-28 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      {/* SECTION 1: FLAGSHIP AURA 4-PERSONA VOICE STUDIO SPOTLIGHT */}
      <section id="aura-spotlight" className="max-w-7xl mx-auto scroll-mt-24 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider text-indigo-300">
            <Mic className="w-3.5 h-3.5 text-indigo-400" />
            <span>Meet Aura • Flagship Voice AI Suite</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Four Distinct AI Interviewer Personas.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
              Zero Generic Chatbots.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300/85 leading-relaxed">
            Whether you want the high-pressure rigor of a Principal FAANG Bar Raiser or the warm Socratic encouragement of a Staff Mentor, choose your interviewer persona and speak naturally.
          </p>
        </div>

        {/* 4 Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {auraPersonas.map((p) => {
            const PIcon = p.icon;
            return (
              <div
                key={p.id}
                className={`glass-card rounded-3xl p-6 border ${p.borderColor} flex flex-col justify-between relative overflow-hidden group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${p.accent} p-0.5 shadow-lg`}>
                      <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center">
                        <PIcon className={`w-5 h-5 ${p.textColor}`} />
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/10 text-slate-200 border border-white/10">
                      {p.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-white">{p.name}</h3>
                    <p className={`text-xs font-semibold ${p.textColor}`}>{p.title}</p>
                    <p className="text-xs text-slate-300/90 mt-2 leading-relaxed">{p.style}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 italic leading-relaxed">
                    {p.sample}
                  </div>
                  <Link
                    href="/mock-interview"
                    className={`flex items-center justify-between text-xs font-semibold ${p.textColor} group-hover:translate-x-0.5 transition-transform`}
                  >
                    <span>Interview with {p.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: 5 SPECIALIZED AI AGENTS & CAPABILITIES */}
      <section id="features" className="max-w-7xl mx-auto scroll-mt-24 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-Agent Engineering Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Five Specialized Engines Powering Every Round
          </h2>
          <p className="text-base sm:text-lg text-slate-300/85 leading-relaxed">
            Built on a resilient multi-model AI router with deterministic calibration fallbacks—ensuring sub-second responsiveness and 100% uptime.
          </p>
        </div>

        {/* Selector Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl glass-surface max-w-5xl mx-auto border border-white/12">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = feature.id === activeFeatureId;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeatureId(feature.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white border border-indigo-400/50 shadow-lg shadow-indigo-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : feature.glow}`} />
                <span>{feature.name.split(" — ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Agent Spotlight Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/15 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${activeFeature.accent} p-0.5 shadow-lg`}>
                  <div className="w-full h-full bg-slate-950/85 backdrop-blur-md rounded-[14px] flex items-center justify-center">
                    <ActiveIcon className={`w-6 h-6 ${activeFeature.glow}`} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {activeFeature.name}
                    </h3>
                    <span className="px-3 py-0.5 rounded-full glass-surface text-xs font-mono font-medium text-slate-300 border border-white/10">
                      {activeFeature.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-indigo-300 font-medium">{activeFeature.role}</p>
                </div>
              </div>

              <h4 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
                {activeFeature.headline}
              </h4>

              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
                {activeFeature.description}
              </p>

              <div className="space-y-2.5 pt-1">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                  Production Capabilities:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
                  {activeFeature.skills.map((skill, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 glass-surface p-3 rounded-xl border border-white/10"
                    >
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${activeFeature.glow}`} />
                      <span className="leading-relaxed">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link href={activeFeature.link}>
                  <button className="glass-btn-primary px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg">
                    <span>{activeFeature.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Right 5 Cols: Live Telemetry Output */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl glass-surface border border-white/15 bg-slate-950/70 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-semibold text-slate-200">
                    {activeFeature.sampleOutput.label}
                  </span>
                </div>
                {activeFeature.sampleOutput.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {activeFeature.sampleOutput.badge}
                  </span>
                )}
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-slate-100 leading-relaxed shadow-inner">
                {activeFeature.sampleOutput.text}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
                <span>Multi-Model Failover Router</span>
                <span className="text-emerald-400">Zero-Downtime SLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: END-TO-END INTERVIEW LIFECYCLE */}
      <section id="workflow" className="max-w-7xl mx-auto scroll-mt-24 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unified Assessment Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From Challenge Synthesis to Hiring Consensus in 4 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            {
              step: "01",
              title: "Synthesize or Schedule",
              desc: "Generate role-calibrated coding problems with Genesis AI or book candidate time slots with instant notifications.",
              badge: "Pre-Interview",
            },
            {
              step: "02",
              title: "Collaborate in Code & Video",
              desc: "Join the low-latency WebRTC room with synchronized Monaco code editing and remote Piston sandbox execution.",
              badge: "Live Coding",
            },
            {
              step: "03",
              title: "Stress-Test Architecture",
              desc: "Switch to the System Design Canvas to model distributed topologies and inject 500k QPS chaos faults live.",
              badge: "System Design",
            },
            {
              step: "04",
              title: "Calibrated Scorecard Verdict",
              desc: "Veritas compiles code quality, rubric ratings, and panel votes into an objective 5-dimension hiring memo.",
              badge: "Decision",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold font-mono bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-indigo-400">
                <span>Real-Time Convex Sync</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
