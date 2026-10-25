"use client";

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/LoaderUI";
import { Loader2Icon, Sparkles, Link2, Mic, Workflow, Calendar, ArrowRight } from "lucide-react";
import MeetingCard from "@/components/MeetingCard";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import LandingPage from "@/components/landing/LandingPage";

function DashboardView() {
  const router = useRouter();
  const { user } = useUser();
  const { isInterviewer, isCandidate, isMounted } = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterviews);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "AI Mock Interview":
        router.push("/mock-interview");
        break;
      case "System Design":
        router.push("/system-design");
        break;
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* GLASS WELCOME BANNER */}
      <div className="rounded-3xl glass-card p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Workspace Active</span>
          </span>
          {isMounted && (
            <span
              className={`glass-pill px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                isInterviewer
                  ? "text-indigo-300 bg-indigo-500/10 border border-indigo-500/30"
                  : "text-emerald-300 bg-emerald-500/10 border border-emerald-500/30"
              }`}
            >
              <span>Role: {isInterviewer ? "Interviewer" : "Candidate"}</span>
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
          Welcome back, {user?.firstName || "Engineer"}!
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
          {isMounted && isInterviewer
            ? "Manage live technical interviews, schedule new sessions with candidates, and inspect AI scorecards."
            : "Prepare for upcoming rounds with conversational voice AI, practice system design architectures, or join your live interview."}
        </p>
      </div>

      {/* ACTIONS (GUARDED WITH ISMOUNTED TO PREVENT HYDRATION MISMATCH) */}
      {!isMounted ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl glass-card animate-pulse bg-white/[0.02]" />
          ))}
        </div>
      ) : isInterviewer ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Quick Actions</h2>
              <p className="text-xs text-slate-400 mt-0.5">Launch meetings, schedule rounds, or start AI sessions</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>
        </div>
      ) : (
        /* CANDIDATE ACTIONS */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Candidate Actions</h2>
              <p className="text-xs text-slate-400 mt-0.5">Join scheduled calls or practice with autonomous AI agents</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Join Call Card */}
            <div
              onClick={() => {
                setModalType("join");
                setShowModal(true);
              }}
              className="glass-card p-6 rounded-2xl cursor-pointer border border-white/10 hover:border-emerald-400/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
                  <Link2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                    Join Live Interview
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Have a meeting link or code from your interviewer? Enter it here to enter the room.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>Enter Room</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* AI Mock Card (Aura) */}
            <div
              onClick={() => router.push("/mock-interview")}
              className="glass-card p-6 rounded-2xl cursor-pointer border border-white/10 hover:border-indigo-400/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/10">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                      AI Voice Mock (Aura)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Practice conversational algorithm explanations with live voice modulation and AST checks.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-indigo-400">
                <span>Start Practice</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* System Design Card (Atlas) */}
            <div
              onClick={() => router.push("/system-design")}
              className="glass-card p-6 rounded-2xl cursor-pointer border border-white/10 hover:border-cyan-400/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10">
                  <Workflow className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                      System Design (Atlas)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Canvas
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Design distributed architectures on the interactive SVG canvas with AI traffic stress testing.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-cyan-400">
                <span>Open Canvas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULED INTERVIEWS SECTION (FOR BOTH ROLES) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Your Scheduled Interviews</h2>
            <p className="text-xs text-slate-400 mt-0.5">View and launch your upcoming technical rounds</p>
          </div>
        </div>

        <div>
          {interviews === undefined ? (
            <div className="flex justify-center py-12">
              <Loader2Icon className="h-8 w-8 animate-spin text-indigo-400" />
            </div>
          ) : interviews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {interviews.map((interview) => (
                <MeetingCard key={interview._id} interview={interview} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-card rounded-2xl border border-white/10 text-slate-400 space-y-2">
              <Calendar className="w-8 h-8 text-slate-500 mx-auto stroke-1" />
              <p className="text-sm font-medium text-slate-300">No scheduled interviews found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {isInterviewer
                  ? "Schedule a new interview session or launch an instant call to test with a candidate."
                  : "When an interviewer schedules a session with you, it will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SHARED MEETING MODAL */}
      <MeetingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === "join" ? "Join Live Interview" : "Start Instant Call"}
        isJoinMeeting={modalType === "join"}
      />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SignedIn>
        <DashboardView />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </>
  );
}