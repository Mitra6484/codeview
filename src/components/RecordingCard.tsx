import { CallRecording } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { calculateRecordingDuration } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { CalendarIcon, ClockIcon, CopyIcon, PlayIcon, Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

function RecordingCard({ recording }: { recording: CallRecording }) {
  const [isCopying, setIsCopying] = useState(false);

  const handleCopyLink = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(recording.url);
      toast.success("Recording link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link to clipboard");
    } finally {
      setIsCopying(false);
    }
  };

  const formattedStartTime = recording.start_time
    ? format(new Date(recording.start_time), "MMM d, yyyy, hh:mm a")
    : "Unknown";

  const duration =
    recording.start_time && recording.end_time
      ? calculateRecordingDuration(recording.start_time, recording.end_time)
      : "Unknown duration";

  return (
    <div className="glass-card rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between group">
      {/* CARD HEADER */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs font-mono text-slate-300 gap-2">
            <CalendarIcon className="h-3.5 w-3.5 text-indigo-400" />
            <span>{formattedStartTime}</span>
          </div>
          <div className="flex items-center text-xs font-mono text-indigo-300 gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <ClockIcon className="h-3 w-3" />
            <span>{duration}</span>
          </div>
        </div>
      </div>

      {/* CARD CONTENT - VIDEO PREVIEW */}
      <div className="px-5">
        <div
          className="w-full aspect-video rounded-xl relative overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/40 border border-white/10 flex items-center justify-center cursor-pointer group/thumb"
          onClick={() => window.open(recording.url, "_blank")}
        >
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="size-12 rounded-full glass-surface border border-white/20 flex items-center justify-center group-hover/thumb:scale-110 group-hover/thumb:bg-indigo-600 group-hover/thumb:border-indigo-400 transition-all shadow-lg text-white">
            <PlayIcon className="size-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* CARD FOOTER */}
      <div className="p-5 pt-4 flex gap-2">
        <button
          className="flex-1 glass-btn-primary py-2.5 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20"
          onClick={() => window.open(recording.url, "_blank")}
        >
          <PlayIcon className="size-3.5 fill-white" />
          <span>Play Recording</span>
        </button>
        <button
          className="glass-btn-secondary p-2.5 rounded-xl text-slate-300 hover:text-white cursor-pointer border border-white/10"
          onClick={handleCopyLink}
          disabled={isCopying}
          title="Copy Link"
        >
          {isCopying ? (
            <Loader2Icon className="size-4 animate-spin text-indigo-400" />
          ) : (
            <CopyIcon className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}
export default RecordingCard;