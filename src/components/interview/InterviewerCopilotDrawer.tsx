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
  BrainCircuit,
  FileText,
  Star,
  Award,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Send,
} from "lucide-react";
import type { CopilotResponse } from "@/actions/ai/interviewer-copilot";
import type { CodeAnalysisResult } from "@/actions/analyze-code";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface InterviewerCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  copilotData: CopilotResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
  interviewerNotes?: string;
  onNotesChange?: (notes: string) => void;
  rubricScores?: {
    algorithmicRigor: number;
    codeHygiene: number;
    verbalCommunication: number;
    systemDesign: number;
  };
  onRubricScoreChange?: (dimension: string, score: number) => void;
  plagiarismResult?: CodeAnalysisResult | null;
  hasCandidateRequestedHint?: boolean;
  onDismissHintRequest?: () => void;
  onOpenScorecardModal?: () => void;
  onSendHint?: (hint: string, level: number) => void;
}

export default function InterviewerCopilotDrawer({
  isOpen,
  onClose,
  copilotData,
  isLoading,
  onRefresh,
  interviewerNotes = "",
  onNotesChange,
  rubricScores = {
    algorithmicRigor: 3,
    codeHygiene: 3,
    verbalCommunication: 3,
    systemDesign: 3,
  },
  onRubricScoreChange,
  plagiarismResult,
  hasCandidateRequestedHint = false,
  onDismissHintRequest,
  onOpenScorecardModal,
  onSendHint,
}: InterviewerCopilotDrawerProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activeHintLevel, setActiveHintLevel] = useState<1 | 2 | 3>(1);
  const [mainTab, setMainTab] = useState<"copilot" | "rubric" | "integrity">("copilot");
  const [copilotSubTab, setCopilotSubTab] = useState<"questions" | "hints" | "bugs">("questions");

  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleScoreSelect = (dimension: string, score: number) => {
    if (onRubricScoreChange) {
      onRubricScoreChange(dimension, score);
    }
  };

  return (
    <div className="absolute right-0 top-0 bottom-16 w-full sm:w-[440px] glass-nav border-l border-white/10 z-40 flex flex-col shadow-2xl backdrop-blur-2xl bg-slate-950/90 text-slate-100">
      {/* DRAWER HEADER */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white">Interviewer Cockpit</h3>
              <span className="glass-pill px-2 py-0.5 rounded-full text-[9px] font-semibold text-emerald-300 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" />
                <span>Private</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Real-time candidate evaluation & AI guidance</p>
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

      {/* CANDIDATE HINT REQUEST ALERT BANNER */}
      {hasCandidateRequestedHint && (
        <div className="mx-3 mt-2.5 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200 animate-pulse">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium text-[11px]">Candidate requested a hint or clarification!</span>
          </div>
          <button
            onClick={onDismissHintRequest}
            className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 font-semibold cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* MAIN TOP-LEVEL TABS */}
      <div className="flex border-b border-white/10 bg-slate-900/60 text-xs font-medium">
        <button
          onClick={() => setMainTab("copilot")}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mainTab === "copilot"
              ? "text-indigo-300 border-b-2 border-indigo-400 bg-white/5 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Co-Pilot</span>
        </button>

        <button
          onClick={() => setMainTab("rubric")}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mainTab === "rubric"
              ? "text-indigo-300 border-b-2 border-indigo-400 bg-white/5 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Rubric & Notes</span>
        </button>

        <button
          onClick={() => setMainTab("integrity")}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mainTab === "integrity"
              ? "text-indigo-300 border-b-2 border-indigo-400 bg-white/5 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Integrity Radar</span>
          {plagiarismResult && (
            <span className="size-1.5 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>
      </div>

      {/* TAB 1: AI CO-PILOT GUIDANCE */}
      {mainTab === "copilot" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Complexity metric bar */}
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
          </div>

          {/* Sub-tabs: Follow-Ups, Tiered Hints, Bugs */}
          <div className="flex border-b border-white/5 bg-slate-900/30 text-[11px] font-medium px-2 py-1 gap-1">
            <button
              onClick={() => setCopilotSubTab("questions")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                copilotSubTab === "questions"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <HelpCircle className="w-3 h-3" />
              <span>Follow-Ups</span>
            </button>

            <button
              onClick={() => setCopilotSubTab("hints")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                copilotSubTab === "hints"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Lightbulb className="w-3 h-3" />
              <span>Tiered Hints</span>
            </button>

            <button
              onClick={() => setCopilotSubTab("bugs")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                copilotSubTab === "bugs"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Bugs & Edge</span>
            </button>
          </div>

          {/* Sub-tab Content */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {copilotSubTab === "questions" && (
              <div className="space-y-2.5">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tailored questions based on the candidate's active code:
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
                        className="p-1 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
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

            {copilotSubTab === "hints" && (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-400">
                  Deliver hints progressively without spoiling the solution:
                </p>

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

                <div className="p-4 rounded-xl glass-card border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-950/60 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>
                      {activeHintLevel === 1
                        ? "Gentle Socratic Nudge (Minimal info)"
                        : activeHintLevel === 2
                        ? "Structural Clue (Data structure direction)"
                        : "Algorithmic Vector (High-level paradigm)"}
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

                  {onSendHint && (
                    <button
                      onClick={() => {
                        const text =
                          activeHintLevel === 1
                            ? copilotData?.tieredHints?.level1_nudge
                            : activeHintLevel === 2
                            ? copilotData?.tieredHints?.level2_structural
                            : copilotData?.tieredHints?.level3_algorithmic;
                        if (text) {
                          onSendHint(text, activeHintLevel);
                        }
                      }}
                      className="w-full glass-btn-primary bg-indigo-600 hover:bg-indigo-500 py-1.5 rounded-lg text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Hint to Candidate Screen</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {copilotSubTab === "bugs" && (
              <div className="space-y-2.5">
                <p className="text-[11px] text-slate-400">
                  Potential oversights or boundary vulnerabilities detected in code:
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
        </div>
      )}

      {/* TAB 2: LIVE RUBRIC & SCRATCHPAD */}
      {mainTab === "rubric" && (
        <div className="flex-1 p-3.5 overflow-y-auto space-y-4 text-xs">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Live Competency Rubric
            </h4>
            <p className="text-[11px] text-slate-400">
              Rate criteria in real time. These scores directly calibrate the final hiring scorecard.
            </p>
          </div>

          {/* 4 Rubric Criteria */}
          <div className="space-y-3">
            {[
              { id: "algorithmicRigor", name: "Algorithmic Rigor", desc: "Correctness, time/space trade-offs" },
              { id: "codeHygiene", name: "Code Hygiene & Idioms", desc: "Readability, clean naming, modularity" },
              { id: "verbalCommunication", name: "Verbal Communication", desc: "Articulating thought process clearly" },
              { id: "systemDesign", name: "System Architecture", desc: "Topology, failure handling, scalability" },
            ].map((criterion) => {
              const currentScore = rubricScores[criterion.id as keyof typeof rubricScores] || 3;
              return (
                <div key={criterion.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200 block text-xs">{criterion.name}</span>
                      <span className="text-[10px] text-slate-400">{criterion.desc}</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-300 text-xs">
                      {currentScore} / 5
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleScoreSelect(criterion.id, val)}
                        className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentScore === val
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-400/40"
                            : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Private Scratchpad */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Private Interviewer Notes
              </span>
              <span className="text-[10px] text-slate-500">Auto-saved</span>
            </div>

            <Textarea
              placeholder="Record candidate observations, edge cases probed, or notable quotes here... (Candidate cannot see this)"
              className="min-h-[110px] text-xs font-sans bg-black/40 border-white/10 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500/50"
              value={interviewerNotes}
              onChange={(e) => onNotesChange?.(e.target.value)}
            />
          </div>

          {/* CTA to synthesize scorecard */}
          {onOpenScorecardModal && (
            <Button
              onClick={onOpenScorecardModal}
              className="w-full glass-btn-primary bg-indigo-600 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Evaluate & Finalize Scorecard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      )}

      {/* TAB 3: INTEGRITY RADAR */}
      {mainTab === "integrity" && (
        <div className="flex-1 p-3.5 overflow-y-auto space-y-4 text-xs">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Code Integrity Radar
            </h4>
            <p className="text-[11px] text-slate-400">
              Live telemetry tracking syntax anomalies, paste behavior, and AI plagiarism flags.
            </p>
          </div>

          {plagiarismResult ? (
            <div className="p-4 rounded-xl border border-white/10 glass-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  Latest Submission Scan
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    plagiarismResult.isPlagiarized
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {plagiarismResult.isPlagiarized ? "Flagged Pattern" : "Original Logic"}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Confidence Rating:</span>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      plagiarismResult.confidence > 70 ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${plagiarismResult.confidence}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                  {plagiarismResult.confidence}% match confidence
                </span>
              </div>

              <div className="text-[11px] text-slate-300 bg-black/30 p-3 rounded-lg border border-white/5 space-y-1">
                <span className="font-semibold text-slate-200 block">Analysis Reasoning:</span>
                <p className="leading-relaxed">{plagiarismResult.reasoning}</p>
              </div>

              {plagiarismResult.suggestions && (
                <div className="text-[11px] text-slate-300 bg-indigo-950/30 p-3 rounded-lg border border-indigo-500/20 space-y-1">
                  <span className="font-semibold text-indigo-300 block">Investigative Prompt:</span>
                  <p className="leading-relaxed">{plagiarismResult.suggestions}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <h5 className="font-bold text-white text-xs">No Integrity Violations</h5>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Candidate code has not triggered any plagiarism, external snippet pastes, or syntax anomaly thresholds.
              </p>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <div className="p-2.5 border-t border-white/5 text-center text-[10px] text-slate-500 bg-slate-950">
        AI Co-Pilot running on: <span className="font-mono text-indigo-400">{copilotData?.modelUsed || "OpenRouter Free"}</span>
      </div>
    </div>
  );
}
