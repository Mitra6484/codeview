"use client";

import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk";
import { LayoutListIcon, LoaderIcon, UsersIcon, Sparkles, Code2, Workflow, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";
import CodeEditor from "./CodeEditor";
import SystemDesignCanvas from "./architecture/SystemDesignCanvas";
import { PlagiarismAlert } from "./PlagiarismAlert";
import type { CodeAnalysisResult } from "../actions/analyze-code";
import { generateInterviewerCopilot, CopilotResponse } from "@/actions/ai/interviewer-copilot";
import InterviewerCopilotDrawer from "./interview/InterviewerCopilotDrawer";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import InterviewerScorecardModal from "./interview/InterviewerScorecardModal";
import toast from "react-hot-toast";

function MeetingRoom() {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const [isPlagiarismAlertOpen, setIsPlagiarismAlertOpen] = useState(false);
  const [plagiarismResult, setPlagiarismResult] = useState<CodeAnalysisResult | null>(null);
  const call = useCall();
  const { isInterviewer } = useUserRole();
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"code" | "canvas">("code");

  // Interviewer Assessment State
  const [interviewerNotes, setInterviewerNotes] = useState<string>("");
  const [rubricScores, setRubricScores] = useState({
    algorithmicRigor: 3,
    codeHygiene: 3,
    verbalCommunication: 3,
    systemDesign: 3,
  });
  const [hasCandidateRequestedHint, setHasCandidateRequestedHint] = useState<boolean>(false);
  const [isScorecardModalOpen, setIsScorecardModalOpen] = useState<boolean>(false);
  const [isCandidateEndedModalOpen, setIsCandidateEndedModalOpen] = useState<boolean>(false);

  // Convex Interview queries & mutations
  const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
    streamCallId: call?.id || "",
  });
  const updateInterviewStatus = useMutation(api.interviews.updateInterviewStatus);

  // AI Co-Pilot State
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotData, setCopilotData] = useState<CopilotResponse | null>(null);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  // Keep track of active code for co-pilot refresh
  const codeContextRef = useRef<{
    code: string;
    language: string;
    title: string;
    description: string;
  }>({
    code: "",
    language: "python",
    title: "Technical Interview",
    description: "",
  });

  const callingState = useCallCallingState();

  useEffect(() => {
    if (!call) return;

    // Listen for custom events across participants
    const handleCustomEvents = (event: any) => {
      if (event.type === "analysis-result") {
        const result = event.data as CodeAnalysisResult;
        if (result.isPlagiarized && result.confidence > 70) {
          setPlagiarismResult(result);
          if (isInterviewer) {
            setIsPlagiarismAlertOpen(true);
          }
        }
      } else if (event.type === "candidate-hint-request") {
        if (isInterviewer) {
          toast("💡 Candidate requested a hint or clarification!", {
            icon: "💡",
            duration: 6000,
          });
          setHasCandidateRequestedHint(true);
        }
      } else if (event.type === "candidate-submitted-solution") {
        if (isInterviewer) {
          toast.success("Candidate submitted solution for evaluation!");
          if (event.data?.code) {
            refreshCopilot(event.data.code);
          }
        }
      } else if (event.type === "interview-concluded") {
        if (!isInterviewer) {
          setIsCandidateEndedModalOpen(true);
        }
      }
    };

    call.on("custom", handleCustomEvents);

    return () => {
      call.off("custom", handleCustomEvents);
    };
  }, [call, isInterviewer]);

  // Dispatch hint directly to candidate's screen
  const handleSendHint = (hint: string, level: number) => {
    if (call) {
      call.sendCustomEvent({
        type: "interviewer-sent-hint",
        data: { hint, level },
      });
    }
    toast.success(`Dispatched Level ${level} hint to candidate!`);
  };

  // Fetch or refresh AI Co-Pilot Data
  const refreshCopilot = async (overrideCode?: string) => {
    setIsCopilotLoading(true);
    try {
      const activeCode = overrideCode ?? codeContextRef.current.code;
      const res = await generateInterviewerCopilot({
        code: activeCode,
        language: codeContextRef.current.language,
        questionTitle: codeContextRef.current.title,
        questionDescription: codeContextRef.current.description,
      });
      setCopilotData(res);
    } catch (e) {
      console.error("Failed to load co-pilot advice", e);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  // Called when code changes in CodeEditor
  const handleCodeChange = (
    newCode: string,
    newLanguage: string,
    newTitle: string,
    newDescription: string
  ) => {
    codeContextRef.current = {
      code: newCode,
      language: newLanguage,
      title: newTitle,
      description: newDescription,
    };
  };

  // Called when code is submitted for analysis
  const handleCodeAnalysisResult = (result: CodeAnalysisResult) => {
    if (call) {
      call.sendCustomEvent({
        type: "analysis-result",
        data: result,
      });
    }

    if (result.isPlagiarized && result.confidence > 70) {
      setPlagiarismResult(result);
      setIsPlagiarismAlertOpen(true);
    }

    // Also auto-refresh interviewer co-pilot
    if (isInterviewer) {
      refreshCopilot();
    }
  };

  const handleFlagForReview = () => {
    toast.success("A candidate has requested to review their code submission", {
      duration: 5000,
    });
    setIsPlagiarismAlertOpen(false);
  };

  const handleCompleteMeeting = async () => {
    try {
      if (call) {
        call.sendCustomEvent({
          type: "interview-concluded",
          data: { timestamp: new Date().toISOString() },
        });
        await call.endCall();
      }
      if (interview) {
        await updateInterviewStatus({
          id: interview._id,
          status: "completed",
        });
      }
      toast.success("Meeting ended and scorecard saved");
      router.push("/dashboard");
    } catch (e) {
      console.error("Failed to conclude meeting", e);
      toast.error("Failed to complete meeting");
    }
  };

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem-1px)] relative glass-canvas">
      <ResizablePanelGroup direction="horizontal">
        {/* LEFT PANE: VIDEO STREAM */}
        <ResizablePanel defaultSize={35} minSize={25} maxSize={100} className="relative">
          <div className="absolute inset-0">
            {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

            {/* PARTICIPANTS LIST OVERLAY */}
            {showParticipants && (
              <div className="absolute right-0 top-0 h-full w-[300px] glass-nav backdrop-blur-2xl z-30 overflow-hidden border-l border-white/10">
                <div className="h-full p-4">
                  <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>
              </div>
            )}
          </div>

          {/* FLOATING GLASS VIDEO CONTROLS DOCK */}
          <div className="absolute bottom-5 left-0 right-0 z-30 pointer-events-none">
            <div className="flex flex-col items-center gap-4">
              <div className="glass-surface p-2 px-3 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-2.5 flex-wrap justify-center pointer-events-auto">
                <CallControls onLeave={() => router.push("/")} />

                <div className="h-5 w-px bg-white/10 mx-1" />

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="size-10 glass-btn-secondary border-white/10">
                        <LayoutListIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-card border-white/10 text-xs">
                      <DropdownMenuItem onClick={() => setLayout("grid")} className="cursor-pointer">
                        Grid View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLayout("speaker")} className="cursor-pointer">
                        Speaker View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="icon"
                    className={`size-10 glass-btn-secondary border-white/10 ${showParticipants ? "bg-white/15" : ""}`}
                    onClick={() => setShowParticipants(!showParticipants)}
                    title="Participants"
                  >
                    <UsersIcon className="size-4" />
                  </Button>

                  {/* INTERVIEWER AI CO-PILOT TOGGLE */}
                  {isInterviewer && (
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`size-10 cursor-pointer transition-all ${
                          isCopilotOpen
                            ? "glass-btn-primary bg-indigo-600 border-indigo-400/50 shadow-lg shadow-indigo-500/30"
                            : "glass-btn-secondary border-white/10 hover:border-indigo-400/40"
                        }`}
                        onClick={() => {
                          if (!isCopilotOpen && !copilotData) {
                            refreshCopilot();
                          }
                          setIsCopilotOpen(!isCopilotOpen);
                          if (hasCandidateRequestedHint) {
                            setHasCandidateRequestedHint(false);
                          }
                        }}
                        title="AI Co-Pilot & Rubric (Interviewer Only)"
                      >
                        <Sparkles className={`size-4 ${isCopilotOpen ? "text-white" : "text-indigo-400"}`} />
                      </Button>
                      {hasCandidateRequestedHint && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                      )}
                    </div>
                  )}

                  <EndCallButton onBeforeEnd={() => setIsScorecardModalOpen(true)} />
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-white/5 hover:bg-indigo-500/30 transition-colors" />

        {/* RIGHT PANE: DUAL WORKSPACE (CODE STUDIO vs SYSTEM DESIGN CANVAS) */}
        <ResizablePanel defaultSize={65} minSize={25} className="flex flex-col bg-slate-950/90">
          {/* Workspace Tab Switcher Header */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-white/10 glass-nav z-20 shrink-0">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/5">
              <button
                onClick={() => setActiveWorkspaceTab("code")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeWorkspaceTab === "code"
                    ? "glass-btn-primary bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code Studio</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab("canvas")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeWorkspaceTab === "canvas"
                    ? "glass-btn-primary bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Workflow className="w-3.5 h-3.5 text-emerald-400" />
                <span>System Design Canvas</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  Atlas AI
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                {activeWorkspaceTab === "code" ? "Live Monaco Environment" : "Distributed Topology & Stress Test"}
              </span>
            </div>
          </div>

          {/* Active Workspace View (Preserving state across tab switches) */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            <div className={activeWorkspaceTab === "code" ? "h-full flex flex-col" : "hidden"}>
              <CodeEditor
                onAnalysisResult={handleCodeAnalysisResult}
                onCodeChange={handleCodeChange}
                isInterviewer={isInterviewer}
                call={call}
              />
            </div>

            <div className={activeWorkspaceTab === "canvas" ? "h-full flex flex-col" : "hidden"}>
              <SystemDesignCanvas call={call} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* PRIVATE AI CO-PILOT & ASSESSMENT DRAWER (INTERVIEWER ONLY) */}
      {isInterviewer && (
        <InterviewerCopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          copilotData={copilotData}
          isLoading={isCopilotLoading}
          onRefresh={() => refreshCopilot()}
          interviewerNotes={interviewerNotes}
          onNotesChange={setInterviewerNotes}
          rubricScores={rubricScores}
          onRubricScoreChange={(dim, score) =>
            setRubricScores((prev) => ({ ...prev, [dim]: score }))
          }
          plagiarismResult={plagiarismResult}
          hasCandidateRequestedHint={hasCandidateRequestedHint}
          onDismissHintRequest={() => setHasCandidateRequestedHint(false)}
          onOpenScorecardModal={() => setIsScorecardModalOpen(true)}
          onSendHint={handleSendHint}
        />
      )}

      {/* Plagiarism Alert Dialog - INTERVIEWER ONLY */}
      {isInterviewer && plagiarismResult && (
        <PlagiarismAlert
          isOpen={isPlagiarismAlertOpen}
          onOpenChange={setIsPlagiarismAlertOpen}
          result={plagiarismResult}
          onConfirm={handleFlagForReview}
        />
      )}

      {/* Veritas AI Executive Scorecard Modal - INTERVIEWER ONLY */}
      {isInterviewer && (
        <InterviewerScorecardModal
          isOpen={isScorecardModalOpen}
          onClose={() => setIsScorecardModalOpen(false)}
          interviewId={interview?._id}
          interviewTitle={interview?.title || codeContextRef.current.title}
          candidateName="Candidate"
          codeSnippet={codeContextRef.current.code}
          language={codeContextRef.current.language}
          interviewerNotes={interviewerNotes}
          rubricScores={rubricScores}
          onCompleteMeeting={handleCompleteMeeting}
        />
      )}

      {/* CANDIDATE POST-INTERVIEW CONCLUDED MODAL */}
      {!isInterviewer && (
        <Dialog open={isCandidateEndedModalOpen} onOpenChange={() => {}}>
          <DialogContent className="max-w-md glass-modal text-slate-100 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white">
                Interview Session Concluded
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-1">
                Thank you for completing your technical interview on Codeview. Your code implementation and system design architecture have been securely recorded.
              </DialogDescription>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-300 text-left space-y-1">
              <p className="font-semibold text-slate-200">What happens next?</p>
              <p className="text-slate-400">
                The hiring team will review your session scorecard and reach out with subsequent steps.
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="w-full glass-btn-primary py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer"
            >
              Return to Workspace
            </button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default MeetingRoom;
