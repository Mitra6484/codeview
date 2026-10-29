"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  UserPlus,
  LogIn,
  Lock,
  Mic,
  Workflow,
  Award,
  Code2,
} from "lucide-react";

export default function AuthSection() {
  const assignRole = (role: "interviewer" | "candidate") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("codeview_signup_role", role);
      localStorage.setItem("codeview_test_role", role);
      window.dispatchEvent(new Event("codeview_role_changed"));
    }
  };

  return (
    <section id="auth-section" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative scroll-mt-20">
      {/* Ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[480px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="glass-card rounded-3xl p-8 sm:p-12 lg:p-14 border border-white/15 relative overflow-hidden shadow-[0_25px_70px_-15px_rgba(99,102,241,0.3)]">
          {/* Top specular reflection */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left 7 Columns: Role Comparison & Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dual-Persona Engineering Workspace</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to Transform Your{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
                  Technical Interviews?
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Whether you are an engineering team hiring high-signal talent or a software engineer preparing for FAANG-level rounds, CodeView gives you a dedicated workspace.
              </p>

              {/* Dual-Role Capability Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl glass-surface border border-indigo-500/25 space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider font-mono">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>For Interviewers</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Schedule & host live WebRTC coding calls</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Private Nexus Copilot & 3-tier hints</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Genesis AI Question Studio & Scorecards</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl glass-surface border border-emerald-500/25 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider font-mono">
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span>For Candidates</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>24/7 voice mock practice with Aura AI</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Interactive 500k QPS System Design Studio</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Instant calibrated scorecards & feedback</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Glass Role Onboarding Box */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl glass-surface border border-white/15 bg-slate-950/80 shadow-2xl relative">
              <div className="text-center space-y-1.5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 text-indigo-400 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/15 mb-3">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Launch Your Workspace</h3>
                <p className="text-xs text-slate-400">Select your primary role to configure your dashboard</p>
              </div>

              <div className="space-y-3">
                <SignUpButton mode="modal">
                  <button
                    onClick={() => assignRole("interviewer")}
                    className="w-full glass-btn-primary py-3.5 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-between cursor-pointer group shadow-lg shadow-indigo-500/25"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-indigo-200" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs sm:text-sm">Continue as Interviewer</div>
                        <div className="text-[11px] text-indigo-200/80 font-normal">
                          Host calls, Copilot, Question Bank & Rubrics
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform ml-1 shrink-0" />
                  </button>
                </SignUpButton>

                <SignUpButton mode="modal">
                  <button
                    onClick={() => assignRole("candidate")}
                    className="w-full glass-btn-secondary py-3.5 px-4 rounded-xl text-sm font-medium text-slate-200 hover:text-white border-emerald-500/25 hover:border-emerald-400/40 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <UserPlus className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs sm:text-sm">Continue as Candidate</div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          Aura Voice Mocks, System Canvas & Live Calls
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform ml-1 shrink-0" />
                  </button>
                </SignUpButton>

                <div className="relative flex items-center justify-center py-1.5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <span className="relative px-3 bg-slate-950/90 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Already have an account?
                  </span>
                </div>

                <SignInButton mode="modal">
                  <button className="w-full glass-btn-secondary py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all">
                    <LogIn className="w-4 h-4 text-indigo-400" />
                    <span>Sign In to Existing Account</span>
                  </button>
                </SignInButton>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Protected by Clerk Auth • Convex Real-Time Sync</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
