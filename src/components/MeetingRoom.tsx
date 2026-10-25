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
import { LayoutListIcon, LoaderIcon, UsersIcon, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";
import CodeEditor from "./CodeEditor";
import { PlagiarismAlert } from "./PlagiarismAlert";
import type { CodeAnalysisResult } from "../actions/analyze-code";
import { generateInterviewerCopilot, CopilotResponse } from "@/actions/ai/interviewer-copilot";
import InterviewerCopilotDrawer from "./interview/InterviewerCopilotDrawer";
import { useUserRole } from "@/hooks/useUserRole";
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

    // Listen for analysis results from other participants
    const handleAnalysisResult = (event: any) => {
      if (event.type === "analysis-result") {
        const result = event.data as CodeAnalysisResult;
        if (result.isPlagiarized && result.confidence > 70) {
          setPlagiarismResult(result);
          setIsPlagiarismAlertOpen(true);
        }
      }
    };

    call.on("custom", handleAnalysisResult);

    return () => {
      call.off("custom", handleAnalysisResult);
    };
  }, [call]);

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
                      }}
                      title="AI Co-Pilot (Interviewer Only)"
                    >
                      <Sparkles className={`size-4 ${isCopilotOpen ? "text-white" : "text-indigo-400"}`} />
                    </Button>
                  )}

                  <EndCallButton />
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-white/5 hover:bg-indigo-500/30 transition-colors" />

        {/* RIGHT PANE: MONACO CODE EDITOR */}
        <ResizablePanel defaultSize={65} minSize={25}>
          <CodeEditor
            onAnalysisResult={handleCodeAnalysisResult}
            onCodeChange={handleCodeChange}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* PRIVATE AI CO-PILOT DRAWER (INTERVIEWER ONLY) */}
      {isInterviewer && (
        <InterviewerCopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          copilotData={copilotData}
          isLoading={isCopilotLoading}
          onRefresh={() => refreshCopilot()}
        />
      )}

      {/* Plagiarism Alert Dialog */}
      {plagiarismResult && (
        <PlagiarismAlert
          isOpen={isPlagiarismAlertOpen}
          onOpenChange={setIsPlagiarismAlertOpen}
          result={plagiarismResult}
          onConfirm={handleFlagForReview}
        />
      )}
    </div>
  );
}

export default MeetingRoom;
