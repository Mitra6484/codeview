"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Loader2,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  ShieldCheck,
  Code2,
} from "lucide-react";
import {
  generateExecutiveScorecard,
  ExecutiveScorecardResponse,
} from "@/actions/ai/generate-scorecard";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import toast from "react-hot-toast";

interface InterviewerScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewId?: Id<"interviews">;
  interviewTitle: string;
  candidateName: string;
  codeSnippet: string;
  language: string;
  interviewerNotes: string;
  rubricScores: {
    algorithmicRigor: number;
    codeHygiene: number;
    verbalCommunication: number;
    systemDesign: number;
  };
  onCompleteMeeting: () => Promise<void>;
}

export default function InterviewerScorecardModal({
  isOpen,
  onClose,
  interviewId,
  interviewTitle,
  candidateName,
  codeSnippet,
  language,
  interviewerNotes,
  rubricScores,
  onCompleteMeeting,
}: InterviewerScorecardModalProps) {
  const { user } = useUser();
  const addComment = useMutation(api.comments.addComment);
  const addVote = useMutation(api.votes.addVote);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [scorecard, setScorecard] = useState<ExecutiveScorecardResponse | null>(null);

  const handleGenerateScorecard = async () => {
    setIsLoading(true);
    try {
      const comments = [
        { author: "Interviewer", content: `Algorithmic Rigor: ${rubricScores.algorithmicRigor}/5` },
        { author: "Interviewer", content: `Code Hygiene: ${rubricScores.codeHygiene}/5` },
        { author: "Interviewer", content: `Verbal Communication: ${rubricScores.verbalCommunication}/5` },
        { author: "Interviewer", content: `System Design: ${rubricScores.systemDesign}/5` },
      ];

      const res = await generateExecutiveScorecard({
        interviewTitle: interviewTitle || "Technical Engineering Interview",
        candidateName: candidateName || "Candidate",
        interviewerNotes: interviewerNotes || "Candidate walked through their code implementation.",
        comments,
        codeSnippet: codeSnippet || "// No code submitted",
        language: language || "python",
      });

      setScorecard(res);
      toast.success("Veritas Scorecard generated!");
    } catch (e) {
      console.error("Failed to generate scorecard", e);
      toast.error("Failed to synthesize scorecard. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      if (interviewId && scorecard) {
        // Persist structured Veritas scorecard as an official interview evaluation comment
        const summaryText = `### Veritas AI Hiring Scorecard
**Verdict:** ${scorecard.verdict} (${scorecard.overallScore}/100)
**Rationale:** ${scorecard.verdictRationale}

**Key Strengths:**
${scorecard.keyStrengths?.map((s) => `• ${s}`).join("\n")}

**Growth Areas:**
${scorecard.growthAreas?.map((g) => `• ${g}`).join("\n")}

**Candidate Feedback Letter:**
${scorecard.candidateFeedbackLetter || "N/A"}`;

        try {
          await addComment({
            interviewId,
            content: summaryText,
            userId: user?.id || "interviewer",
            rating: Math.max(1, Math.min(5, Math.round(scorecard.overallScore / 20))),
          });

          const voteVerdict =
            scorecard.verdict === "Strong Hire" || scorecard.verdict === "Hire"
              ? "pass"
              : "fail";

          await addVote({
            interviewId,
            userId: user?.id || "interviewer",
            vote: voteVerdict,
          });
        } catch (dbErr) {
          console.warn("Could not save to comments/votes table, continuing:", dbErr);
        }

        // Cache locally for offline preview & immediate review
        try {
          localStorage.setItem(
            `codeview_scorecard_${interviewId}`,
            JSON.stringify({ scorecard, timestamp: Date.now() })
          );
        } catch (storageErr) {
          console.warn("LocalStorage caching skipped:", storageErr);
        }
      }

      await onCompleteMeeting();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Failed to conclude meeting");
    } finally {
      setIsFinishing(false);
    }
  };

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case "Strong Hire":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20";
      case "Hire":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/20";
      case "Lean Hire":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/20";
      default:
        return "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/20";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto glass-modal text-slate-100 p-6">
        <DialogHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                Executive Interview Scorecard
                <span className="glass-pill px-2 py-0.5 rounded-full text-[10px] font-semibold text-indigo-300">
                  Veritas AI
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Calibrated evaluation for {candidateName || "Candidate"} • {interviewTitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!scorecard ? (
          <div className="space-y-6 py-4">
            {/* Context Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 block">Algorithmic Rigor</span>
                <span className="text-base font-bold text-indigo-300 font-mono">
                  {rubricScores.algorithmicRigor} / 5
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 block">Code Hygiene</span>
                <span className="text-base font-bold text-violet-300 font-mono">
                  {rubricScores.codeHygiene} / 5
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 block">Communication</span>
                <span className="text-base font-bold text-emerald-300 font-mono">
                  {rubricScores.verbalCommunication} / 5
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 block">System Design</span>
                <span className="text-base font-bold text-sky-300 font-mono">
                  {rubricScores.systemDesign} / 5
                </span>
              </div>
            </div>

            {/* Interviewer Notes Preview */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Interviewer Scratchpad Notes</span>
              </div>
              <p className="text-xs text-slate-400 whitespace-pre-wrap font-mono leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5 max-h-36 overflow-y-auto">
                {interviewerNotes || "No private notes taken during this session."}
              </p>
            </div>

            {/* Generate Trigger */}
            <div className="p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-950/80 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-white">Synthesize Executive Hiring Decision</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Veritas analyzes the live code snippet, syntax correctness, and your live rubric scores to produce an objective calibration report.
                </p>
              </div>

              <Button
                onClick={handleGenerateScorecard}
                disabled={isLoading}
                className="glass-btn-primary px-6 py-2.5 rounded-xl cursor-pointer text-xs font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Synthesizing Verdict...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Veritas Scorecard
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-4">
            {/* Scorecard Hero Banner */}
            <div className="p-5 rounded-2xl glass-card border border-white/10 bg-gradient-to-r from-slate-900 to-indigo-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Hiring Committee Verdict</span>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-lg ${getVerdictStyle(scorecard.verdict)}`}>
                    {scorecard.verdict}
                  </span>
                  <span className="text-2xl font-black font-mono text-white">
                    {scorecard.overallScore}<span className="text-xs text-slate-400 font-normal">/100</span>
                  </span>
                </div>
                <p className="text-xs text-slate-300 italic pt-1 max-w-lg">
                  "{scorecard.verdictRationale}"
                </p>
              </div>
            </div>

            {/* 5 Evaluated Dimensions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                Dimension Breakdown
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(scorecard.dimensions).map(([key, dim]) => (
                  <div key={key} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 capitalize">
                        {dim.name || key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="font-mono font-bold text-indigo-300">{dim.score}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, dim.score))}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {dim.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Growth Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Strengths</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {scorecard.keyStrengths?.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Growth Areas</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {scorecard.growthAreas?.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Candidate Letter Draft */}
            {scorecard.candidateFeedbackLetter && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Candidate Feedback Letter</span>
                </div>
                <p className="text-[11px] text-slate-400 whitespace-pre-wrap leading-relaxed font-sans bg-black/20 p-3 rounded-lg border border-white/5 max-h-32 overflow-y-auto">
                  {scorecard.candidateFeedbackLetter}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            {scorecard && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateScorecard}
                disabled={isLoading}
                className="glass-btn-secondary text-xs"
              >
                Regenerate
              </Button>
            )}

            <Button
              onClick={handleFinish}
              disabled={isFinishing}
              className="glass-btn-primary bg-indigo-600 px-5 text-xs font-semibold cursor-pointer"
            >
              {isFinishing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Finalizing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Conclude Interview & Save
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
