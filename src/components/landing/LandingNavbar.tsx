"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Code2, Sparkles, ShieldCheck, User } from "lucide-react";
import Link from "next/link";

export default function LandingNavbar() {
  return (
    <div className="sticky top-3 z-50 px-3 sm:px-6 max-w-6xl mx-auto my-2 w-full transition-all">
      <header className="glass-nav rounded-2xl border border-white/10 shadow-2xl backdrop-blur-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-slate-950/85 backdrop-blur-md rounded-[10px] flex items-center justify-center">
              <Code2 className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
              Codeview
            </span>
            <span className="text-[9px] font-medium tracking-wider uppercase text-indigo-400/80 -mt-1">
              Technical Interview Platform
            </span>
          </div>
        </Link>

        {/* Navigation Anchors */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <a
            href="#ide-preview"
            className="hover:text-white transition-colors"
          >
            Live Workspace
          </a>
          <a
            href="#features"
            className="hover:text-white transition-colors"
          >
            Platform Capabilities
          </a>
          <a
            href="#auth-section"
            className="hover:text-white transition-colors"
          >
            Get Started
          </a>
        </nav>

        {/* Authentication Actions */}
        <div className="flex items-center gap-2">
          <SignInButton mode="modal">
            <button className="glass-btn-secondary px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white cursor-pointer">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("codeview_signup_role", "candidate");
                  localStorage.setItem("codeview_test_role", "candidate");
                  window.dispatchEvent(new Event("codeview_role_changed"));
                }
              }}
              className="glass-btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer hidden sm:flex border-emerald-500/20"
            >
              <User className="w-3 h-3 text-emerald-400" />
              <span>Candidate</span>
            </button>
          </SignUpButton>

          <SignUpButton mode="modal">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("codeview_signup_role", "interviewer");
                  localStorage.setItem("codeview_test_role", "interviewer");
                  window.dispatchEvent(new Event("codeview_role_changed"));
                }
              }}
              className="glass-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
              <span>Interviewer</span>
            </button>
          </SignUpButton>
        </div>
      </header>
    </div>
  );
}
