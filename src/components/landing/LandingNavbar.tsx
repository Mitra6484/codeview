"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Code2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full glass-nav px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950/80 backdrop-blur-md rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
              Codeview
            </span>
            <span className="text-[10px] font-medium tracking-wider uppercase text-indigo-400/90 -mt-1">
              AI Interview Platform
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#features"
            className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            Features
          </a>
          <a
            href="#ide-preview"
            className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            Live Workspace
          </a>
          <a
            href="#workflow"
            className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            Workflow
          </a>
          <a
            href="#auth-section"
            className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            Get Started
          </a>
        </nav>

        {/* Action Controls & Clerk Auth */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          <SignInButton mode="modal">
            <button className="glass-btn-secondary px-4 py-2 rounded-xl text-sm font-medium text-slate-200 hover:text-white cursor-pointer">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="glass-btn-primary px-4 py-2 rounded-xl text-sm font-medium text-white flex items-center gap-1.5 cursor-pointer">
              <span>Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </SignUpButton>
        </div>
      </div>
    </header>
  );
}
