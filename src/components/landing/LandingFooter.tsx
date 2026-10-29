"use client";

import { Code2, Sparkles, Mic, Workflow, Award, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="w-full glass-nav border-t border-white/10 py-12 px-4 sm:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-400">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">CodeView</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                All Systems Operational
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              The AI-native technical interviewing and collaborative engineering platform. Unifying low-latency WebRTC video, synchronized Monaco code execution, conversational Aura voice mock interviews, and 500k QPS system design simulation.
            </p>
          </div>

          {/* Col 2: Platform Modules */}
          <div className="space-y-2.5">
            <span className="font-mono uppercase tracking-wider text-[10px] font-bold text-slate-300 block">
              Platform Capabilities
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#ide-preview" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Collaborative Monaco IDE</span>
                </a>
              </li>
              <li>
                <a href="#aura-spotlight" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-violet-400" />
                  <span>Aura Voice Mock Studio</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Atlas System Design Canvas</span>
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Veritas Executive Scorecards</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Infrastructure */}
          <div className="space-y-2.5">
            <span className="font-mono uppercase tracking-wider text-[10px] font-bold text-slate-300 block">
              Real-Time Stack
            </span>
            <ul className="space-y-2 text-slate-400">
              <li>Convex Reactive Database</li>
              <li>GetStream WebRTC Video Mesh</li>
              <li>Piston Isolated Code Sandbox</li>
              <li>OpenRouter Multi-Model AI Router</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} CodeView Engineering Platform. All rights reserved.</span>
          <div className="flex items-center gap-4 font-mono">
            <span className="text-slate-400">VisionOS Liquid Glass UI</span>
            <span>•</span>
            <span className="text-emerald-400">Sub-25ms Sync</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
