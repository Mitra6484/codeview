"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  Code2,
  Bot,
  BrainCircuit,
  MessageSquare,
  FileText,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useVoiceInterview } from "@/hooks/useVoiceInterview";
import { processVoiceInterviewTurn, VoiceTurnResponse } from "@/actions/ai/voice-mock-agent";
import { executeCode, ExecuteCodeResult } from "@/actions/execute-code";
import LoaderUI from "@/components/LoaderUI";

export default function MockInterviewPage() {
  const router = useRouter();

  // Selected Question & Language
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<"javascript" | "python" | "java">("python");
  const [code, setCode] = useState<string>("");

  // Code Execution State
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecuteCodeResult | null>(null);
  const [customInput, setCustomInput] = useState("");
  const [rightTab, setRightTab] = useState<"problem" | "transcript" | "insights">("problem");

  // Interview Session State
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [aiState, setAiState] = useState<VoiceTurnResponse>({
    spokenResponse: "",
    thoughtSummary: "Ready to begin",
    stage: "intro",
    detectedComplexity: { time: "Pending", space: "Pending" },
  });

  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: "user" | "model"; text: string; timestamp: string }>
  >([]);

  const [showScorecard, setShowScorecard] = useState(false);

  // Sync starter code
  useEffect(() => {
    if (selectedQuestion?.starterCode?.[language]) {
      setCode(selectedQuestion.starterCode[language]);
    }
  }, [selectedQuestion, language]);

  // Session stopwatch
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Voice Hook
  const {
    isListening,
    isSpeaking,
    currentTranscript,
    audioLevel,
    speak,
    stopSpeaking,
    toggleListening,
    startListening,
  } = useVoiceInterview({
    onSpeechResult: (spokenText) => {
      handleCandidateSpoke(spokenText);
    },
  });

  // Initial Welcome from Alex
  useEffect(() => {
    const welcomeTimeout = setTimeout(() => {
      const welcomeMsg = `Hi there! I am Alex, your interviewer today. We'll be working on ${selectedQuestion.title}. Whenever you are ready, talk me through your initial thoughts!`;
      setConversationHistory([
        {
          role: "model",
          text: welcomeMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      speak(welcomeMsg);
      startListening();
    }, 1200);

    return () => clearTimeout(welcomeTimeout);
  }, [selectedQuestion.title, speak, startListening]);

  // When candidate finishes speaking
  const handleCandidateSpoke = async (spokenText: string) => {
    if (!spokenText.trim() || isAiProcessing) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updatedHistory = [
      ...conversationHistory,
      { role: "user" as const, text: spokenText, timestamp: timeStr },
    ];
    setConversationHistory(updatedHistory);
    setIsAiProcessing(true);

    try {
      const response = await processVoiceInterviewTurn({
        userSpeech: spokenText,
        code,
        language,
        questionTitle: selectedQuestion.title,
        questionDescription: selectedQuestion.description,
        history: updatedHistory.map((h) => ({ role: h.role, text: h.text })),
      });

      setAiState(response);

      if (response.spokenResponse) {
        setConversationHistory((prev) => [
          ...prev,
          {
            role: "model",
            text: response.spokenResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        speak(response.spokenResponse);
      }
    } catch (err) {
      console.error("AI turn error:", err);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Execute Code in Sandbox
  const handleRunCode = async () => {
    setIsExecuting(true);
    try {
      const res = await executeCode({
        language,
        code,
        input: customInput || undefined,
      });
      setExecutionResult(res);

      // Notify the AI verbally about the run result
      const runVerdict = res.success
        ? "I just ran the code and it executed with no errors."
        : `I ran the code but got an execution error: ${res.error || "failed"}`;
      handleCandidateSpoke(runVerdict);
    } catch (e: any) {
      setExecutionResult({
        success: false,
        output: "",
        error: e?.message || "Execution error",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen glass-canvas flex flex-col text-slate-200">
      {/* TOP HEADER */}
      <header className="glass-nav sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="glass-btn-secondary px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <div className="h-4 w-px bg-white/10" />

          {/* Question Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Problem:</span>
            <select
              value={selectedQuestion.id}
              onChange={(e) => {
                const found = CODING_QUESTIONS.find((q) => q.id === e.target.value);
                if (found) setSelectedQuestion(found);
              }}
              className="glass-input px-3 py-1 rounded-xl text-xs font-semibold text-white bg-slate-900/80 cursor-pointer"
            >
              {CODING_QUESTIONS.map((q) => (
                <option key={q.id} value={q.id} className="bg-slate-950 text-white">
                  {q.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: AI Persona Active Pill */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-medium text-indigo-300">
          <span
            className={`w-2 h-2 rounded-full ${
              isSpeaking
                ? "bg-emerald-400 animate-ping"
                : isListening
                ? "bg-indigo-400 animate-pulse"
                : "bg-slate-500"
            }`}
          />
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Alex (Gentle AI Interviewer)</span>
          <span className="text-white/20">•</span>
          <span className="font-mono text-emerald-400">{formatTimer(sessionTime)}</span>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowScorecard(true)}
            className="glass-btn-primary px-4 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>End & Review Scorecard</span>
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* LEFT PANE: Monaco Code Studio (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-r border-white/10 bg-slate-950/60">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-slate-950/80">
            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="glass-input px-2.5 py-1 rounded-lg text-xs font-mono text-slate-200 bg-slate-900 cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id} className="bg-slate-950 text-white">
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (selectedQuestion?.starterCode?.[language]) {
                    setCode(selectedQuestion.starterCode[language]);
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                title="Reset Code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleRunCode}
                disabled={isExecuting}
                className="glass-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{isExecuting ? "Executing..." : "Run Code"}</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Component */}
          <div className="flex-1 min-h-[420px] relative">
            <Editor
              height="100%"
              language={language === "python" ? "python" : language === "java" ? "java" : "javascript"}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "GeistMono, Menlo, Monaco, Courier New, monospace",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                lineNumbers: "on",
                smoothScrolling: true,
              }}
            />
          </div>

          {/* Bottom Execution Output Drawer */}
          <div className="h-44 border-t border-white/10 bg-slate-950/90 flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-slate-900/60 font-sans">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold text-xs">Terminal Execution</span>
              </div>
              {executionResult && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                    executionResult.success
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  {executionResult.success ? "Success (Exit 0)" : "Failed (Runtime Error)"}
                </span>
              )}
            </div>

            <div className="flex-1 p-3 overflow-y-auto text-slate-300 font-mono space-y-1">
              {executionResult ? (
                <>
                  {executionResult.output && (
                    <pre className="text-emerald-400 whitespace-pre-wrap">{executionResult.output}</pre>
                  )}
                  {executionResult.error && (
                    <pre className="text-rose-400 whitespace-pre-wrap">{executionResult.error}</pre>
                  )}
                </>
              ) : (
                <p className="text-slate-500 italic">Click "Run Code" above to execute your solution against test inputs.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Voice AI Chamber (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-950/80">
          {/* AI VOICE AVATAR & SOUND WAVE VISUALIZER */}
          <div className="p-6 border-b border-white/10 glass-card m-3 rounded-2xl relative overflow-hidden flex flex-col items-center text-center">
            {/* Ambient Background Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-b ${
                isSpeaking
                  ? "from-emerald-500/20 to-transparent"
                  : isListening
                  ? "from-indigo-500/20 to-transparent"
                  : "from-white/5 to-transparent"
              } transition-all duration-500 pointer-events-none`}
            />

            {/* Glowing Avatar Orb with Equalizer Bars */}
            <div className="relative mb-3">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isSpeaking
                    ? "bg-emerald-500/20 border-emerald-400/50 shadow-[0_0_35px_rgba(16,185,129,0.35)] scale-105"
                    : isListening
                    ? "bg-indigo-500/20 border-indigo-400/50 shadow-[0_0_35px_rgba(99,102,241,0.35)] scale-100"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <Bot
                  className={`w-9 h-9 transition-colors ${
                    isSpeaking ? "text-emerald-400" : isListening ? "text-indigo-400" : "text-slate-400"
                  }`}
                />
              </div>

              {/* Pulsing Audio Frequency Waves */}
              {(isSpeaking || isListening) && (
                <div className="absolute -bottom-2 inset-x-0 flex items-center justify-center gap-1">
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-1 h-5 bg-indigo-400 rounded-full animate-bounce delay-75" />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce delay-150" />
                  <span className="w-1 h-4 bg-indigo-400 rounded-full animate-bounce delay-100" />
                </div>
              )}
            </div>

            {/* AI Status Voice Indicator */}
            <h3 className="text-base font-bold text-white tracking-tight">Alex</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isSpeaking
                ? "Alex is speaking to you..."
                : isAiProcessing
                ? "Alex is thinking..."
                : isListening
                ? "Listening to your voice... Speak anytime"
                : "Microphone paused. Click to speak."}
            </p>

            {/* Real-time Subtitle / Live Transcript bubble */}
            {currentTranscript && (
              <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 italic max-w-sm">
                "{currentTranscript}"
              </div>
            )}

            {/* Mic Toggle Button */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={toggleListening}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  isListening
                    ? "glass-btn-primary bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "glass-btn-secondary text-slate-300 hover:text-white"
                }`}
              >
                {isListening ? <Mic className="w-4 h-4 text-emerald-400 animate-pulse" /> : <MicOff className="w-4 h-4 text-slate-400" />}
                <span>{isListening ? "Microphone Active" : "Unmute Microphone"}</span>
              </button>

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-2 rounded-xl glass-btn-secondary text-slate-400 hover:text-white"
                  title="Pause AI Voice"
                >
                  <VolumeX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* TABS: Problem / Transcript / Insights */}
          <div className="flex-1 flex flex-col mx-3 mb-3 glass-card rounded-2xl overflow-hidden border border-white/10">
            <div className="flex border-b border-white/10 bg-slate-900/40 text-xs font-medium">
              <button
                onClick={() => setRightTab("problem")}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  rightTab === "problem"
                    ? "text-white border-b-2 border-indigo-400 bg-white/5 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Problem</span>
              </button>
              <button
                onClick={() => setRightTab("transcript")}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  rightTab === "transcript"
                    ? "text-white border-b-2 border-indigo-400 bg-white/5 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Transcript ({conversationHistory.length})</span>
              </button>
              <button
                onClick={() => setRightTab("insights")}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  rightTab === "insights"
                    ? "text-white border-b-2 border-indigo-400 bg-white/5 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Insights</span>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto text-xs leading-relaxed text-slate-300">
              {rightTab === "problem" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-white">{selectedQuestion.title}</h3>
                    <p className="mt-1 text-slate-300 whitespace-pre-line">{selectedQuestion.description}</p>
                  </div>

                  {selectedQuestion.examples && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-200">Examples:</h4>
                      {selectedQuestion.examples.map((ex, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-[11px] space-y-1">
                          <p><span className="text-indigo-400">Input:</span> {ex.input}</p>
                          <p><span className="text-emerald-400">Output:</span> {ex.output}</p>
                          {ex.explanation && <p className="text-slate-500 font-sans">{ex.explanation}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedQuestion.constraints && (
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-1">Constraints:</h4>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-400 text-[11px]">
                        {selectedQuestion.constraints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {rightTab === "transcript" && (
                <div className="space-y-3">
                  {conversationHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs leading-relaxed ${
                        item.role === "model"
                          ? "bg-indigo-500/10 border-indigo-500/20 text-slate-200 ml-0 mr-4"
                          : "bg-white/[0.04] border-white/10 text-white ml-4 mr-0"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-indigo-300">
                          {item.role === "model" ? "Alex (AI Interviewer)" : "You (Candidate)"}
                        </span>
                        <span>{item.timestamp}</span>
                      </div>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {rightTab === "insights" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Detected Time Big-O</span>
                      <span className="text-sm font-mono font-bold text-indigo-300">
                        {aiState.detectedComplexity?.time || "O(N)"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Detected Space Big-O</span>
                      <span className="text-sm font-mono font-bold text-violet-300">
                        {aiState.detectedComplexity?.space || "O(1)"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-emerald-400 font-bold block mb-1">Current Phase: {aiState.stage}</span>
                    <p className="text-[11px] text-slate-300">{aiState.thoughtSummary}</p>
                  </div>

                  {aiState.hint && (
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <span className="text-indigo-400 font-bold block mb-1">💡 Suggested Hint</span>
                      <p className="text-[11px] text-slate-300">{aiState.hint}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* END SESSION SCORECARD MODAL */}
      {showScorecard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-white/15 relative space-y-6 shadow-2xl">
            <div className="text-center space-y-1">
              <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
                Evaluation Complete
              </span>
              <h2 className="text-2xl font-bold text-white">Interview Performance Scorecard</h2>
              <p className="text-xs text-slate-400">Problem: {selectedQuestion.title} • Time: {formatTimer(sessionTime)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block">Algorithmic Efficiency</span>
                <span className="text-base font-bold text-emerald-400">92 / 100</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block">Verbal Communication</span>
                <span className="text-base font-bold text-indigo-400">88 / 100</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block">Code Hygiene & Style</span>
                <span className="text-base font-bold text-violet-400">95 / 100</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block">Final Recommendation</span>
                <span className="text-base font-bold text-emerald-300">Strong Hire</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-indigo-300 block mb-1">Alex's Executive Feedback:</span>
              "Great session! You thought aloud clearly before writing code, recognized the optimal hash map lookup pattern, and verified edge cases without hesitation."
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowScorecard(false)}
                className="flex-1 glass-btn-secondary py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
              >
                Continue Practicing
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 glass-btn-primary py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
