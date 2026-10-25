import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Video, Link2, Sparkles, ArrowRight } from "lucide-react";
import useMeetingActions from "@/hooks/useMeetingActions";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isJoinMeeting: boolean;
}

function MeetingModal({ isOpen, onClose, title, isJoinMeeting }: MeetingModalProps) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const { createInstantMeeting, joinMeeting } = useMeetingActions();

  const handleStart = () => {
    if (isJoinMeeting) {
      // if it's a full URL extract meeting ID
      const meetingId = meetingUrl.trim().split("/").pop();
      if (meetingId) joinMeeting(meetingId);
    } else {
      createInstantMeeting();
    }

    setMeetingUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-modal sm:max-w-[440px] text-white rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.3)]">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
            {isJoinMeeting ? <Link2 className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-white tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 mt-1">
              {isJoinMeeting
                ? "Enter the meeting link or ID provided by your interviewer."
                : "Initialize a high-definition real-time coding room with synchronized IDE and co-pilot."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {isJoinMeeting && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Meeting Link or Room ID</label>
              <Input
                placeholder="https://.../meeting/xyz or room ID"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                className="glass-input h-11 px-3.5 rounded-xl bg-slate-900/80 border-white/10 text-white placeholder:text-slate-500 text-xs font-mono"
                autoFocus
              />
              <p className="text-[11px] text-slate-400">
                Tip: You can paste either the full URL or just the ID.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              onClick={onClose}
              className="glass-btn-secondary px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleStart}
              disabled={isJoinMeeting && !meetingUrl.trim()}
              className="glass-btn-primary px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-lg shadow-indigo-500/25"
            >
              <span>{isJoinMeeting ? "Join Live Session" : "Start Instant Call"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MeetingModal;