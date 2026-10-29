"use client";

import { useState, useEffect } from "react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Code2,
  Sparkles,
  ShieldCheck,
  User,
  Menu,
  X,
  ArrowRight,
  Mic,
  Workflow,
  Award,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const assignRole = (role: "interviewer" | "candidate") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("codeview_signup_role", role);
      localStorage.setItem("codeview_test_role", role);
      window.dispatchEvent(new Event("codeview_role_changed"));
    }
  };

  return (
    <div className="sticky top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto my-2 w-full transition-all duration-300">
      <header
        className={`glass-nav rounded-2xl border transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between ${
          scrolled
            ? "border-white/15 bg-slate-950/85 shadow-[0_16px_50px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
            : "border-white/10 bg-slate-950/60 shadow-2xl backdrop-blur-xl"
        }`}
      >
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/50 transition-all">
            <div className="w-full h-full bg-slate-950/90 backdrop-blur-md rounded-[10px] flex items-center justify-center">
              <Code2 className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                CodeView
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-400/25 text-[9px] font-mono font-semibold text-indigo-300">
                v2.5 AI
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 -mt-0.5">
              Engineering Signal OS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-medium text-slate-300">
          <a
            href="#ide-preview"
            className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live Studio</span>
          </a>
          <a
            href="#aura-spotlight"
            className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
          >
            <Mic className="w-3.5 h-3.5 text-violet-400" />
            <span>Aura Voice AI</span>
          </a>
          <a
            href="#features"
            className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
          >
            <Workflow className="w-3.5 h-3.5 text-cyan-400" />
            <span>System Canvas</span>
          </a>
          <a
            href="#workflow"
            className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scorecards</span>
          </a>
          <a
            href="#auth-section"
            className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-all"
          >
            Get Started
          </a>
        </nav>

        {/* Right Auth Controls */}
        <div className="flex items-center gap-2">
          <SignInButton mode="modal">
            <button className="glass-btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white cursor-pointer">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button
              onClick={() => assignRole("candidate")}
              className="glass-btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 hover:text-white items-center gap-1.5 cursor-pointer hidden sm:flex border-emerald-500/25 hover:border-emerald-400/50"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Candidate</span>
            </button>
          </SignUpButton>

          <SignUpButton mode="modal">
            <button
              onClick={() => assignRole("interviewer")}
              className="glass-btn-primary px-4 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/25"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-200" />
              <span>Interviewer</span>
              <ArrowRight className="w-3 h-3 hidden md:inline" />
            </button>
          </SignUpButton>

          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl glass-btn-secondary text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden mt-2 p-4 rounded-2xl glass-modal border border-white/15 shadow-2xl space-y-3 text-xs text-slate-200"
          >
            <div className="grid grid-cols-2 gap-2">
              <a
                href="#ide-preview"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2 font-medium"
              >
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Live Studio</span>
              </a>
              <a
                href="#aura-spotlight"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2 font-medium"
              >
                <Mic className="w-4 h-4 text-violet-400" />
                <span>Aura Voice AI</span>
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2 font-medium"
              >
                <Workflow className="w-4 h-4 text-cyan-400" />
                <span>System Canvas</span>
              </a>
              <a
                href="#workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2 font-medium"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Scorecards</span>
              </a>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <SignUpButton mode="modal">
                <button
                  onClick={() => {
                    assignRole("candidate");
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 glass-btn-secondary py-2 rounded-xl text-center font-semibold text-emerald-300"
                >
                  Join as Candidate
                </button>
              </SignUpButton>
              <SignUpButton mode="modal">
                <button
                  onClick={() => {
                    assignRole("interviewer");
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 glass-btn-primary py-2 rounded-xl text-center font-semibold text-white"
                >
                  Join as Interviewer
                </button>
              </SignUpButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
