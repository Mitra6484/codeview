"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { NotificationBell } from "./NotificationBell";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Code2,
  Sparkles,
  Workflow,
  Calendar,
  LayoutDashboard,
  ShieldCheck,
  User,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { isInterviewer, isCandidate, isMounted } = useUserRole();

  const isMeetingRoom = pathname.startsWith("/meeting");

  // Don't show full floating nav inside active full-screen meeting room
  if (isMeetingRoom) {
    return (
      <header className="sticky top-0 z-50 w-full glass-nav px-4 py-2 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white">Codeview</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {isMounted && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                isInterviewer
                  ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                  : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
              }`}
            >
              {isInterviewer ? "Interviewer" : "Candidate"}
            </span>
          )}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-7 h-7 ring-2 ring-white/10",
              },
            }}
          />
        </div>
      </header>
    );
  }

  return (
    <div className="sticky top-3 z-50 px-3 sm:px-6 max-w-6xl mx-auto my-2 w-full transition-all">
      <nav className="glass-nav rounded-2xl border border-white/10 shadow-2xl backdrop-blur-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* LEFT: BRAND LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-slate-950/85 backdrop-blur-md rounded-[10px] flex items-center justify-center">
              <Code2 className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
              Codeview
            </span>
            <span className="text-[9px] font-medium tracking-wider uppercase text-indigo-400/80 -mt-1">
              Workspace
            </span>
          </div>
        </Link>

        {/* MIDDLE: CONTEXTUAL NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-medium">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pathname === "/"
                ? "bg-white/15 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Home
          </Link>

          <Link
            href="/mock-interview"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              pathname === "/mock-interview"
                ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Mock (Aura)</span>
          </Link>

          <Link
            href="/system-design"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              pathname === "/system-design"
                ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-emerald-400" />
            <span>Architecture</span>
          </Link>

          {isMounted && isInterviewer && (
            <>
              <Link
                href="/schedule"
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  pathname === "/schedule"
                    ? "bg-white/15 text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule</span>
              </Link>

              <Link
                href="/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  pathname.startsWith("/dashboard")
                    ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            </>
          )}
        </div>

        {/* RIGHT: ROLE BADGE + NOTIFICATIONS + USER PROFILE */}
        <SignedIn>
          <div className="flex items-center gap-2.5">
            {/* Deterministic Role Badge (No switch option - determined at sign up) */}
            {isMounted && (
              <div
                className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border shadow-sm ${
                  isInterviewer
                    ? "bg-indigo-500/15 border-indigo-400/30 text-indigo-300"
                    : "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                }`}
              >
                {isInterviewer ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Interviewer</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Candidate</span>
                  </>
                )}
              </div>
            )}

            <NotificationBell />

            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-8 h-8 ring-2 ring-white/10 hover:ring-indigo-500/40 transition-all",
                },
              }}
            />
          </div>
        </SignedIn>
      </nav>
    </div>
  );
}