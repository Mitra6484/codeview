"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, ShieldCheck, Check, Sparkles, UserPlus, LogIn, Lock } from "lucide-react";

export default function AuthSection() {
  return (
    <section id="auth-section" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/15 to-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl p-8 sm:p-12 lg:p-14 border border-white/15 relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(99,102,241,0.25)]">
          {/* Subtle top edge specular sheen */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-medium text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Zero Setup Required • Free Tier Available</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Level Up Your Hiring with{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
                  Codeview
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Join engineering teams conducting structured, high-signal technical interviews with live Monaco coding, low-latency video, and continuous AI intelligence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2.5 glass-surface px-3.5 py-2.5 rounded-xl border border-white/5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Monaco Live IDE & Runtimes</span>
                </div>
                <div className="flex items-center gap-2.5 glass-surface px-3.5 py-2.5 rounded-xl border border-white/5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Real-Time Gemini AI Insights</span>
                </div>
                <div className="flex items-center gap-2.5 glass-surface px-3.5 py-2.5 rounded-xl border border-white/5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Stream.io HD Video & Audio</span>
                </div>
                <div className="flex items-center gap-2.5 glass-surface px-3.5 py-2.5 rounded-xl border border-white/5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Full Session Recording & Replay</span>
                </div>
              </div>
            </div>

            {/* Right Column: Refined Glass Authentication Box */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl glass-surface border border-white/10 bg-slate-950/70 shadow-2xl relative">
              <div className="text-center space-y-1.5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/10 mb-3">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Access Codeview</h3>
                <p className="text-xs text-slate-400">Join as an interviewer or candidate</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <SignUpButton mode="modal">
                  <button className="w-full glass-btn-primary py-3.5 px-5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer group shadow-lg shadow-indigo-500/25">
                    <UserPlus className="w-4 h-4 text-indigo-200" />
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform ml-1" />
                  </button>
                </SignUpButton>

                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <span className="relative px-3 bg-slate-950/80 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                    Already registered?
                  </span>
                </div>

                <SignInButton mode="modal">
                  <button className="w-full glass-btn-secondary py-3.5 px-5 rounded-xl text-sm font-medium text-slate-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all">
                    <LogIn className="w-4 h-4 text-slate-400" />
                    <span>Sign In to Workspace</span>
                  </button>
                </SignInButton>
              </div>

              {/* Security Footer Note */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Enterprise Auth via Clerk • Single Sign-On</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
