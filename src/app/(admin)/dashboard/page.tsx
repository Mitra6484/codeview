"use client"

import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Doc, Id } from "../../../../convex/_generated/dataModel"
import toast from "react-hot-toast"
import LoaderUI from "@/components/LoaderUI"
import { getCandidateInfo, groupInterviews } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { INTERVIEW_CATEGORY } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, CheckCircle2Icon, ClockIcon, CodeIcon, PlusIcon, XCircleIcon, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { InterviewComments } from "@/components/InterviewComments"
import PageTransition from "@/components/PageTransition"
import { useUserRole } from "@/hooks/useUserRole"
import { useRouter } from "next/navigation"

type Interview = Doc<"interviews">

function DashboardPage() {
  const router = useRouter();
  const { isInterviewer, isLoading } = useUserRole();
  const users = useQuery(api.users.getUsers)
  const interviews = useQuery(api.interviews.getAllInterviews)
  const updateStatus = useMutation(api.interviews.updateInterviewStatus)

  // Redirect if not an interviewer
  if (!isLoading && !isInterviewer) {
    router.push("/");
    return null;
  }

  const handleStatusUpdate = async (interviewId: Id<"interviews">, status: "scheduled" | "live" | "completed" | "succeeded" | "failed") => {
    try {
      await updateStatus({ id: interviewId, status })
      toast.success(`Interview marked as ${status}`)
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  if (isLoading || !interviews || !users) return <LoaderUI />

  const groupedInterviews = groupInterviews(interviews) as Record<string, Interview[]>
  const hasInterviews = Object.values(groupedInterviews).some(category => category.length > 0)

  return (
    <PageTransition>
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-mono text-indigo-400 mb-2 border border-indigo-500/20">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Interviewer Management Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Interviews & Evaluations</h1>
            <p className="text-sm text-slate-400 mt-1">Review live cohorts, manage questions, and inspect AI executive scorecards</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/questions">
              <button className="glass-btn-secondary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer border border-white/10">
                <CodeIcon className="h-4 w-4 text-indigo-300" />
                <span>Question Bank</span>
              </button>
            </Link>
            <Link href="/schedule">
              <button className="glass-btn-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25">
                <PlusIcon className="h-4 w-4" />
                <span>Schedule Session</span>
              </button>
            </Link>
          </div>
        </div>

        {!hasInterviews ? (
          <div className="glass-card rounded-3xl border border-white/10 p-12 text-center">
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl glass-surface border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.2)]">
                <CalendarDays className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">No Interviews Scheduled</h2>
                <p className="text-sm text-slate-400">
                  Get started by scheduling an interview session with a candidate or synthesizing challenges with AI.
                </p>
              </div>
              <Link href="/schedule">
                <button className="glass-btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25 mt-2">
                  <PlusIcon className="h-4 w-4" />
                  <span>Schedule Interview</span>
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {INTERVIEW_CATEGORY.map(
              (category) =>
                groupedInterviews[category.id]?.length > 0 && (
                  <section key={category.id} className="space-y-4">
                    {/* CATEGORY TITLE */}
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-white tracking-tight">{category.title}</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-white/10 text-slate-300 border border-white/15">
                        {groupedInterviews[category.id].length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {groupedInterviews[category.id].map((interview: Interview) => {
                        const candidateInfo = getCandidateInfo(users, interview.candidateId)
                        const startTime = new Date(interview.startTime)

                        return (
                          <div
                            key={interview._id}
                            className="glass-card rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-xl overflow-hidden flex flex-col justify-between"
                          >
                            {/* CANDIDATE INFO */}
                            <div className="p-5 pb-3">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 border border-white/15">
                                    <AvatarImage src={candidateInfo.image || "/placeholder.svg"} />
                                    <AvatarFallback className="bg-indigo-900/50 text-indigo-300 text-xs font-bold">
                                      {candidateInfo.initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-sm font-bold text-white">{candidateInfo.name}</h3>
                                    <p className="text-xs text-slate-400 line-clamp-1">{interview.title}</p>
                                  </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                                  interview.status === "completed"
                                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                    : interview.status === "live"
                                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 animate-pulse"
                                    : "bg-slate-500/15 text-slate-300 border-white/10"
                                }`}>
                                  {interview.status}
                                </span>
                              </div>

                              {/* DATE & TIME */}
                              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 py-1">
                                <div className="flex items-center gap-1.5">
                                  <CalendarIcon className="h-3.5 w-3.5 text-indigo-400" />
                                  {format(startTime, "MMM dd, yyyy")}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <ClockIcon className="h-3.5 w-3.5 text-indigo-400" />
                                  {format(startTime, "hh:mm a")}
                                </div>
                              </div>
                            </div>

                            {/* SCORECARD LINK & ACTIONS */}
                            <div className="px-5 py-2.5 bg-white/[0.02] border-t border-b border-white/5 flex items-center justify-between">
                              <Link
                                href={`/interviews/${interview._id}`}
                                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
                              >
                                <span>Inspect Session & AI Scorecard</span>
                                <span>→</span>
                              </Link>
                            </div>

                            {/* COMMENTS & VOTING */}
                            <div className="p-4 pt-3">
                              <InterviewComments interviewId={interview._id} status={interview.status} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                ),
            )}
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default DashboardPage

