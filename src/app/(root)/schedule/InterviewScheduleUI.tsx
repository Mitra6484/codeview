import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";
import { Id } from "../../../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";

function InterviewScheduleUI() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Id<"interviews"> | null>(null);
  const [isDeleting, setIsDeleting] = useState<Id<"interviews"> | null>(null);

  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];
  const scheduleInterview = useMutation(api.interviews.scheduleInterview);
  const updateInterview = useMutation(api.interviews.updateInterview);
  const deleteInterview = useMutation(api.interviews.deleteInterview);

  const candidates = users?.filter((u) => u.role === "candidate");
  const interviewers = users?.filter((u) => u.role === "interviewer");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    candidateId: "",
    interviewerIds: user?.id ? [user.id] : [],
  });

  const handleEdit = (interview: any) => {
    if (interview.status !== "scheduled") {
      toast.error("Can only edit scheduled interviews");
      return;
    }
    setEditingInterview(interview._id);
    setFormData({
      title: interview.title,
      description: interview.description || "",
      date: new Date(interview.startTime),
      time: new Date(interview.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      candidateId: interview.candidateId,
      interviewerIds: interview.interviewerIds,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!client || !user) return;
    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and at least one interviewer");
      return;
    }
  
    setIsCreating(true);
    const { title, description, date, time, candidateId, interviewerIds } = formData;
    const [hours, minutes] = time.split(":");
    const meetingDate = new Date(date);
    meetingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
    // Check for time conflict (excluding the interview being edited)
    const conflict = interviews.some((interview) => {
      if (editingInterview && interview._id === editingInterview) return false;
      const interviewDate = new Date(interview.startTime);
      return (
        interviewDate.getFullYear() === meetingDate.getFullYear() &&
        interviewDate.getMonth() === meetingDate.getMonth() &&
        interviewDate.getDate() === meetingDate.getDate() &&
        interviewDate.getHours() === meetingDate.getHours() &&
        interviewDate.getMinutes() === meetingDate.getMinutes()
      );
    });
  
    if (conflict) {
      toast.error("Another interview is already scheduled at this time!");
      setIsCreating(false);
      return;
    }

    try {
      if (editingInterview) {
        await updateInterview({
          id: editingInterview,
          title,
          description,
          startTime: meetingDate.getTime(),
          candidateId,
          interviewerIds,
        });
        toast.success("Interview updated successfully!");
      } else {
        const id = crypto.randomUUID();
        const call = client.call("default", id);
  
        await call.getOrCreate({
          data: {
            starts_at: meetingDate.toISOString(),
            custom: {
              description: title,
              additionalDetails: description,
            },
          },
        });
  
        await scheduleInterview({
          title,
          description,
          startTime: meetingDate.getTime(),
          status: "scheduled",
          streamCallId: id,
          candidateId,
          interviewerIds,
        });
        toast.success("Interview scheduled successfully!");
      }
    } catch (error) {
      toast.error(editingInterview ? "Failed to update interview" : "Failed to schedule interview");
    } finally {
      setIsCreating(false);
      setOpen(false);
      setEditingInterview(null);
      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
      });
    }
  };

  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }));
    }
  };

  const removeInterviewer = (interviewerId: string) => {
    if (interviewerId === user?.id) return;
    setFormData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
    }));
  };

  const selectedInterviewers = interviewers.filter((i) =>
    formData.interviewerIds.includes(i.clerkId)
  );

  const availableInterviewers = interviewers.filter(
    (i) => !formData.interviewerIds.includes(i.clerkId)
  );

  const handleDelete = async (interviewId: Id<"interviews">) => {
    try {
      setIsDeleting(interviewId);
      await deleteInterview({ id: interviewId });
      toast.success("Interview deleted successfully");
    } catch (error) {
      toast.error("Failed to delete interview");
    } finally {
      setIsDeleting(null);
    }
  };

  // Filter interviews based on user role and participation
  const filteredInterviews = interviews.filter((interview) => {
    if (!user) return false;
    return interview.interviewerIds.includes(user.id);
  });

  return (
    <PageTransition>
      <div className="container max-w-7xl mx-auto py-10 px-4 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          {/* HEADER INFO */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-mono text-indigo-400 mb-2 border border-indigo-500/20">
              <span>Calendar & Sessions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Interview Sessions</h1>
            <p className="text-sm text-slate-400 mt-1">Schedule live video sessions, assign interviewers, and manage appointments</p>
          </div>

          {/* DIALOG */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="glass-btn-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25">
                Schedule Interview
              </button>
            </DialogTrigger>

            <DialogContent className="glass-modal rounded-3xl sm:max-w-[540px] max-h-[85vh] overflow-y-auto text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">{editingInterview ? "Edit Interview Session" : "Schedule Interview Session"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-xs">
                {/* INTERVIEW TITLE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Session Title</label>
                  <Input
                    placeholder="e.g. Senior Frontend Architecture Interview"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="glass-input rounded-xl bg-slate-900 border-white/10 text-white"
                  />
                </div>

                {/* INTERVIEW DESC */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Description</label>
                  <Textarea
                    placeholder="Interview description & candidate notes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="glass-input rounded-xl bg-slate-900 border-white/10 text-white"
                  />
                </div>

                {/* CANDIDATE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Candidate</label>
                  <Select
                    value={formData.candidateId}
                    onValueChange={(candidateId) => setFormData({ ...formData, candidateId })}
                  >
                    <SelectTrigger className="glass-input rounded-xl bg-slate-900 border-white/10 text-white">
                      <SelectValue placeholder="Select candidate" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border border-white/15 text-white">
                      {candidates.map((candidate) => (
                        <SelectItem key={candidate.clerkId} value={candidate.clerkId}>
                          <UserInfo user={candidate} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* INTERVIEWERS */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Interviewers</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedInterviewers.map((interviewer) => (
                      <div
                        key={interviewer.clerkId}
                        className="inline-flex items-center gap-2 glass-surface px-2.5 py-1 rounded-xl text-xs border border-white/10 text-slate-200"
                      >
                        <UserInfo user={interviewer} />
                        {interviewer.clerkId !== user?.id && (
                          <button
                            onClick={() => removeInterviewer(interviewer.clerkId)}
                            className="hover:text-red-400 transition-colors ml-1"
                          >
                            <XIcon className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {availableInterviewers.length > 0 && (
                    <Select onValueChange={addInterviewer}>
                      <SelectTrigger className="glass-input rounded-xl bg-slate-900 border-white/10 text-white">
                        <SelectValue placeholder="Add interviewer" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border border-white/15 text-white">
                        {availableInterviewers.map((interviewer) => (
                          <SelectItem key={interviewer.clerkId} value={interviewer.clerkId}>
                            <UserInfo user={interviewer} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* DATE & TIME */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* CALENDAR */}
                  <div className="space-y-1.5 flex-1">
                    <label className="text-xs font-semibold text-slate-300">Date</label>
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData({ ...formData, date })}
                      disabled={(date) => date < new Date()}
                      className="rounded-2xl border border-white/10 glass-surface p-3"
                    />
                  </div>

                  {/* TIME */}
                  <div className="space-y-1.5 sm:w-36">
                    <label className="text-xs font-semibold text-slate-300">Time</label>
                    <Select
                      value={formData.time}
                      onValueChange={(time) => setFormData({ ...formData, time })}
                    >
                      <SelectTrigger className="glass-input rounded-xl bg-slate-900 border-white/10 text-white">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[180px] bg-slate-950 border border-white/15 text-white">
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    className="glass-btn-secondary px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white cursor-pointer"
                    onClick={() => {
                      setOpen(false);
                      setEditingInterview(null);
                      setFormData({
                        title: "",
                        description: "",
                        date: new Date(),
                        time: "09:00",
                        candidateId: "",
                        interviewerIds: user?.id ? [user.id] : [],
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isCreating}
                    className="glass-btn-primary px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                  >
                    {isCreating ? (
                      <>
                        <Loader2Icon className="mr-1 size-3.5 animate-spin" />
                        {editingInterview ? "Updating..." : "Scheduling..."}
                      </>
                    ) : (
                      editingInterview ? "Update Interview" : "Schedule Interview"
                    )}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* LOADING STATE & MEETING CARDS */}
        <AnimatePresence mode="wait">
          {!filteredInterviews ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </motion.div>
          ) : filteredInterviews.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredInterviews.map((interview) => (
                    <motion.div
                      key={interview._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="relative group"
                    >
                      <MeetingCard interview={interview} />
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out transform translate-y-1 group-hover:translate-y-0">
                        {interview.status === "scheduled" && (
                          <button
                            onClick={() => handleEdit(interview)}
                            className="glass-btn-secondary px-2.5 py-1 text-xs rounded-lg text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer shadow-md"
                          >
                            <PencilIcon className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        )}
                        {interview.interviewerIds.includes(user?.id || "") && (
                          <button
                            onClick={() => handleDelete(interview._id)}
                            disabled={isDeleting === interview._id}
                            className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 rounded-lg p-1.5 cursor-pointer transition-all shadow-md disabled:opacity-50"
                            title="Delete Interview"
                          >
                            {isDeleting === interview._id ? (
                              <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2Icon className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 glass-card rounded-3xl border border-white/10 text-slate-400 space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl glass-surface border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
                <PencilIcon className="w-5 h-5 opacity-40" />
              </div>
              <p className="text-base font-semibold text-white">No interviews scheduled yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click "Schedule Interview" above to book a new coding session with a candidate.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
export default InterviewScheduleUI;