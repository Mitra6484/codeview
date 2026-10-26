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
        {/* Clean Engineering Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs sm:text-sm font-medium text-slate-200 shadow-lg shadow-indigo-500/10">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span>Technical Interview & Engineering Assessment Platform</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
          Technical interviews,{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
            engineered for signal.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300/90 leading-relaxed font-normal">
          Live collaborative Monaco coding, low-latency video, interactive system design canvas, voice-driven mock interviews, and objective evaluation scorecards.
        </p>

        {/* Primary Glass Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <SignUpButton mode="modal">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("codeview_signup_role", "interviewer");
                  localStorage.setItem("codeview_test_role", "interviewer");
                  window.dispatchEvent(new Event("codeview_role_changed"));
                }
              }}
              className="w-full sm:w-auto glass-btn-primary px-8 py-3.5 rounded-2xl text-base font-semibold text-white flex items-center justify-center gap-2 cursor-pointer group shadow-xl"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-300" />
              <span>Sign Up as Interviewer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignUpButton>

          <SignUpButton mode="modal">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("codeview_signup_role", "candidate");
                  localStorage.setItem("codeview_test_role", "candidate");
                  window.dispatchEvent(new Event("codeview_role_changed"));
                }
              }}
              className="w-full sm:w-auto glass-btn-secondary px-8 py-3.5 rounded-2xl text-base font-medium text-slate-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Sign Up as Candidate</span>
            </button>
          </SignUpButton>

          <SignInButton mode="modal">
            <button className="w-full sm:w-auto px-5 py-3.5 text-sm text-slate-400 hover:text-white font-medium cursor-pointer transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>

        {/* Key Platform Capabilities */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 text-xs text-slate-300">
          <div className="glass-surface py-2.5 px-3 rounded-xl flex items-center justify-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <span>Monaco Code Editor</span>
          </div>
          <div className="glass-surface py-2.5 px-3 rounded-xl flex items-center justify-center gap-2">
            <Video className="w-4 h-4 text-emerald-400" />
            <span>WebRTC HD Video & Audio</span>
          </div>
          <div className="glass-surface py-2.5 px-3 rounded-xl flex items-center justify-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>System Design Whiteboard</span>
          </div>
          <div className="glass-surface py-2.5 px-3 rounded-xl flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Executive Scorecards</span>
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
