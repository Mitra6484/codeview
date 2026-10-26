"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import type { Doc } from "../../convex/_generated/dataModel"
import { LANGUAGES, CODING_QUESTIONS } from "@/constants"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { AlertCircleIcon, BookIcon, LightbulbIcon, PlayIcon, SendIcon } from "lucide-react"
import Editor from "@monaco-editor/react"
import LoaderUI from "./LoaderUI"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Textarea } from "./ui/textarea"
import { executeCode, type ExecuteCodeResult } from "../actions/execute-code"
import { analyzeCode, type CodeAnalysisResult } from "../actions/analyze-code"
import { ExecutionResult } from "./ExecutionResult"
import { AnalysisResult } from "./AnalysisResult"

import { Lock, Shield, Sparkles } from "lucide-react"
import toast from "react-hot-toast"
import { Badge } from "./ui/badge"
import { useUserRole } from "@/hooks/useUserRole"

type Question = Doc<"questions">

interface Example {
  input: string
  output: string
  explanation?: string
}

interface CodeEditorProps {
  onAnalysisResult?: (result: CodeAnalysisResult) => void
  onCodeChange?: (code: string, language: string, questionTitle: string, questionDescription: string) => void
  isInterviewer?: boolean
  call?: any
}

function CodeEditor({ onAnalysisResult, onCodeChange, isInterviewer: propIsInterviewer, call }: CodeEditorProps) {
  const { isInterviewer: hookIsInterviewer } = useUserRole()
  const isInterviewer = propIsInterviewer !== undefined ? propIsInterviewer : hookIsInterviewer
  const rawQuestions = useQuery(api.questions.getAllQuestions)

  // Resilient fallback: If database questions are cleared or empty, fall back to built-in coding challenges
  const questions: Question[] | undefined = rawQuestions === undefined
    ? undefined
    : (rawQuestions.length > 0
        ? rawQuestions
        : CODING_QUESTIONS.map((cq) => ({
            _id: cq.id as any,
            _creationTime: 0,
            title: cq.title,
            description: cq.description,
            examples: cq.examples,
            starterCode: cq.starterCode,
            constraints: cq.constraints || [],
            supportedLanguages: ["javascript", "python", "java"],
            createdBy: "system",
          })))

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [language, setLanguage] = useState<"javascript" | "python" | "java">(LANGUAGES[0].id)
  const [code, setCode] = useState("")
  const [input, setInput] = useState("")
  const [activeTab, setActiveTab] = useState<"input" | "output" | "analysis">("input")
  const [isExecuting, setIsExecuting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [executionResult, setExecutionResult] = useState<ExecuteCodeResult | null>(null)
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysisResult | null>(null)

  // Real-time collaborative sync refs
  const isRemoteUpdateRef = useRef(false)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [candidateReceivedHint, setCandidateReceivedHint] = useState<{ hint: string; level: number } | null>(null)

  const selectedQuestion = selectedQuestionId ? questions?.find((q: Question) => q._id === selectedQuestionId) : questions?.[0]

  // Listen for question change, code sync, and hint events across participants
  useEffect(() => {
    if (!call) return

    const handleCustomEvents = (event: any) => {
      if (event.type === "question-changed" && event.data?.questionId && !isInterviewer) {
        isRemoteUpdateRef.current = true
        setSelectedQuestionId(event.data.questionId)
        const q = questions?.find((x: Question) => x._id === event.data.questionId)
        if (q && q.starterCode[language]) {
          setCode(q.starterCode[language])
        }
        setTimeout(() => {
          isRemoteUpdateRef.current = false
        }, 150)
        toast(`Interviewer assigned problem: ${q?.title || "New Question"}`)
      } else if (event.type === "code-sync" && event.data) {
        isRemoteUpdateRef.current = true
        if (event.data.code !== undefined) {
          setCode(event.data.code)
        }
        if (event.data.language && event.data.language !== language) {
          setLanguage(event.data.language)
        }
        setTimeout(() => {
          isRemoteUpdateRef.current = false
        }, 150)
      } else if (event.type === "interviewer-sent-hint" && event.data && !isInterviewer) {
        setCandidateReceivedHint({
          hint: event.data.hint,
          level: event.data.level || 1,
        })
        toast("💡 You received a hint from the interviewer!", {
          icon: "💡",
          duration: 8000,
        })
      }
    }

    call.on("custom", handleCustomEvents)
    return () => {
      call.off("custom", handleCustomEvents)
    }
  }, [call, isInterviewer, questions, language])

  useEffect(() => {
    if (questions && questions.length > 0 && !selectedQuestionId) {
      setSelectedQuestionId(questions[0]._id)
    }
  }, [questions, selectedQuestionId])

  useEffect(() => {
    if (selectedQuestion && selectedQuestion.starterCode[language]) {
      setCode(selectedQuestion.starterCode[language])
    }
  }, [selectedQuestion, language])

  useEffect(() => {
    if (onCodeChange && selectedQuestion && code) {
      onCodeChange(code, language, selectedQuestion.title, selectedQuestion.description)
    }
  }, [code, language, selectedQuestion, onCodeChange])

  const handleQuestionChange = (questionId: string) => {
    setSelectedQuestionId(questionId)
    const question = questions?.find((q: Question) => q._id === questionId)
    if (question && question.starterCode[language]) {
      setCode(question.starterCode[language])
    }
    if (call) {
      call.sendCustomEvent({
        type: "question-changed",
        data: { questionId },
      })
      toast.success(`Assigned "${question?.title || "problem"}" to candidate`)
    }
  }

  const handleRequestHint = () => {
    if (call) {
      call.sendCustomEvent({
        type: "candidate-hint-request",
        data: { timestamp: new Date().toISOString() },
      })
    }
    toast.success("Hint request sent to interviewer! Aura is on standby.", {
      icon: "💡",
    })
  }

  const handleLanguageChange = (newLanguage: "javascript" | "python" | "java") => {
    if (selectedQuestion && selectedQuestion.supportedLanguages.includes(newLanguage)) {
      setLanguage(newLanguage)
      const newCode = selectedQuestion.starterCode[newLanguage] || ""
      setCode(newCode)
      if (call) {
        call.sendCustomEvent({
          type: "code-sync",
          data: { code: newCode, language: newLanguage },
        })
      }
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || ""
    setCode(newCode)

    if (call && !isRemoteUpdateRef.current) {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
      syncTimeoutRef.current = setTimeout(() => {
        call.sendCustomEvent({
          type: "code-sync",
          data: { code: newCode, language },
        })
      }, 300)
    }
  }

  const handleRunCode = async () => {
    setIsExecuting(true)
    setActiveTab("output")

    try {
      const result = await executeCode({
        language,
        code,
        input,
      })

      setExecutionResult(result)
    } catch (error) {
      console.error("Failed to execute code:", error)
      setExecutionResult({
        success: false,
        output: "",
        error: "Failed to execute code. Please try again.",
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const handleSubmitCode = async () => {
    if (!selectedQuestion) return

    setIsAnalyzing(true)
    setActiveTab("analysis")

    try {
      const result = await analyzeCode({
        code,
        language,
        questionTitle: selectedQuestion.title,
        questionDescription: selectedQuestion.description,
      })

      setAnalysisResult(result)

      // Call the callback if provided
      if (onAnalysisResult) {
        onAnalysisResult(result)
      }

      if (call) {
        call.sendCustomEvent({
          type: "candidate-submitted-solution",
          data: { code, language, title: selectedQuestion.title },
        })
      }

      if (!isInterviewer) {
        toast.success("Solution submitted to interviewer for evaluation!")
      }
    } catch (error) {
      console.error("Failed to analyze code:", error)
      setAnalysisResult({
        isPlagiarized: false,
        confidence: 0,
        reasoning: "Failed to analyze code. Please try again.",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!questions) return <LoaderUI />
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem-1px)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No questions available</h2>
          <p className="text-muted-foreground">Please add questions in the dashboard to start coding.</p>
        </div>
      </div>
    )
  }

  if (!selectedQuestion) return <LoaderUI />

  return (
    <ResizablePanelGroup direction="vertical" className="min-h-[calc(100vh-4rem-1px)]">
      {/* QUESTION SECTION */}
      <ResizablePanel defaultSize={30} minSize={20}>
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight">{selectedQuestion.title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">Choose your language and solve the problem</p>
                </div>
                <div className="flex items-center gap-3">
                  {isInterviewer ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono hidden md:inline-flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" />
                        Interviewer Controller
                      </span>
                      <Select value={selectedQuestionId || ""} onValueChange={handleQuestionChange}>
                        <SelectTrigger className="w-[180px] glass-surface border-white/10">
                          <SelectValue placeholder="Select question" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-white/10">
                          {questions.map((q: Question) => (
                            <SelectItem key={q._id} value={q._id}>
                              {q.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-slate-400">Assigned:</span>
                      <span className="font-semibold text-white truncate max-w-[140px]">{selectedQuestion.title}</span>
                    </div>
                  )}

                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <img src={`/${language}.png`} alt={language} className="w-5 h-5 object-contain" />
                          {LANGUAGES.find((l) => l.id === language)?.name}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.filter((lang) => selectedQuestion.supportedLanguages.includes(lang.id)).map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          <div className="flex items-center gap-2">
                            <img src={`/${lang.id}.png`} alt={lang.name} className="w-5 h-5 object-contain" />
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PROBLEM DESC. */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <BookIcon className="h-5 w-5 text-primary/80" />
                  <CardTitle>Problem Description</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{selectedQuestion.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* PROBLEM EXAMPLES */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                  <CardTitle>Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-full w-full rounded-md border">
                    <div className="p-4 space-y-4">
                      {selectedQuestion.examples.map((example: Example, index: number) => (
                        <div key={index} className="space-y-2">
                          <p className="font-medium text-sm">Example {index + 1}:</p>
                          <ScrollArea className="h-full w-full rounded-md">
                            <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono">
                              <div>Input: {example.input}</div>
                              <div>Output: {example.output}</div>
                              {example.explanation && (
                                <div className="pt-2 text-muted-foreground">Explanation: {example.explanation}</div>
                              )}
                            </pre>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </div>
                      ))}
                    </div>
                    <ScrollBar />
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* CONSTRAINTS */}
              {selectedQuestion.constraints && selectedQuestion.constraints.length > 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <AlertCircleIcon className="h-5 w-5 text-blue-500" />
                    <CardTitle>Constraints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                      {selectedQuestion.constraints.map((constraint: string, index: number) => (
                        <li key={index} className="text-muted-foreground">
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* CODE EDITOR */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="h-full flex flex-col">
          {/* CANDIDATE RECEIVED HINT BANNER */}
          {!isInterviewer && candidateReceivedHint && (
            <div className="mx-4 my-2 p-3 rounded-2xl glass-card border border-amber-500/40 bg-gradient-to-r from-amber-950/70 via-slate-900/90 to-slate-950/90 shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-top-2 z-20 shrink-0">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 mt-0.5">
                  <LightbulbIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Hint from Interviewer • Level {candidateReceivedHint.level}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                      Socratic Assistance
                    </span>
                  </div>
                  <p className="text-xs text-slate-100 font-mono leading-relaxed mt-1">
                    "{candidateReceivedHint.hint}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCandidateReceivedHint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-xs cursor-pointer"
                title="Dismiss hint"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={language}
              language={language}
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 18,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                wordWrap: "on",
                wrappingIndent: "indent",
              }}
            />
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* TABS SECTION */}
      <ResizablePanel defaultSize={20} minSize={15}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-2 bg-muted/30">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "input" | "output" | "analysis")}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="input">Input</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2 mr-2">
                  {!isInterviewer && (
                    <Button
                      onClick={handleRequestHint}
                      size="sm"
                      variant="outline"
                      className="glass-btn-secondary text-amber-300 border-amber-500/30 hover:bg-amber-500/10 cursor-pointer text-xs"
                      title="Request a gentle hint or clarification from your interviewer"
                    >
                      <LightbulbIcon className="h-3.5 w-3.5 mr-1 text-amber-400" />
                      Request Hint
                    </Button>
                  )}

                  <Button onClick={handleRunCode} disabled={isExecuting} size="sm" variant="secondary" className="cursor-pointer">
                    <PlayIcon className="h-4 w-4 mr-1" />
                    {isExecuting ? "Running..." : "Run Code"}
                  </Button>
                  <Button onClick={handleSubmitCode} disabled={isAnalyzing} size="sm" className="glass-btn-primary cursor-pointer">
                    <SendIcon className="h-4 w-4 mr-1" />
                    {isAnalyzing ? "Analyzing..." : "Submit Solution"}
                  </Button>
                </div>
              </div>

              <div className="h-full">
                <TabsContent value="input" className="h-full p-2">
                  <Textarea
                    placeholder="Enter input for your code here..."
                    className="h-full font-mono text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="output" className="h-full p-2">
                  <ExecutionResult result={executionResult} isLoading={isExecuting} />
                </TabsContent>
                <TabsContent value="analysis" className="h-full p-2">
                  <AnalysisResult result={analysisResult} isLoading={isAnalyzing} isInterviewer={isInterviewer} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default CodeEditor
