"use client";

import { useState } from "react";
import {
  Award,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Copy,
  Check,
  FileText,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Mail,
} from "lucide-react";
import { ExecutiveScorecardResponse } from "@/actions/ai/generate-scorecard";

interface ExecutiveScorecardViewProps {
  scorecard: ExecutiveScorecardResponse;
  interviewTitle: string;
  candidateName: string;
}

export default function ExecutiveScorecardView({
  scorecard,
  interviewTitle,
  candidateName,
}: ExecutiveScorecardViewProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"scorecard" | "feedback">("scorecard");

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(scorecard.candidateFeedbackLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verdictColor =
    scorecard.verdict === "Strong Hire"
      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-emerald-500/20"
      : scorecard.verdict === "Hire"
      ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400 shadow-indigo-500/20"
      : scorecard.verdict === "Lean Hire"
      ? "bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-amber-500/20"
      : "bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-rose-500/20";

  const dimensionList = Object.values(scorecard.dimensions);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hiring Committee Memo</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Candidate: {candidateName}</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{interviewTitle}</h2>
          <p className="text-xs text-slate-400 mt-1">Multi-dimensional evaluation report backed by AI assessment</p>
        </div>

        {/* VERDICT BADGE */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 shadow-xl ${verdictColor}`}>
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider block opacity-80">Committee Verdict</span>
            <span className="text-xl font-extrabold tracking-tight block">{scorecard.verdict}</span>
          </div>
          <div className="h-8 w-px bg-current opacity-30" />
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider block opacity-80">Score</span>
            <span className="text-xl font-bold font-mono block">{scorecard.overallScore}/100</span>
          </div>
        </div>
      </div>

      {/* VERDICT SUMMARY */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 leading-relaxed font-sans">
        <span className="text-indigo-400 font-bold block mb-1">Executive Summary:</span>
        {scorecard.verdictRationale}
      </div>

      {/* VIEW SWITCHER */}
      <div className="flex border-b border-white/10 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("scorecard")}
          className={`pb-2.5 px-4 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === "scorecard"
              ? "text-white border-b-2 border-indigo-400"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Evaluation Dimensions</span>
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`pb-2.5 px-4 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === "feedback"
              ? "text-white border-b-2 border-indigo-400"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Candidate Feedback Letter</span>
        </button>
      </div>

      {/* TAB 1: EVALUATION DIMENSIONS & STRENGTHS */}
      {activeTab === "scorecard" && (
        <div className="space-y-6">
          {/* 5 DIMENSIONS PROGRESS BARS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dimensionList.map((dim, idx) => (
              <div key={idx} className="p-4 rounded-2xl glass-surface border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white">{dim.name}</span>
                  <span className="font-mono text-indigo-400">{dim.score}/100</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${dim.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">{dim.feedback}</p>
              </div>
            ))}
          </div>

          {/* TWO COLUMN: STRENGTHS VS GROWTH */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Demonstrated Strengths</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {scorecard.keyStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth Areas */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Areas for Development</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {scorecard.growthAreas.map((ga, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{ga}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATE FEEDBACK LETTER */}
      {activeTab === "feedback" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Constructive, encouraging feedback ready to be shared with the candidate:
            </p>
            <button
              onClick={handleCopyLetter}
              className="glass-btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Letter</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Letter</span>
                </>
              )}
            </button>
          </div>

          <div className="p-5 rounded-2xl glass-surface border border-white/10 bg-slate-950/80 font-mono text-xs text-slate-200 whitespace-pre-line leading-relaxed shadow-inner">
            {scorecard.candidateFeedbackLetter}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Verified by Codeview Hiring Review Board
        </span>
        <span className="font-mono text-indigo-400">Model: {scorecard.modelUsed || "DeepSeek-R1 Free"}</span>
      </div>
    </div>
  );
}
