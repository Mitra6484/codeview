"use client";

import { Calendar, Terminal, Sparkles, CheckCircle2 } from "lucide-react";

export default function WorkflowSection() {
  const steps = [
    {
      num: "01",
      icon: Calendar,
      title: "Schedule & Invite",
      desc: "Create an interview session in seconds. Assign interviewers and candidates with automatic invite notifications and role-based permissions.",
    },
    {
      num: "02",
      icon: Terminal,
      title: "Collaborate in Monaco IDE",
      desc: "Join a distraction-free glassmorphic environment with multi-language execution, synchronized code editing, and HD audio/video.",
    },
    {
      num: "03",
      icon: Sparkles,
      title: "Real-time AI Inspection",
      desc: "Gemini AI delivers continuous insights on time/space complexity, syntax correctness, and provides hints if the candidate gets stuck.",
    },
    {
      num: "04",
      icon: CheckCircle2,
      title: "Vote & Conclude",
      desc: "Fill in structured scorecards, leave timestamped notes, and cast final Pass/Fail votes backed by full video recordings.",
    },
  ];

  return (
    <section id="workflow" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="glass-pill px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Simple 4-Step Pipeline
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            From First Hello to Final Offer
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            A frictionless, streamlined technical hiring workflow designed for engineers by engineers.
          </p>
        </div>

        {/* 4 Steps Timeline / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Background Large Step Number */}
                <div className="absolute -top-3 -right-3 text-6xl font-black text-white/[0.03] select-none group-hover:text-white/[0.06] transition-colors">
                  {step.num}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      STEP {step.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                  <span className="text-[11px] font-mono text-slate-400">Phase {idx + 1} Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
