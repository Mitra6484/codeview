"use client";

import { Code2, Heart } from "lucide-react";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="w-full glass-nav border-t border-white/10 py-10 px-4 sm:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-white">Codeview</span>
            <span className="text-slate-500 ml-2">© {new Date().getFullYear()} All rights reserved.</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#ide-preview" className="hover:text-white transition-colors">
            IDE Workspace
          </a>
          <a href="#workflow" className="hover:text-white transition-colors">
            Workflow
          </a>
          <a href="#auth-section" className="hover:text-white transition-colors">
            Sign In
          </a>
        </div>

        {/* Operational Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>All Services Operational</span>
        </div>
      </div>
    </footer>
  );
}
