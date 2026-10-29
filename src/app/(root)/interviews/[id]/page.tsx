"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InterviewComments } from "@/components/InterviewComments";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import LoaderUI from "@/components/LoaderUI";
import { ArrowLeft, Calendar, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import { generateExecutiveScorecard } from "@/actions/ai/generate-scorecard";
import type { ExecutiveScorecardResponse } from "@/actions/ai/generate-scorecard";
import ExecutiveScorecardView from "@/components/evaluation/ExecutiveScorecardView";

export default function InterviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const interview = useQuery(api.interviews.getInterview, { id: params.id as Id<"interviews"> });
  const comments = useQuery(api.comments.getComments, { interviewId: params.id as Id<"interviews"> });

  const [scorecard, setScorecard] = useState<ExecutiveScorecardResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!interview) {
    return <LoaderUI />;
  }

  const handleGenerateScorecard = async () => {
    setIsGenerating(true);
    try {
      const res = await generateExecutiveScorecard({
        interviewTitle: interview.title,
        candidateName: "Candidate",
        comments: comments?.map((c) => ({
          author: c.userId,
          content: c.content,
          rating: c.rating,
        })),
        codeSnippet: "// Completed technical session code",
        language: "python",
      });
      setScorecard(res);
    } catch (err) {
      console.error("Scorecard generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8 glass-canvas min-h-screen">
      {/* TOP NAVIGATION */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard")}
          className="glass-btn-secondary px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={handleGenerateScorecard}
          disabled={isGenerating}
          className="glass-btn-primary px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
          <span>{isGenerating ? "Synthesizing Evaluation..." : "Generate AI Executive Scorecard"}</span>
        </button>
      </div>

      {/* SESSION OVERVIEW GLASS CARD */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
                Session Record
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  interview.status === "completed"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                }`}
              >
                {interview.status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{interview.title}</h1>
            {interview.description && (
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">{interview.description}</p>
            )}
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{new Date(interview.startTime).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{new Date(interview.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE SCORECARD (IF GENERATED) */}
      {scorecard && (
        <ExecutiveScorecardView
          scorecard={scorecard}
          interviewTitle={interview.title}
          candidateName="Candidate"
        />
      )}

      {/* COMMENTS & INTERVIEWER RUBRIC NOTES */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Interviewer Notes & Team Voting</h2>
        <InterviewComments interviewId={interview._id} status={interview.status} />
      </div>
    </div>
  );
}