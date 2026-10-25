"use client";

import { useState } from "react";
import {
  Sparkles,
  Shield,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  RotateCw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Zap,
  Flame,
  Award,
} from "lucide-react";
import { CopilotResponse } from "@/actions/ai/interviewer-copilot";

interface InterviewerCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  copilotData: CopilotResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function InterviewerCopilotDrawer({
  isOpen,
  onClose,
  copilotData,
  isLoading,
  onRefresh,
}: InterviewerCopilotDrawerProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activeHintLevel, setActiveHintLevel] = useState<1 | 2 | 3>(1);
  const [activeSection, setActiveSection] = useState<"questions" | "hints" | "bugs">("questions");

  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="absolute right-0 top-0 bottom-16 w-full sm:w-[420px] glass-nav border-l border-white/10 z-40 flex flex-col shadow-2xl backdrop-blur-2xl bg-slate-950/85">
      {/* DRAWER HEADER */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white">AI Co-Pilot</h3>
              <span className="glass-pill px-2 py-0.5 rounded-full text-[9px] font-semibold text-emerald-300 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" />
                <span>Interviewer Only</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Real-time candidate intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg glass-btn-secondary text-slate-400 hover:text-white cursor-pointer transition-colors disabled:opacity-50"
            title="Refresh Analysis"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* COMPLEXITY & QUALITY METRIC BAR */}
      <div className="p-3 border-b border-white/5 bg-slate-950/50">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[9px] text-slate-400 block font-sans">Time Complexity</span>
            <span className="font-mono font-bold text-indigo-300 text-xs truncate">
              {copilotData?.detectedComplexity.time || "O(N)"}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[9px] text-slate-400 block font-sans">Space Complexity</span>
            <span className="font-mono font-bold text-violet-300 text-xs truncate">
              {copilotData?.detectedComplexity.space || "O(1)"}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[9px] text-slate-400 block font-sans">Hygiene Score</span>
            <span className="font-mono font-bold text-emerald-400 text-xs">
              {copilotData?.codeQualityScore ? `${copilotData.codeQualityScore}/100` : "88/100"}
            </span>
          </div>
        </div>

        {copilotData?.detectedComplexity.note && (
          <p className="text-[11px] text-slate-400 mt-2 px-1 italic">
            "{copilotData.detectedComplexity.note}"
          </p>
        )}
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-white/10 bg-slate-900/30 text-xs font-medium">
        <button
          onClick={() => setActiveSection("questions")}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeSection === "questions"
              ? "text-indigo-300 border-b-2 border-indigo-400 bg-white/5 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Follow-Ups</span>
        </button>

        <button
          onClick={() => setActiveSection("hints")}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeSection === "hints"
              ? "text-indigo-300 border-b-2 border-indigo-400 bg-white/5 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Tiered Hints</span>
        </button>

        <button
          onClick={() => setActiveSection("bugs")}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeSection === "bugs"
              ? "text-indigo-300 border-b-2 border-indigo-400 bg-white/5 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Bugs & Edge</span>
        </button>
      </div>

      {/* DRAWER CONTENT */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
        {/* SECTION 1: SMART FOLLOW-UP QUESTIONS */}
        {activeSection === "questions" && (
          <div className="space-y-2.5">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Contextual questions tailored to the candidate's current code implementation:
            </p>

            {copilotData?.followUpQuestions?.map((fq, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl glass-card border border-white/10 hover:border-indigo-500/30 transition-all space-y-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20">
                    {fq.category}
                  </span>
                  <button
                    onClick={() => handleCopy(fq.question, idx)}
                    className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                    title="Copy Question"
                  >
                    {copiedIdx === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <p className="font-semibold text-white text-xs leading-snug">
                  "{fq.question}"
                </p>

                <p className="text-[10px] text-slate-400 bg-black/20 p-2 rounded-lg">
                  <span className="text-indigo-400 font-medium">Why ask:</span> {fq.whyAsk}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 2: PROGRESSIVE TIERED HINTS */}
        {activeSection === "hints" && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-400">
              Deliver hints progressively if the candidate gets blocked:
            </p>

            {/* Hint Level Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5">
              <button
                onClick={() => setActiveHintLevel(1)}
                className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeHintLevel === 1
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Level 1: Nudge
              </button>
              <button
                onClick={() => setActiveHintLevel(2)}
                className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeHintLevel === 2
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Level 2: Structure
              </button>
              <button
                onClick={() => setActiveHintLevel(3)}
                className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeHintLevel === 3
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Level 3: Vector
              </button>
            </div>

            {/* Hint Content Card */}
            <div className="p-4 rounded-xl glass-card border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-950/60 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>
                  {activeHintLevel === 1
                    ? "Gentle Socratic Nudge (Reveals minimal info)"
                    : activeHintLevel === 2
                    ? "Structural Clue (Points toward optimal data structure)"
                    : "Algorithmic Vector (Outlines the full algorithmic concept)"}
                </span>
              </div>

              <p className="text-white text-xs leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5 font-mono">
                {activeHintLevel === 1 &&
                  (copilotData?.tieredHints?.level1_nudge ||
                    "Ask the candidate to trace what happens on duplicate elements.")}
                {activeHintLevel === 2 &&
                  (copilotData?.tieredHints?.level2_structural ||
                    "Suggest checking if a hash map could avoid the second inner loop.")}
                {activeHintLevel === 3 &&
                  (copilotData?.tieredHints?.level3_algorithmic ||
                    "Use a hash map to store each number and its index during a single pass.")}
              </p>

              <button
                onClick={() => {
                  const text =
                    activeHintLevel === 1
                      ? copilotData?.tieredHints?.level1_nudge
                      : activeHintLevel === 2
                      ? copilotData?.tieredHints?.level2_structural
                      : copilotData?.tieredHints?.level3_algorithmic;
                  if (text) handleCopy(text, 999);
                }}
                className="w-full glass-btn-secondary py-1.5 rounded-lg text-[11px] font-medium text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedIdx === 999 ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Hint</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Verbal Hint</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* SECTION 3: BUGS & EDGE CASES */}
        {activeSection === "bugs" && (
          <div className="space-y-2.5">
            <p className="text-[11px] text-slate-400">
              Potential oversights or boundary vulnerabilities detected in current code:
            </p>

            {copilotData?.potentialBugs?.map((bug, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-200 space-y-1"
              >
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Boundary Check #{i + 1}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{bug}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER: MODEL INDICATOR */}
      <div className="p-2.5 border-t border-white/5 text-center text-[10px] text-slate-500 bg-slate-950">
        AI Co-Pilot running on: <span className="font-mono text-indigo-400">{copilotData?.modelUsed || "OpenRouter Free"}</span>
      </div>
    </div>
  );
}
