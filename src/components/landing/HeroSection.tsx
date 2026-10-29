"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Video,
  ShieldCheck,
  Workflow,
  Mic,
  Activity,
  Award,
  CheckCircle2,
  Zap,
} from "lucide-react";
import IdePreviewMockup from "./IdePreviewMockup";
import { motion } from "framer-motion";

export default function HeroSection() {
  const assignRole = (role: "interviewer" | "candidate") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("codeview_signup_role", role);
      localStorage.setItem("codeview_test_role", role);
      window.dispatchEvent(new Event("codeview_role_changed"));
    }
  };

  return (
    <section className="relative pt-10 pb-24 sm:pt-16 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient Cosmic Glow Orbs */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[820px] h-[520px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/12 to-cyan-500/12 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/5 w-[420px] h-[420px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto text-center space-y-8">
        {/* Top VisionOS Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-pill text-xs sm:text-sm font-medium text-slate-200 shadow-lg shadow-indigo-500/10 border border-white/15"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-indigo-300">Aura Voice AI</span>
          <span className="text-white/20">•</span>
          <span>500k QPS System Simulator</span>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-emerald-300">Calibrated Hiring Scorecards</span>
        </motion.div>

        {/* Main Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-5xl mx-auto"
        >
          The AI-Native Operating System for{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
            Technical Interviews.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300/90 leading-relaxed font-normal"
        >
          Replace fragmented video calls, static coding pads, and subjective hiring notes with one unified workspace: synchronized Monaco IDE, conversational voice mock interviews with{" "}
          <span className="text-white font-semibold">Aura</span>, live{" "}
          <span className="text-white font-semibold">500k QPS architecture simulation</span>, and unbiased executive scorecards.
        </motion.p>

        {/* Dual-Role Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <SignUpButton mode="modal">
            <button
              onClick={() => assignRole("interviewer")}
              className="w-full sm:w-auto glass-btn-primary px-8 py-4 rounded-2xl text-sm sm:text-base font-semibold text-white flex items-center justify-center gap-2.5 cursor-pointer group shadow-2xl shadow-indigo-500/30"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-200" />
              <span>Start as Interviewer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignUpButton>

          <SignUpButton mode="modal">
            <button
              onClick={() => assignRole("candidate")}
              className="w-full sm:w-auto glass-btn-secondary px-8 py-4 rounded-2xl text-sm sm:text-base font-semibold text-emerald-300 hover:text-white border-emerald-500/30 hover:border-emerald-400/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Practice with Aura (Candidate)</span>
            </button>
          </SignUpButton>

          <SignInButton mode="modal">
            <button className="w-full sm:w-auto px-5 py-3.5 text-sm text-slate-400 hover:text-white font-medium cursor-pointer transition-colors">
              Sign In →
            </button>
          </SignInButton>
        </motion.div>

        {/* 4 High-Signal Telemetry Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4 text-left">
          {[
            {
              icon: Mic,
              color: "text-indigo-400",
              value: "4 AI Personas",
              label: "Aura Voice Bar Raiser & Coaches",
            },
            {
              icon: Activity,
              color: "text-cyan-400",
              value: "500,000 QPS",
              label: "Live Packet & Chaos Simulation",
            },
            {
              icon: Code2,
              color: "text-emerald-400",
              value: "< 25ms Sync",
              label: "Collaborative Monaco + Piston",
            },
            {
              icon: Award,
              color: "text-violet-400",
              value: "5-Dim Rubric",
              label: "Calibrated Executive Scorecards",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="glass-surface p-3.5 rounded-2xl border border-white/10 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-white font-mono truncate">{stat.value}</div>
                  <div className="text-[11px] text-slate-400 truncate">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Multi-Mode Workspace Preview */}
        <div id="ide-preview" className="pt-8 sm:pt-12 scroll-mt-24 text-left">
          <div className="text-center mb-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-300/80">
              ↓ Click Any Workspace Tab Below to Experience Live Interactive Telemetry ↓
            </span>
          </div>
          <IdePreviewMockup />
        </div>
      </div>
    </section>
  );
}
