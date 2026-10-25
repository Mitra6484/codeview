"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Workflow } from "lucide-react";
import SystemDesignCanvas from "@/components/architecture/SystemDesignCanvas";

export default function SystemDesignPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen glass-canvas flex flex-col">
      {/* HEADER */}
      <header className="glass-nav px-4 sm:px-6 py-3 flex items-center justify-between border-b border-white/10 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="glass-btn-secondary px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">System Design Architecture Studio</h1>
              <p className="text-[10px] text-slate-400">Distributed systems modeling & AI traffic stress testing</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>AI Architecture Critic Active</span>
          </span>
        </div>
      </header>

      {/* CANVAS WORKSPACE */}
      <div className="flex-1 flex flex-col h-[calc(100vh-57px)]">
        <SystemDesignCanvas />
      </div>
    </div>
  );
}
