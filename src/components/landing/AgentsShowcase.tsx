"use client";

import { useState } from "react";
import { Mic, Bot, Network, Award, Sparkles, ArrowRight, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

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
  const features: Feature[] = [
    {
      id: "voice-mock",
      name: "Voice Mock Practice",
      role: "Conversational Interviewer",
      badge: "Real-Time Bi-Directional Audio",
      accent: "from-indigo-500 to-indigo-600",
      glow: "text-indigo-400",
      borderGlow: "hover:border-indigo-400/50 hover:shadow-[0_0_35px_rgba(99,102,241,0.25)]",
      icon: Mic,
      headline: "Conversational mock interviews with real-time speech and adaptive hints",
      description:
        "Practice out loud with natural voice dialogue, explain your thought process, and receive supportive, targeted feedback on time complexity and edge cases without interview pressure.",
      skills: [
        "Natural speech synthesis & voice input transcription",
        "Adaptive hints when candidate pauses or gets stuck",
        "Monaco code editor with sandboxed test runners",
      ],
      sampleOutput: {
        label: "AI Voice Interviewer",
        text: '"Great intuition on using a two-pointer approach! Before coding, how might duplicate elements affect your inner while-loop condition?"',
        badge: "Voice Session Active",
      },
      link: "/mock-interview",
      ctaText: "Start Voice Practice",
    },
    {
      id: "copilot",
      name: "Live Interview Copilot",
      role: "In-Meeting Interviewer Assistant",
      badge: "Private Interviewer Drawer",
      accent: "from-violet-500 to-purple-600",
      glow: "text-violet-400",
      borderGlow: "hover:border-violet-400/50 hover:shadow-[0_0_35px_rgba(139,92,246,0.25)]",
      icon: Bot,
      headline: "Non-intrusive interviewer intelligence delivering progressive hints and Big-O radar",
      description:
        "Operates quietly in the interviewer's private drawer during live calls, streaming real-time AST syntax analysis, detecting algorithmic pitfalls, and generating 3-tier progressive hints.",
      skills: [
        "Real-time Big-O time and space complexity detection",
        "3-Tier progressive hints: Nudge, Structure, and Vector",
        "Contextual technical follow-up questions",
      ],
      sampleOutput: {
        label: "Copilot Signal",
        text: "Candidate current loop is O(N²). Recommend Tier-1 Nudge: Ask how a hash map could optimize the second look-up pass to O(1).",
        badge: "Private to Interviewer",
      },
      link: "/schedule",
      ctaText: "Launch Interview Room",
    },
    {
      id: "system-design",
      name: "System Design Studio",
      role: "Architecture Whiteboard & Simulation",
      badge: "Interactive Canvas & Simulation",
      accent: "from-cyan-500 to-blue-600",
      glow: "text-cyan-400",
      borderGlow: "hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(6,182,212,0.25)]",
      icon: Network,
      headline: "Real-time topology evaluator simulating 100k+ QPS loads and failure modes",
      description:
        "Design distributed architectures directly on an interactive SVG canvas. Connect load balancers, caching layers, and database clusters while the engine simulates traffic spikes and audits bottlenecks.",
      skills: [
        "Interactive node & connection topology canvas",
        "Real-time 100k QPS load & bottleneck simulation",
        "Single-point-of-failure (SPOF) and partition tolerance critique",
      ],
      sampleOutput: {
        label: "Architecture Simulation Report",
        text: "Redis cluster missing replication replicas. At 100,000 QPS, primary cache eviction triggers database connection pool exhaustion.",
        badge: "Bottleneck Detected",
      },
      link: "/system-design",
      ctaText: "Open System Canvas",
    },
    {
      id: "scorecard",
      name: "Executive Scorecards",
      role: "Standardized Rubric Grading",
      badge: "Calibrated Hiring Memo",
      accent: "from-emerald-500 to-teal-600",
      glow: "text-emerald-400",
      borderGlow: "hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]",
      icon: Award,
      headline: "Multi-dimensional candidate evaluation synthesizing unbiased hiring verdicts",
      description:
        "Audits completed session code, interviewer notes, and candidate communication to generate an executive scorecard with radar skill charts and clear hiring recommendations.",
      skills: [
        "4-Dimensional scoring: Algorithms, Architecture, Communication, Complexity",
        "Standardized verdicts: Strong Hire to Strong No-Hire",
        "Candidate strengths, blindspots, and leveling signals",
      ],
      sampleOutput: {
        label: "Executive Evaluation",
        text: "Verdict: Strong Hire (Score: 92/100). Exceptional algorithmic rigor and clean modular decomposition with optimal O(N) space bounds.",
        badge: "Calibrated Decision",
      },
      link: "/dashboard",
      ctaText: "View Scorecards",
    },
    {
      id: "questions",
      name: "Question Studio",
      role: "Algorithmic Challenge Bank",
      badge: "Test Suite Scaffolding",
      accent: "from-amber-500 to-rose-600",
      glow: "text-amber-400",
      borderGlow: "hover:border-amber-400/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)]",
      icon: Sparkles,
      headline: "Curated interview challenges with multi-language starter code and test suites",
      description:
        "Manage or synthesize high-signal coding questions customized for target engineering roles, domains, and difficulty tiers, complete with runnable test cases and interviewer grading keys.",
      skills: [
        "Multi-language templates in Python, JavaScript, and Java",
        "Edge-case test assertions with inputs, outputs, and explanations",
        "Interviewer guidance notes and expected algorithmic constraints",
      ],
      sampleOutput: {
        label: "Challenge Generator",
        text: 'Synthesized: "Distributed Rate Limiter with Sliding Window Counter" — 3 test cases, O(1) memory bound, interviewer rubric included.',
        badge: "Ready in 1.4s",
      },
      link: "/dashboard/questions",
      ctaText: "Browse Challenges",
    },
  ];

  const [activeFeatureId, setActiveFeatureId] = useState(features[0].id);
  const activeFeature = features.find((f) => f.id === activeFeatureId) || features[0];
  const ActiveIcon = activeFeature.icon;

  return (
    <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider text-indigo-300">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Engineered for Every Stage of the Technical Interview
          </h2>
          <p className="text-base sm:text-lg text-slate-300/85 leading-relaxed">
            From live collaborative coding and voice practice to system design whiteboard simulation and executive scorecards — everything your team needs in one workspace.
          </p>
        </div>

        {/* Agent Selector Tabs (Apple Glass Pill Bar) */}
        {/* Feature Selector Tabs (Apple Glass Pill Bar) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 p-2 rounded-2xl glass-surface max-w-4xl mx-auto border border-white/12">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = feature.id === activeFeatureId;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeatureId(feature.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white/15 text-white border border-white/25 shadow-lg shadow-black/40 scale-102"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? feature.glow : "text-slate-400"}`} />
                <span>{feature.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Spotlight Card (Apple VisionOS Glass Card) */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/15 shadow-2xl relative overflow-hidden transition-all duration-500">
          {/* Subtle Top Specular Sheen */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left 7 Columns: Identity & Details */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${activeFeature.accent} p-0.5 shadow-lg shadow-black/40`}
                >
                  <div className="w-full h-full bg-slate-950/80 backdrop-blur-md rounded-[14px] flex items-center justify-center">
                    <ActiveIcon className={`w-6 h-6 ${activeFeature.glow}`} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
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

              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal">
                {activeFeature.description}
              </p>

              {/* Core Feature Capabilities */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                  Key Capabilities:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                  {activeFeature.skills.map((skill, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 glass-surface px-3 py-2 rounded-xl border border-white/10"
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${activeFeature.glow}`} />
                      <span className="truncate">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link href={activeFeature.link}>
                  <button className="glass-btn-primary px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg">
                    <span>{activeFeature.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Right 5 Columns: Live Telemetry / Sample Output */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl glass-surface border border-white/15 bg-slate-950/60 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-semibold text-slate-300">
                    {activeFeature.sampleOutput.label}
                  </span>
                </div>
                {activeFeature.sampleOutput.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/10 text-slate-300 border border-white/10">
                    {activeFeature.sampleOutput.badge}
                  </span>
                )}
              </div>

              {/* Output Box */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-200 leading-relaxed shadow-inner">
                <p className="text-slate-100">{activeFeature.sampleOutput.text}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
                <span>Real-Time Engine</span>
                <span className="text-emerald-400">Sub-150ms Response</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Overview Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isCurrent = feature.id === activeFeatureId;
            return (
              <div
                key={feature.id}
                onClick={() => setActiveFeatureId(feature.id)}
                className={`glass-card p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isCurrent
                    ? "border-white/30 bg-white/[0.08] shadow-xl"
                    : "hover:border-white/20 border-white/10"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${feature.accent} p-0.5 shadow-md`}
                    >
                      <div className="w-full h-full bg-slate-950/90 rounded-[10px] flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${feature.glow}`} />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{feature.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {feature.headline}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
                  <span>Explore Feature</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
