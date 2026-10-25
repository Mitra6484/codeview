"use client";

import LoaderUI from "@/components/LoaderUI";
import RecordingCard from "@/components/RecordingCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetCalls from "@/hooks/useGetCalls";
import { CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

function RecordingsPage() {
  const { calls, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [isFetchingRecordings, setIsFetchingRecordings] = useState(false);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!calls) return;

      try {
        setIsFetchingRecordings(true);
        // Get recordings for each call
        const callData = await Promise.all(calls.map((call) => call.queryRecordings()));
        const allRecordings = callData.flatMap((call) => call.recordings);

        setRecordings(allRecordings);
      } catch (error) {
        console.log("Error fetching recordings:", error);
      } finally {
        setIsFetchingRecordings(false);
      }
    };

    fetchRecordings();
  }, [calls]);

  if (isLoading || isFetchingRecordings) return <LoaderUI />;

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4">
      {/* HEADER SECTION */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-mono text-indigo-400 mb-2 border border-indigo-500/20">
            <span>Archive & Review</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Call Recordings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review previous technical interviews and playback recordings
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl glass-surface border border-white/10 text-xs font-mono text-slate-300">
          <span className="font-bold text-indigo-400 mr-1.5">{recordings.length}</span>
          <span>{recordings.length === 1 ? "Session Recorded" : "Sessions Recorded"}</span>
        </div>
      </div>

      {/* RECORDINGS GRID */}
      <ScrollArea className="h-[calc(100vh-14rem)]">
        {recordings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            {recordings.map((r) => (
              <RecordingCard key={r.end_time} recording={r} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl border border-white/10 p-12 flex flex-col items-center justify-center text-center gap-3">
            <p className="text-lg font-bold text-white">No recordings available</p>
            <p className="text-xs text-slate-400 max-w-sm">
              Completed sessions with active cloud recording enabled will appear here automatically.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
export default RecordingsPage;