"use client";

import LoaderUI from "@/components/LoaderUI";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import useGetCallById from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, ArrowLeft, RefreshCw, Video } from "lucide-react";

function MeetingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoaded } = useUser();
  const { call, isCallLoading } = useGetCallById(id);

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!isLoaded || isCallLoading) return <LoaderUI />;

  if (!call) {
    return (
      <div className="min-h-screen glass-canvas flex items-center justify-center p-6 text-slate-200">
        <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center space-y-5 border border-white/15 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Interview Room Not Found</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              We couldn't connect to meeting room <code className="text-indigo-300 font-mono">{String(id)}</code>. The room may have concluded or the link may be invalid.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="glass-btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Room Connection</span>
            </button>
            <button
              onClick={() => router.push("/")}
              className="glass-btn-secondary px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
        ) : (
          <MeetingRoom />
        )}
      </StreamTheme>
    </StreamCall>
  );
}

export default MeetingPage;
