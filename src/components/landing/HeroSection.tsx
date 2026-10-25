"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles, Code, Video, ShieldCheck, Cpu } from "lucide-react";
import IdePreviewMockup from "./IdePreviewMockup";

export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient lighting orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto text-center space-y-8">
        {/* Animated Glass Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs sm:text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation Technical Assessment Platform</span>
          <span className="text-white/30">•</span>
          <span className="text-slate-400 font-normal">Powered by Gemini AI</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
          Conduct Technical Interviews{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm">
            with Superpowers.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300/90 leading-relaxed font-normal">
          The all-in-one collaborative workspace for engineering leaders. Real-time Monaco code editing, low-latency video streaming, automated Gemini code analysis, and structured candidate evaluation.
        </p>

        {/* Primary Glass Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <SignUpButton mode="modal">
            <button className="w-full sm:w-auto glass-btn-primary px-8 py-3.5 rounded-2xl text-base font-semibold text-white flex items-center justify-center gap-2 cursor-pointer group">
              <span>Start Interviewing Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignUpButton>

          <SignInButton mode="modal">
            <button className="w-full sm:w-auto glass-btn-secondary px-8 py-3.5 rounded-2xl text-base font-medium text-slate-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer">
              <span>Sign In to Dashboard</span>
            </button>
          </SignInButton>
        </div>

        {/* Key Highlight Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 text-xs text-slate-400">
          <div className="glass-surface py-2.5 px-3 rounded-xl flex items-center justify-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <span>Monaco Editor Engine</span>
          </div>
          <div className="glass-surface py-2.5 px-3 rounded-xl flex items-center justify-center gap-2">
            <Video className="w-4 h-4 text-emerald-400" />
            <span>Stream Ultra-Low Latency</span>
          </div>
          <div className="glass-surface py-2.5 px-3 rounded-xl flex items-center justify-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>Gemini AI Code Insights</span>
          </div>
          <div className="glass-surface py-2.5 px-3 rounded-xl flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>

        {/* Embedded Interactive IDE Mockup Preview */}
        <div id="ide-preview" className="pt-8 sm:pt-12 scroll-mt-24">
          <IdePreviewMockup />
        </div>
      </div>
    </section>
  );
}
