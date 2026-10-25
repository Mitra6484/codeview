import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Play } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

type Interview = Doc<"interviews">;

interface MeetingCardProps {
  interview: Interview;
  onEdit?: (interview: Interview) => void;
}

function MeetingCard({ interview, onEdit }: MeetingCardProps) {
  const { joinMeeting } = useMeetingActions();
  const { userId } = useAuth();

  const status = getMeetingStatus(interview);
  const formattedDate = format(new Date(interview.startTime), "EEEE, MMMM d · h:mm a");

  return (
    <div className="glass-card rounded-2xl p-6 h-full flex flex-col justify-between border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-indigo-400" />
            <span>{formattedDate}</span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              status === "live"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse"
                : status === "scheduled"
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                : "bg-white/5 text-slate-400 border-white/10"
            }`}
          >
            {status === "live" ? "● Live Now" : status === "scheduled" ? "Scheduled" : "Completed"}
          </span>
        </div>

        <h3 className="font-bold text-lg text-white line-clamp-2 leading-snug">
          {interview.title}
        </h3>

        {interview.description && (
          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
            {interview.description}
          </p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-white/5">
        {status === "live" && (
          <button
            className="w-full glass-btn-primary py-2.5 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            onClick={() => joinMeeting(interview.streamCallId)}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Join Meeting</span>
          </button>
        )}

        {status === "scheduled" && onEdit && (
          <button
            className="w-full glass-btn-secondary py-2 px-3 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            onClick={() => onEdit(interview)}
          >
            Edit Details
          </button>
        )}
      </div>
    </div>
  );
}

export default MeetingCard;