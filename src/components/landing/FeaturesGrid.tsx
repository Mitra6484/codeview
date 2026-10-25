"use client";

import { Code2, Video, BrainCircuit, FileCheck, Film, CalendarDays } from "lucide-react";

export default function FeaturesGrid() {
  const features = [
    {
      icon: Code2,
      color: "from-indigo-500 to-indigo-600",
      accent: "text-indigo-400",
      border: "hover:border-indigo-500/40",
      title: "Collaborative Monaco IDE",
      description:
        "The industry-standard editor powering VS Code. Multi-language syntax highlighting, instant code execution, themes, and line-by-line inspection.",
    },
    {
      icon: Video,
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-400",
      border: "hover:border-emerald-500/40",
      title: "Ultra-Low Latency Video",
      description:
        "Engineered with Stream.io WebRTC infrastructure. Seamless HD video, adaptive bitrate, crystal clear audio, and built-in screen sharing.",
    },
    {
      icon: BrainCircuit,
      color: "from-violet-500 to-purple-600",
      accent: "text-violet-400",
      border: "hover:border-violet-500/40",
      title: "Gemini AI Code Analysis",
      description:
        "Automated Big-O complexity computation, AST logic verification, style checks, and candidate approach insights generated in real time.",
    },
    {
      icon: FileCheck,
      color: "from-blue-500 to-cyan-600",
      accent: "text-cyan-400",
      border: "hover:border-cyan-500/40",
      title: "Structured Evaluation & Voting",
      description:
        "Remove hiring bias with structured rubrics, private interviewer scratchpads, numerical ratings, and collaborative Pass/Fail voting.",
    },
    {
      icon: Film,
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-400",
      border: "hover:border-amber-500/40",
      title: "Full Session Recording",
      description:
        "Record audio, video, and code interactions automatically. Easily review past sessions with the hiring committee before making an offer.",
    },
    {
      icon: CalendarDays,
      color: "from-rose-500 to-pink-600",
      accent: "text-rose-400",
      border: "hover:border-rose-500/40",
      title: "Frictionless Scheduling",
      description:
        "Assign candidates and interviewers, manage scheduling queues, and launch instant one-click rooms without downloading third-party tools.",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="glass-pill px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Engineered For Modern Hiring
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need For High-Signal Interviews
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Replace fragmented setups of Zoom, Google Docs, and offline compilers with a single unified, glassmorphic technical platform.
          </p>
        </div>

        {/* 6 Glass Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className={`glass-card p-6 rounded-2xl flex flex-col justify-between group ${feat.border}`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} p-0.5 shadow-lg mb-5 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <div className="w-full h-full bg-slate-950/80 backdrop-blur-md rounded-[10px] flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${feat.accent}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-indigo-400/90 group-hover:text-indigo-300 transition-colors">
                  <span>Learn more</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
