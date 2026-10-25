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
import { Loader2Icon, Sparkles } from "lucide-react";
import MeetingCard from "@/components/MeetingCard";
import { useUser } from "@clerk/nextjs";
import LandingPage from "@/components/landing/LandingPage";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded: isUserLoaded, user } = useUser();
  const { isInterviewer, isCandidate, isLoading: isRoleLoading } = useUserRole();
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

  // If auth is loading, show loader
  if (!isUserLoaded) return <LoaderUI />;

  // If user is not authenticated, render the Glassmorphic Landing & Login Page!
  if (!isSignedIn) return <LandingPage />;

  // If user is authenticated, wait for role resolution
  if (isRoleLoading) return <LoaderUI />;

  return (
    <div className="container max-w-7xl mx-auto py-8">
      {/* GLASS WELCOME BANNER */}
      <div className="rounded-3xl glass-card p-8 border border-white/10 mb-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-2">
          <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Workspace Active</span>
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
          Welcome back, {user?.firstName || "Engineer"}!
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl">
          {isInterviewer
            ? "Manage your live technical interviews, schedule new sessions, and evaluate candidate submissions."
            : "Review your scheduled interviews, access the live coding room, and prepare for upcoming evaluations."}
        </p>
      </div>

      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
      ) : (
        <>
          <div className="mb-8 p-6 glass-card rounded-2xl border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">AI Practice Studio</span>
              <h3 className="text-lg font-bold text-white mt-1">Practice with Alex (AI Voice Interviewer)</h3>
              <p className="text-xs text-slate-400">Warm-up with real-time conversational coding before your official rounds.</p>
            </div>
            <button
              onClick={() => router.push("/mock-interview")}
              className="glass-btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-lg shadow-indigo-500/25"
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>Start Voice Practice</span>
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Your Scheduled Interviews</h2>
            <p className="text-slate-400 text-sm mt-1">View and launch your upcoming technical rounds</p>
          </div>

          <div className="mt-6">
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
              <div className="text-center py-16 glass-surface rounded-2xl border border-white/10 text-slate-400">
                You have no scheduled interviews at the moment.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}